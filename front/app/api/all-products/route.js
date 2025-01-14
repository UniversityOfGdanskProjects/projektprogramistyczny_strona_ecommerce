import { mongooseConnect } from "../../lib/mongoose";
import { Product } from "../../../models/Product";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await mongooseConnect();
    const products = await Product.find({}, null, {
      sort: { createdAt: -1 },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
