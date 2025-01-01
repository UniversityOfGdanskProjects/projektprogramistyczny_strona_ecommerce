"use client";
import Layout from "@/components/layout";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const response = await axios.get("/api/produkty");
      setProducts(response.data);
    } catch (error) {
      console.error("Błąd podczas pobierania produktów:", error);
    }
  }

  return (
    <Layout>
      <div className="mt-5">
        <Link
          className="bg-green-900 rounded-md text-white py-1 px-2 mt-5"
          href={"/produkty/nowe"}
        >
          Dodaj nowy produkt
        </Link>
      </div>
      <table className="basic mt-4">
        <thead>
          <tr>
            <td className="text-black ">
              <b>Nazwa produktu</b>
            </td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td className="text-black">{product.title}</td>
              <td>
                <Link href={`/produkty/edytuj/${product._id}`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                  Edytuj
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}
