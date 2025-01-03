"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/layout";

export default function Categories() {
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const response = await axios.get("/api/produkty/kategorie");
      setCategories(response.data);
    } catch (error) {
      console.error("Błąd podczas pobierania kategorii:", error);
    }
  }

  async function saveCategory(ev) {
    ev.preventDefault();
    setIsSubmitting(true);

    const categoryData = {
      name,
      parent: parentCategory === "" ? null : parentCategory,
    };

    console.log("Wysyłane dane:", categoryData);

    try {
      if (editingCategory) {
        await axios.put(
          `/api/produkty/kategorie/${editingCategory._id}`,
          categoryData
        );
        setEditingCategory(null);
      } else {
        await axios.post("/api/produkty/kategorie", categoryData);
      }
      setName("");
      setParentCategory("");
      await fetchCategories();
    } catch (error) {
      console.error("Błąd przy zapisie kategorii:", error);
      alert("Wystąpił błąd przy zapisie kategorii.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deleteCategory(categoryId) {
    if (window.confirm("Czy na pewno chcesz usunąć tę kategorię?")) {
      try {
        await axios.delete(`/api/produkty/kategorie/${categoryId}`);
        await fetchCategories();
      } catch (error) {
        console.error("Błąd podczas usuwania kategorii:", error);
        alert("Wystąpił błąd podczas usuwania kategorii.");
      }
    }
  }

  function editCategory(category) {
    setEditingCategory(category);
    setName(category.name);
    setParentCategory(category.parentCategory || "");
  }

  return (
    <Layout>
      <h1>
        <b>Kategorie</b>
      </h1>
      <label>
        {editingCategory ? "Edytuj kategorię" : "Nowa nazwa kategorii"}
      </label>
      <form
        onSubmit={saveCategory}
        className="flex flex-col sm:flex-row gap-2 mr-2"
      >
        <input
          className="mb-0 min-w-0 flex-1"
          type="text"
          placeholder="Nazwa kategorii"
          onChange={(ev) => setName(ev.target.value)}
          value={name}
          required
        />
        <select
          className="mb-0 min-w-0 flex-1"
          value={parentCategory}
          onChange={(ev) => setParentCategory(ev.target.value)}
        >
          <option value="0">Brak kategorii nadrzędnej</option>
          {categories.map((category) => (
            <option
              key={category._id}
              value={category._id}
              disabled={editingCategory && editingCategory._id === category._id}
            >
              {category.name}
            </option>
          ))}
        </select>
        <div className="flex gap-2 shrink-0">
          <button
            type="submit"
            className="btn-primary min-w-[100px] whitespace-nowrap"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Zapisywanie..."
              : editingCategory
              ? "Aktualizuj"
              : "Zapisz"}
          </button>
          {editingCategory && (
            <button
              type="button"
              onClick={() => {
                setEditingCategory(null);
                setName("");
                setParentCategory("");
              }}
              className="btn-default min-w-[100px] whitespace-nowrap"
            >
              Anuluj
            </button>
          )}
        </div>
      </form>
      <table className="basic mt-4">
        <thead>
          <tr>
            <td>Nazwa kategorii</td>
            <td>Kategoria nadrzędna</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category._id}>
              <td>{category.name}</td>
              <td>
                {categories.find((c) => c._id === category.parent)?.name || "-"}
              </td>
              <td className="flex flex-col sm:flex-row gap-1">
                <button
                  onClick={() => editCategory(category)}
                  className="btn-primary flex gap-1 items-center justify-center whitespace-nowrap min-w-[120px]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                  Edytuj
                </button>
                <button
                  onClick={() => deleteCategory(category._id)}
                  className="btn-primary flex gap-1 items-center justify-center whitespace-nowrap min-w-[120px]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                  Usuń
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}
