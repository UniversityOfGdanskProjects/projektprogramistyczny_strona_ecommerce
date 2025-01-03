"use client";
import Layout from "@/components/layout";

export default function Categories() {
  function saveCategory() {}
  return (
    <Layout>
      <h1>
        <b>Kategorie</b>
      </h1>
      <label>Nowa nazwa kategorii</label>
      <form onSubmit={saveCategory} className="flex gap-1">
        <input className="mb-0" type="text" placeholder="Nazwa kategorii" />
        <button type="submit" className="btn-primary py-1 mr-3">
          Zapisz
        </button>
      </form>
    </Layout>
  );
}
