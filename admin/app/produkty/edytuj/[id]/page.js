"use client";
import ProductForm from "@/components/ProductForm";
import Layout from "@/components/layout";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditProductPage() {
  const [productInfo, setProductInfo] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    fetch(`/api/produkty/${id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Pobrane dane produktu z API (szczegółowo):", {
          ...data,
          images: data.images || [],
        });
        setProductInfo(data);
      })
      .catch((error) => {
        console.error("Błąd podczas pobierania produktu:", error);
      });
  }, [id]);

  if (!productInfo) return <div>Ładowanie...</div>;

  return (
    <Layout>
      <h1>Edytuj produkt</h1>
      <ProductForm {...productInfo} />
    </Layout>
  );
}
