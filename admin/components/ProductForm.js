import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Spinner from "./spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images = [],
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [productImages, setProductImages] = useState(
    images.map((url, index) => ({
      id: index + 1,
      url: url,
    }))
  );
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  console.log("Inicjalizacja ProductForm z images:", images);

  async function saveProduct(ev) {
    ev.preventDefault();
    const data = {
      title,
      description,
      price,
      images: productImages.map((item) => item.url),
    };
    console.log("Dane przed wysłaniem:", data);
    try {
      if (_id) {
        const response = await axios.put(`/api/produkty/${_id}`, data);
        console.log("Odpowiedź z serwera (PUT):", response.data);
      } else {
        const response = await axios.post("/api/produkty", data);
        console.log("Odpowiedź z serwera (POST):", response.data);
      }
      setTitle("");
      setDescription("");
      setPrice("");
      setProductImages([]);
      router.push("/produkty");
    } catch (error) {
      console.error("Błąd podczas wysyłania danych:", error);
      alert("Wystąpił błąd podczas dodawania produktu");
    }
  }

  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }

      try {
        const response = await axios.post("/api/produkty/upload", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.data?.urls) {
          const newImages = response.data.urls.map((url, index) => ({
            id: Date.now() + index,
            url: url,
          }));
          setProductImages((prev) => [...prev, ...newImages]);
        }
      } catch (error) {
        console.error("Błąd podczas przesyłania zdjęć:", error);
        alert("Wystąpił błąd podczas przesyłania zdjęć");
      } finally {
        setIsUploading(false);
      }
    }
  }
  function uploadImagesOrder(productImages) {
    setProductImages(productImages);
  }
  return (
    <form onSubmit={saveProduct} className="flex flex-col">
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
      <div className="flex flex-col flex-wrapped">
        <label>Zdjęcia</label>
        <div className="mb-2">
          <label className="w-24 h-24 cursor-pointer flex flex-col items-center justify-center text-sm text-gray-500 rounded-lg bg-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
              />
            </svg>
            <div>Załącz zdjęcie</div>
            <input
              type="file"
              multiple
              onChange={uploadImages}
              className="hidden"
            ></input>
          </label>
        </div>
        {isUploading && (
          <div className="h-24">
            <Spinner />
            Ładowanie...
          </div>
        )}

        <ReactSortable
          list={productImages}
          className="flex flex-wrap gap-1 flex-row"
          setList={uploadImagesOrder}
        >
          {productImages.map((item) => (
            <div key={item.id} className="w-24 h-24">
              <img
                src={item.url}
                alt={`Zdjęcie`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}
        </ReactSortable>
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
  );
}
