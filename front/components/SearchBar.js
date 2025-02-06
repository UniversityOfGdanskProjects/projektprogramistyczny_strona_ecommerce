import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import debounce from "lodash/debounce";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        console.log("Fetching products...");
        const productsRes = await fetch("/api/all-products");
        console.log("Products response status:", productsRes.status);
        if (!productsRes.ok) {
          throw new Error(`Failed to fetch products: ${productsRes.status}`);
        }
        const productsData = await productsRes.json();
        console.log("Products data received:", productsData.length, "items");
        setProducts(productsData);

        console.log("Fetching categories...");
        const categoriesRes = await fetch("/api/categories");
        console.log("Categories response status:", categoriesRes.status);
        if (!categoriesRes.ok) {
          throw new Error(
            `Failed to fetch categories: ${categoriesRes.status}`
          );
        }
        const categoriesText = await categoriesRes.text();
        console.log("Raw categories response:", categoriesText);
        let categoriesData;
        try {
          categoriesData = JSON.parse(categoriesText);
          console.log("Categories data parsed:", categoriesData);
        } catch (e) {
          console.error("Failed to parse categories JSON:", e);
          throw new Error("Invalid categories JSON response");
        }
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setProducts([]);
        setCategories([]);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchProducts = debounce((query, category, price) => {
    setIsLoading(true);

    const filtered = products.filter((product) => {
      const matchesQuery =
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        (product.description &&
          product.description.toLowerCase().includes(query.toLowerCase()));

      const matchesCategory = !category || product.category === category;

      const matchesPrice =
        (!price.min || product.price >= Number(price.min)) &&
        (!price.max || product.price <= Number(price.max));

      return matchesQuery && matchesCategory && matchesPrice;
    });

    setSuggestions(filtered.slice(0, 5));
    setIsLoading(false);
  }, 300);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowSuggestions(true);

    if (query.length > 2) {
      searchProducts(query, selectedCategory, priceRange);
    } else {
      setSuggestions([]);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    if (searchQuery.length > 2) {
      searchProducts(searchQuery, e.target.value, priceRange);
    }
  };

  const handlePriceChange = (type, value) => {
    setPriceRange((prev) => ({ ...prev, [type]: value }));
    if (searchQuery.length > 2) {
      searchProducts(searchQuery, selectedCategory, {
        ...priceRange,
        [type]: value,
      });
    }
  };

  const handleProductClick = (productId) => {
    setShowSuggestions(false);
    router.push(`/produkt/${productId}`);
  };

  return (
    <div className="relative w-full max-w-2xl" ref={searchRef}>
      <div className="flex flex-col gap-2 bg-white p-2 rounded-lg shadow-sm">
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Wyszukaj produkty..."
            className="flex-1 min-w-[200px] p-2 border rounded-md focus:outline-none focus:border-blue-500"
          />
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="p-2 border rounded-md focus:outline-none focus:border-blue-500 min-w-[150px]"
          >
            <option value="">Wszystkie kategorie</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 flex-wrap">
          <input
            type="number"
            placeholder="Cena min"
            value={priceRange.min}
            onChange={(e) => handlePriceChange("min", e.target.value)}
            className="w-24 p-2 border rounded-md focus:outline-none focus:border-blue-500"
          />
          <input
            type="number"
            placeholder="Cena max"
            value={priceRange.max}
            onChange={(e) => handlePriceChange("max", e.target.value)}
            className="w-24 p-2 border rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {showSuggestions && searchQuery.length > 2 && (
        <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg z-50">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Wyszukiwanie...</div>
          ) : suggestions.length > 0 ? (
            suggestions.map((product) => (
              <div
                key={product._id}
                onClick={() => handleProductClick(product._id)}
                className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
              >
                {product.images?.[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
                <div>
                  <div className="font-medium">{product.title}</div>
                  <div className="text-sm text-gray-600">
                    {product.price} zł
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">Brak wyników</div>
          )}
        </div>
      )}
    </div>
  );
}
