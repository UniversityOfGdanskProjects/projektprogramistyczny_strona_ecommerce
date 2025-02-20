import { mongooseConnect } from "../../../../lib/mongoose";
import { Category } from "@/models/Category";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  try {
    await mongooseConnect();
    const { id } = params;

    await Category.findByIdAndDelete(id);

    return NextResponse.json({ message: "Kategoria usunięta" });
  } catch (error) {
    console.error("Błąd podczas usuwania kategorii:", error);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}
export async function PUT(request, { params }) {
  try {
    await mongooseConnect();
    const { id } = params;
    const data = await request.json();

    const categoryData = {
      name: data.name,
      parent: data.parent && data.parent !== "0" ? data.parent : undefined,
      properties: data.properties.map((p) => ({
        name: p.name,
        values: Array.isArray(p.values)
          ? p.values
          : typeof p.values === "string"
          ? p.values.split(",").map((v) => v.trim())
          : [],
      })),
    };

    const updatedCategory = await Category.findByIdAndUpdate(id, categoryData, {
      new: true,
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Błąd podczas aktualizacji kategorii:", error);
    return NextResponse.json(
      { error: "Błąd serwera", details: error.message },
      { status: 500 }
    );
  }
}
