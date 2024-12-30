"use client";
import Layout from "@/components/layout";
import { useState } from "react";
import axios from "axios";

export default function NewProduct() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  async function createProduct(ev) {
    ev.preventDefault();
    const data = { title, description, price };
    try {
      const response = await axios.post("/api/produkty", data);
      setTitle("");
      setDescription("");
      setPrice("");
    } catch (error) {
      console.error("Błąd podczas wysyłania danych:", error);
      alert("Wystąpił błąd podczas dodawania produktu");
    }
  }

  return (
    <Layout>
      <form onSubmit={createProduct} className="flex flex-col">
        <h1>
          <b>Nowy Produkt</b>
        </h1>
        <div className="flex flex-col">
          <label>
            <b>Nazwa produktu</b>
          </label>
          <input
            type="text"
            placeholder="nazwa produktu"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
            className="border"
          />
        </div>
        <div className="flex flex-col">
          <label>
            <b>Opis</b>
          </label>
          <textarea
            placeholder="opis"
            className="border"
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label>
            <b>Cena</b>
          </label>
          <input
            type="number"
            placeholder="cena"
            className="border"
            value={price}
            onChange={(ev) => setPrice(ev.target.value)}
          />
        </div>
        <button type="submit" className="btn-primary">
          Zapisz
        </button>
      </form>
    </Layout>
  );
}
