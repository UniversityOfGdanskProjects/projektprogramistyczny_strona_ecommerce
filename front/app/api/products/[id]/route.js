import { mongooseConnect } from "../../../lib/mongoose";
import { Product } from "../../../../models/Product";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    await mongooseConnect();
    const product = await Product.findById(params.id);

    if (!product) {
      return NextResponse.json(
        { error: "Produkt nie został znaleziony" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Błąd podczas pobierania produktu" },
      { status: 500 }
    );
  }
}
