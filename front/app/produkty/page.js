"use client";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "@/components/Headers";
import Center from "@/components/Center";
import ProductBox from "@/components/ProductsGrid";

const Title = styled.h1`
  font-size: 2.5rem;
  margin: 30px 0;
  font-weight: normal;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 50px 0;
  font-size: 1.2rem;
  color: #555;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 50px 0;
  color: #ff0000;
  font-size: 1.2rem;
`;

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/all-products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError("Wystąpił błąd podczas ładowania produktów");
        setIsLoading(false);
        console.error(err);
      });
  }, []);

  return (
    <>
      <Header />
      <Center>
        <Title>Wszystkie produkty</Title>
        {isLoading ? (
          <LoadingMessage>Ładowanie produktów...</LoadingMessage>
        ) : error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : (
          <ProductBox products={products} showTitle={false} />
        )}
      </Center>
    </>
  );
}
