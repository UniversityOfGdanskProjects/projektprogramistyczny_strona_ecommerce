import { mongooseConnect } from "../../../lib/mongoose";
import { Product } from "@/models/Product";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  try {
    await mongooseConnect();
    const { id } = params;
    const data = await request.json();
    console.log("Dane otrzymane w PUT:", data);

    const updateData = {
      title: data.title,
      description: data.description,
      price: data.price,
      images: data.images || [],
    };

    console.log("Dane do aktualizacji:", updateData);

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    console.log("Zaktualizowany produkt:", updatedProduct);

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  try {
    await mongooseConnect();
    const { id } = params;
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await mongooseConnect();
    const { id } = params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
