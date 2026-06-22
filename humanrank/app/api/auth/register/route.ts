import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

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

    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { username: username.toLowerCase() },
        ],
      },
    });

    if (existing) {
      if (existing.email === email.toLowerCase()) {
        return NextResponse.json({ error: "E-Mail bereits registriert." }, { status: 409 });
      }
      return NextResponse.json({ error: "Benutzername bereits vergeben." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        passwordHash,
        age: age ? parseInt(age) : null,
        gender: gender || null,
        country: country || null,
      },
    });

    return NextResponse.json({ id: user.id, username: user.username }, { status: 201 });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Interner Serverfehler." }, { status: 500 });
  }
}
