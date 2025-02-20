import { mongooseConnect } from "../../../../../lib/mongoose";
import { Category } from "@/models/Category";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    await mongooseConnect();
    const { id } = params;

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { error: "Kategoria nie znaleziona" },
        { status: 404 }
      );
    }

    let allProperties = [];

    if (category.properties) {
      allProperties = [...category.properties];
    }

    if (category.parent) {
      const parentCategory = await Category.findById(category.parent);
      if (parentCategory?.properties) {
        parentCategory.properties.forEach((parentProp) => {
          const existingPropIndex = allProperties.findIndex(
            (prop) => prop.name === parentProp.name
          );

          if (existingPropIndex === -1) {
            allProperties.push(parentProp);
          } else {
            const existingValues = new Set(
              allProperties[existingPropIndex].values
            );
            parentProp.values.forEach((value) => existingValues.add(value));
            allProperties[existingPropIndex].values =
              Array.from(existingValues);
          }
        });
      }
    }

    return NextResponse.json(allProperties);
  } catch (error) {
    console.error("Błąd podczas pobierania właściwości kategorii:", error);
    return NextResponse.json(
      { error: "Wystąpił błąd podczas pobierania właściwości" },
      { status: 500 }
    );
  }
}
