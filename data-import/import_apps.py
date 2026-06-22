#!/usr/bin/env python3
"""
Import structured app data (data-import/apps.json) into MongoDB.

Idempotent: upserts each record by its natural key ("slug") into the
target collection, so re-running updates rather than duplicates.

Usage:
    export MONGODB_URI="mongodb+srv://USER:PASS@host/?..."   # do NOT hardcode credentials
    python3 data-import/import_apps.py [--db festive_gdpr_privacy] [--dry-run]

Requires: pymongo, dnspython
    pip install pymongo dnspython
"""
import argparse
import datetime as dt
import json
import os
import sys
from pathlib import Path

try:
    from pymongo import MongoClient, UpdateOne
    from pymongo.errors import PyMongoError
except ImportError:
    sys.exit("Missing dependency: run `pip install pymongo dnspython`")

DATA_FILE = Path(__file__).with_name("apps.json")


def load_data():
    with DATA_FILE.open(encoding="utf-8") as fh:
        return json.load(fh)


def main():
    ap = argparse.ArgumentParser(description="Import app data into MongoDB.")
    ap.add_argument("--db", default=os.environ.get("MONGODB_DB", "festive_gdpr_privacy"),
                    help="Target database name (default: festive_gdpr_privacy)")
    ap.add_argument("--uri", default=os.environ.get("MONGODB_URI"),
                    help="MongoDB connection URI (or set MONGODB_URI env var)")
    ap.add_argument("--dry-run", action="store_true",
                    help="Validate and show what would be written, without connecting")
    args = ap.parse_args()

    data = load_data()
    meta = data.get("_meta", {})
    records = data.get("records", [])
    key = meta.get("natural_key", "slug")
    collection_name = meta.get("target_collection", "competitor_apps")

    if not records:
        sys.exit("No records found in apps.json")

    now = dt.datetime.now(dt.timezone.utc)
    ops = []
    for rec in records:
        if key not in rec:
            sys.exit(f"Record missing natural key '{key}': {rec.get('name')}")
        doc = dict(rec)
        doc["updated_at"] = now
        ops.append(UpdateOne({key: doc[key]},
                             {"$set": doc, "$setOnInsert": {"created_at": now}},
                             upsert=True))

    print(f"Loaded {len(records)} record(s) for collection "
          f"'{collection_name}' (key='{key}'):")
    for rec in records:
        v = rec.get("verification", {}).get("status", "?")
        print(f"  - {rec[key]:<26} [{v}]")

    if args.dry_run:
        print("\n--dry-run: no database connection made.")
        return

    if not args.uri:
        sys.exit("No connection URI. Set MONGODB_URI env var or pass --uri.")

    try:
        client = MongoClient(args.uri, serverSelectionTimeoutMS=10000)
        client.admin.command("ping")
    except PyMongoError as exc:
        sys.exit(
            "Could not connect to MongoDB: "
            f"{type(exc).__name__}: {exc}\n"
            "Check that outbound port 27017 is allowed by the network policy "
            "and that this host's IP is in the Atlas allowlist."
        )

    coll = client[args.db][collection_name]
    try:
        result = coll.bulk_write(ops, ordered=False)
        print(f"\nDone. upserted={result.upserted_count} "
              f"modified={result.modified_count} matched={result.matched_count}")
    except PyMongoError as exc:
        sys.exit(f"Write failed: {type(exc).__name__}: {exc}")
    finally:
        client.close()


if __name__ == "__main__":
    main()
