import { mongooseConnect } from "../../lib/mongoose";
import { Product } from "@/models/Product";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await mongooseConnect();
    const data = await req.json();
    console.log("Surowe dane przed zapisem:", data);

    const productData = {
      title: data.title,
      description: data.description,
      price: data.price,
      images: data.images || [],
    };

    console.log("Dane do zapisu w MongoDB:", productData);
    const product = await Product.create(productData);
    console.log("Produkt po zapisie:", product);
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await mongooseConnect();
    const products = await Product.find();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
