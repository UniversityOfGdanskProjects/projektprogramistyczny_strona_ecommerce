import { mongooseConnect } from "../../../lib/mongoose";
import { Category } from "@/models/Category";
import { Types } from "mongoose";
export async function GET() {
  try {
    await mongooseConnect();
    const categories = await Category.find().lean();

    const serializedCategories = categories.map((cat) => ({
      ...cat,
      _id: cat._id.toString(),
      parent: cat.parent ? cat.parent.toString() : null, // zmiana z parentCategory na parent
    }));

    return new Response(JSON.stringify(serializedCategories), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Szczegółowy błąd:", error);
    return new Response(
      JSON.stringify({
        error: "Błąd podczas pobierania kategorii",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function POST(request) {
  try {
    await mongooseConnect();
    const data = await request.json();
    console.log("Otrzymane dane:", data); // do debugowania

    const categoryData = {
      name: data.name,
      parent: data.parent ? new Types.ObjectId(data.parent) : null, // zmiana z parentCategory na parent
    };

    console.log("Dane do zapisania w bazie:", categoryData); // do debugowania

    const newCategory = await Category.create(categoryData);
    console.log("Utworzona kategoria:", newCategory); // do debugowania

    const serializedCategory = {
      ...newCategory.toObject(),
      _id: newCategory._id.toString(),
      parent: newCategory.parent ? newCategory.parent.toString() : null,
    };

    return new Response(JSON.stringify(serializedCategory), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Szczegółowy błąd przy tworzeniu:", error);
    return new Response(
      JSON.stringify({
        error: "Błąd podczas tworzenia kategorii",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
