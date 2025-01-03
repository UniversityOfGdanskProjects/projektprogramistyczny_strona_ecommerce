import { mongooseConnect } from "../../../../lib/mongoose";
import { Category } from "@/models/Category";

export async function PUT(request, { params }) {
  try {
    await mongooseConnect();
    const { id } = params;
    const data = await request.json();
    const category = await Category.findByIdAndUpdate(id, data, { new: true });
    return new Response(JSON.stringify(category), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Błąd podczas aktualizacji kategorii" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await mongooseConnect();
    const { id } = params;
    await Category.findByIdAndDelete(id);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Błąd podczas usuwania kategorii" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
