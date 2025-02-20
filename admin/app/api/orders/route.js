import { NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("ecommerce");

    const orders = await db
      .collection("orders")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Błąd podczas pobierania zamówień:", error);
    return NextResponse.json(
      { error: "Wystąpił błąd podczas pobierania zamówień" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { orderId, status } = await request.json();

    const client = await clientPromise;
    const db = client.db("ecommerce");

    const result = await db.collection("orders").updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Nie znaleziono zamówienia" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Status zamówienia został zaktualizowany",
    });
  } catch (error) {
    console.error("Błąd podczas aktualizacji zamówienia:", error);
    return NextResponse.json(
      { error: "Wystąpił błąd podczas aktualizacji zamówienia" },
      { status: 500 }
    );
  }
}
