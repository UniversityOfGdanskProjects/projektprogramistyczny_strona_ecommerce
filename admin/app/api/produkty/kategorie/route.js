import { mongooseConnect } from "../../../lib/mongoose";
import { Category } from "@/models/Category";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await mongooseConnect();
    const categories = await Category.find().populate("parent");

    const serializedCategories = categories.map((category) => ({
      _id: category._id.toString(),
      name: category.name,
      parent: category.parent?._id.toString() || null,
      properties: category.properties || [],
    }));

    return NextResponse.json(serializedCategories);
  } catch (error) {
    console.error("Błąd podczas pobierania kategorii:", error);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}
export async function POST(request) {
  try {
    await mongooseConnect();
    const data = await request.json();

    const categoryData = {
      name: data.name,
      parent: data.parent && data.parent !== "0" ? data.parent : undefined,
      properties: data.properties.map((p) => ({
        name: p.name,
        values: p.values.split(",").map((v) => v.trim()),
      })),
    };

    const category = await Category.create(categoryData);
    return NextResponse.json(category);
  } catch (error) {
    console.error("Błąd podczas tworzenia kategorii:", error);
    return NextResponse.json(
      { error: "Błąd serwera", details: error.message },
      { status: 500 }
    );
  }
}
