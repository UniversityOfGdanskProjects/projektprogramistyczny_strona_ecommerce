import { mongooseConnect } from "../../lib/mongoose";
import { Product } from "../../../models/Product";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 12;
    const skip = (page - 1) * limit;

    await mongooseConnect();

    const totalProducts = await Product.countDocuments();

    const products = await Product.find({}, null, {
      sort: { createdAt: -1 },
      skip: skip,
      limit: limit,
    });

    return NextResponse.json({
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
