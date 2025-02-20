import { Product } from "./models/Product";

export default async function handler(req, res) {
  if (req.method === "POST") {
    console.log("Otrzymane dane:", req.body);

    try {
      const { title, description, price } = req.body;

      console.log("Dane produktu do zapisania:", { title, description, price });

      const newProduct = new Product({ title, description, price });
      await newProduct.save();

      res.status(200).json(newProduct);
    } catch (error) {
      console.error("Błąd przy zapisywaniu produktu:", error);
      res.status(500).json({ error: "Błąd serwera" });
    }
  } else {
    res.status(405).json({ error: "Metoda nieobsługiwana" });
  }
}
