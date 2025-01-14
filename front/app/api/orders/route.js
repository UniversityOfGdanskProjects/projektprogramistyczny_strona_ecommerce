import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import clientPromise from "../../lib/mongodb";
import { sendOrderConfirmationEmail } from "../../lib/mail";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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
    console.log("Otrzymane dane:", body);

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
      userId: session.user.id,
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

    console.log("Dokument zamówienia:", orderDoc);

    const order = await db.collection("orders").insertOne(orderDoc);

    try {
      console.log("Rozpoczynam wysyłanie maila potwierdzającego...");

      const orderEmail = shippingAddress.email;

      await sendOrderConfirmationEmail(orderEmail, {
        _id: order.insertedId,
        products: orderDoc.products,
        totalAmount,
        status: "Nowe",
      });

      console.log(
        "Mail potwierdzający wysłany pomyślnie na adres:",
        orderEmail
      );
    } catch (emailError) {
      console.error("Błąd podczas wysyłania maila:", {
        message: emailError.message,
        code: emailError.code,
      });
    }
    return NextResponse.json(
      {
        message: "Zamówienie zostało złożone",
        orderId: order.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Szczegóły błędu:", error);
    return NextResponse.json(
      {
        error: "Wystąpił błąd podczas składania zamówienia",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
export async function GET(request) {
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

    const orders = await db
      .collection("orders")
      .find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .toArray();

    console.log("Pobrane zamówienia dla użytkownika:", orders);

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Błąd podczas pobierania zamówień:", error);
    return NextResponse.json(
      { error: "Wystąpił błąd podczas pobierania zamówień" },
      { status: 500 }
    );
  }
}
