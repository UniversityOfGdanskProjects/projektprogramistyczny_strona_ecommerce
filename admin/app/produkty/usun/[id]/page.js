"use client";
import Layout from "@/components/layout";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export default function DeleteProductPage() {
  const router = useRouter();
  const [productInfo, setProductInfo] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await axios.get(`/api/produkty/${id}`);
        setProductInfo(response.data);
      } catch (error) {
        console.error("Błąd podczas pobierania danych produktu:", error);
      }
    }

    if (id) {
      fetchProduct();
    }
  }, [id]);

  async function deleteProduct() {
    try {
      await axios.delete(`/api/produkty/${id}`);
      router.push("/produkty");
    } catch (error) {
      console.error("Błąd podczas usuwania produktu:", error);
      alert("Wystąpił błąd podczas usuwania produktu.");
    }
  }

  function goBack() {
    router.push("/produkty");
  }

  return (
    <Layout>
      <h1 className="text-center">
        Czy na pewno chcesz usunąć produkt &nbsp;"{productInfo?.title}"?
      </h1>
      <div className="flex gap-2 justify-center">
        <button onClick={deleteProduct} className="btn-red">
          TAK
        </button>
        <button onClick={goBack} className="btn-default">
          NIE
        </button>
      </div>
    </Layout>
  );
}
