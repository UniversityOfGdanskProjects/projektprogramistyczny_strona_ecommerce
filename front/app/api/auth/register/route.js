import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import clientPromise from "../../../lib/mongodb";

export async function POST(request) {
  try {
    const { email, password, firstName, lastName } = await request.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: "Brak wymaganych danych" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("ecommerce");

    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Użytkownik już istnieje" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.collection("users").insertOne({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: "user",
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "Użytkownik został zarejestrowany" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Błąd rejestracji:", error);
    return NextResponse.json(
      { error: "Wystąpił błąd podczas rejestracji" },
      { status: 500 }
    );
  }
}
