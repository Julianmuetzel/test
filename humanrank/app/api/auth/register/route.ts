import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email, username, password, age, gender, country } = await req.json();

    if (!email || !username || !password) {
      return NextResponse.json({ error: "Pflichtfelder fehlen." }, { status: 400 });
    }

    if (username.length < 3 || username.length > 30) {
      return NextResponse.json({ error: "Benutzername: 3–30 Zeichen." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Passwort: mindestens 8 Zeichen." }, { status: 400 });
    }

    const { data: byEmail } = await supabase
      .from("users")
      .select("email, username")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    const { data: byUsername } = await supabase
      .from("users")
      .select("username")
      .eq("username", username.toLowerCase())
      .maybeSingle();

    if (byEmail) {
      return NextResponse.json({ error: "E-Mail bereits registriert." }, { status: 409 });
    }
    if (byUsername) {
      return NextResponse.json({ error: "Benutzername bereits vergeben." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const now = new Date().toISOString();
    const id = crypto.randomUUID();

    const { data: user, error } = await supabase
      .from("users")
      .insert({
        id,
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        passwordHash,
        age: age ? parseInt(age) : null,
        gender: gender || null,
        country: country || null,
        createdAt: now,
        updatedAt: now,
      })
      .select("id, username")
      .single();

    if (error) throw error;

    return NextResponse.json({ id: user.id, username: user.username }, { status: 201 });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Interner Serverfehler." }, { status: 500 });
  }
}
