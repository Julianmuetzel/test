# App data import

Structured, verified data about the requested event/festival apps, plus an
idempotent importer for MongoDB.

## Files
- `apps.json` — structured records (target collection: `competitor_apps`).
- `import_apps.py` — upserts each record by `slug` (re-runnable, no duplicates).

## Run the import
The database was **not reachable from the build environment** (see below), so the
import has not been executed yet. Once you can reach the cluster:

```bash
pip install pymongo dnspython
export MONGODB_URI='mongodb+srv://USER:PASS@customer-apps.ytnyq5.mongodb.net/?retryWrites=true&w=majority'
python3 data-import/import_apps.py            # imports into db "festive_gdpr_privacy"
# or preview without connecting:
python3 data-import/import_apps.py --dry-run
```

Credentials are read from `MONGODB_URI` (env var) — never hardcode them.

## Status of the three sources
| Source | Status | Notes |
|---|---|---|
| FEST App (festapp.io) | ✅ verified | Official site + organizer/pricing pages |
| HighApe (highape.com) | ✅ verified | Official site + app stores; founder/funding from 3rd-party DBs (flagged) |
| `com.whatup.eventplanner` | ⚠️ not found | Play Store fetch 403 + package not locatable; needs correct URL/package id |

## Open blockers (need your action)
1. **Network egress:** outbound port `27017` to MongoDB Atlas times out in this
   environment (port 443 works; the egress allowlist blocked even api.ipify.org).
   Allow MongoDB Atlas / port 27017 in the environment's network policy, **and/or**
   run the importer from a host whose IP is in the Atlas IP allowlist.
2. **Credentials:** the password shared in chat must be treated as compromised —
   rotate it in Atlas and use the new one via `MONGODB_URI`.
3. **WhatsUp app:** confirm the correct Play Store URL / package id so its record
   can be enriched and verified.
