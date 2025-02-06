import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import clientPromise from "../../lib/mongodb";
import { sendOrderConfirmationEmail } from "../../lib/mail";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET endpoint dla pobierania zamówień
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Musisz być zalogowany" },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db("ecommerce");

    console.log("Szukam zamówień dla użytkownika:", session.user.email);

    const orders = await db
      .collection("orders")
      .find({
        userEmail: session.user.email,
      })
      .sort({ createdAt: -1 })
      .toArray();

    console.log(`Znaleziono ${orders.length} zamówień`);

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Błąd podczas pobierania zamówień:", error);
    return NextResponse.json(
      { error: "Wystąpił błąd podczas pobierania zamówień" },
      { status: 500 }
    );
  }
}

// POST endpoint dla tworzenia zamówień
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Musisz być zalogowany" },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log("Otrzymane dane zamówienia:", body);

    const { products, totalAmount, shippingAddress, paymentMethod } = body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: "Brak produktów w zamówieniu" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("ecommerce");

    const orderDoc = {
      userEmail: session.user.email,
      products: products.map((product) => ({
        id: product.id,
        title: product.title,
        price: product.price,
        quantity: product.quantity,
      })),
      totalAmount,
      shippingAddress,
      paymentMethod,
      status: "Nowe",
      createdAt: new Date(),
    };

    const result = await db.collection("orders").insertOne(orderDoc);

    try {
      await sendOrderConfirmationEmail(shippingAddress.email, {
        _id: result.insertedId,
        products: orderDoc.products,
        totalAmount,
        status: "Nowe",
      });
    } catch (emailError) {
      console.error("Błąd podczas wysyłania maila:", emailError);
    }

    return NextResponse.json(
      {
        message: "Zamówienie zostało złożone",
        orderId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Błąd podczas składania zamówienia:", error);
    return NextResponse.json(
      { error: "Wystąpił błąd podczas składania zamówienia" },
      { status: 500 }
    );
  }
}
