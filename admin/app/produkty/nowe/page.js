"use client";

import ProductForm from "@/components/ProductForm";
import Layout from "@/components/layout";

export default function NewProduct() {
  return (
    <Layout>
      <h1>
        <b>Dodaj nowy produkt</b>
      </h1>
      <ProductForm />
    </Layout>
  );
}
