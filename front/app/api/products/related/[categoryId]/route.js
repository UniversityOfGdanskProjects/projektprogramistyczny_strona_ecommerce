import { mongooseConnect } from "../../../../lib/mongoose";
import { Product } from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    await mongooseConnect();
    const { categoryId } = params;

    if (!categoryId) {
      return NextResponse.json([]);
    }

    const products = await Product.find({
      category: categoryId,
    })
      .limit(5)
      .select("title price images category")
      .lean();

    return NextResponse.json(products || []);
  } catch (error) {
    console.error("Błąd podczas pobierania powiązanych produktów:", error);
    return NextResponse.json([], { status: 500 });
  }
}
