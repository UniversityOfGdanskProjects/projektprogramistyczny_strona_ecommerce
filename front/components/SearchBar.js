"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import debounce from "lodash/debounce";

const SearchContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 20px auto;
  position: relative;
  margin-top: 10px;
`;

const SearchWrapper = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const InputGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  flex-wrap: wrap;
`;

const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 200px;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px;
  padding-right: 40px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #5542f6;
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: #5542f6;

  &:hover {
    color: #1100af;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const PriceInputs = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const PriceInput = styled.input`
  width: 100px;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #5542f6;
  }
`;

const SuggestionsContainer = styled.div`
  position: absolute;
  width: 100%;
  background: white;
  margin-top: 5px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 400px;
  overflow-y: auto;
`;

const SuggestionItem = styled.div`
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8f9fa;
  }

  img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 5px;
  }
`;

const ProductInfo = styled.div`
  flex: 1;
`;

const ProductTitle = styled.div`
  font-weight: 500;
  margin-bottom: 5px;
`;

const ProductPrice = styled.div`
  color: #5542f6;
  font-weight: 600;
`;

export default function SearchBar({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [products, setProducts] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/all-products");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
    };

    fetchProducts();
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

  const searchProducts = debounce((query) => {
    if (!Array.isArray(products)) return;

    const filtered = products.filter((product) => {
      const matchesQuery =
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        (product.description &&
          product.description.toLowerCase().includes(query.toLowerCase()));

      const matchesPrice =
        (!priceRange.min || product.price >= Number(priceRange.min)) &&
        (!priceRange.max || product.price <= Number(priceRange.max));

      return matchesQuery && matchesPrice;
    });

    setSuggestions(filtered.slice(0, 5));
  }, 300);

  const handleSearch = () => {
    setShowSuggestions(false);

    if (!Array.isArray(products)) return;

    const filtered = products.filter((product) => {
      const matchesQuery =
        searchQuery === "" ||
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description &&
          product.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()));

      const matchesPrice =
        (!priceRange.min || product.price >= Number(priceRange.min)) &&
        (!priceRange.max || product.price <= Number(priceRange.max));

      return matchesQuery && matchesPrice;
    });

    if (typeof onSearch === "function") {
      onSearch(filtered);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      setShowSuggestions(true);
      searchProducts(query);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
      if (typeof onSearch === "function") {
        onSearch(products);
      }
    }
  };

  const handlePriceChange = (type, value) => {
    setPriceRange((prev) => ({ ...prev, [type]: value }));
    searchProducts(searchQuery);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleProductClick = (productId) => {
    setShowSuggestions(false);
    router.push(`/produkt/${productId}`);
  };

  return (
    <SearchContainer ref={searchRef}>
      <SearchWrapper>
        <InputGroup>
          <SearchInputWrapper>
            <SearchInput
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
              placeholder="Wyszukaj produkty..."
            />
            <SearchButton onClick={handleSearch}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </SearchButton>
          </SearchInputWrapper>
          <PriceInputs>
            <PriceInput
              type="number"
              placeholder="Cena min"
              value={priceRange.min}
              onChange={(e) => handlePriceChange("min", e.target.value)}
            />
            <span>-</span>
            <PriceInput
              type="number"
              placeholder="Cena max"
              value={priceRange.max}
              onChange={(e) => handlePriceChange("max", e.target.value)}
            />
          </PriceInputs>
        </InputGroup>
      </SearchWrapper>

      {showSuggestions && suggestions.length > 0 && (
        <SuggestionsContainer>
          {suggestions.map((product) => (
            <SuggestionItem
              key={product._id}
              onClick={() => handleProductClick(product._id)}
            >
              {product.images?.[0] && (
                <img src={product.images[0]} alt={product.title} />
              )}
              <ProductInfo>
                <ProductTitle>{product.title}</ProductTitle>
                <ProductPrice>{product.price} zł</ProductPrice>
              </ProductInfo>
            </SuggestionItem>
          ))}
        </SuggestionsContainer>
      )}
    </SearchContainer>
  );
}
