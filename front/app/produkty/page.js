"use client";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "@/components/Headers";
import Center from "@/components/Center";
import ProductBox from "@/components/ProductsGrid";
import SearchBar from "@/components/SearchBar";

const Title = styled.h1`
  font-size: 2.5rem;
  margin: 30px 0;
  font-weight: normal;
`;

const SearchWrapper = styled.div`
  margin: 20px 0;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 50px 0;
  font-size: 1.2rem;
  color: #555;
`;
const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 30px 0;
`;

const PageButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: ${(props) => (props.$active ? "#5542F6" : "white")};
  color: ${(props) => (props.$active ? "white" : "black")};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => (props.$active ? "#5542F6" : "#f0f0f0")};
  }

  &:disabled {
    background: #eee;
    cursor: not-allowed;
  }
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 12; // Liczba produktów na stronę

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  async function fetchProducts() {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/all-products?page=${currentPage}&limit=${productsPerPage}`
      );
      const data = await response.json();
      setProducts(data.products);
      setTotalPages(data.pagination.totalPages);
      setIsLoading(false);
    } catch (err) {
      setError("Wystąpił błąd podczas ładowania produktów");
      setIsLoading(false);
      console.error(err);
    }
  }

  function handlePageChange(newPage) {
    window.scrollTo(0, 0); // Przewijanie na górę strony
    setCurrentPage(newPage);
  }

  return (
    <>
      <Header />
      <Center>
        <Title>Wszystkie produkty</Title>
        <SearchWrapper>
          <SearchBar />
        </SearchWrapper>
        {isLoading ? (
          <LoadingMessage>Ładowanie produktów...</LoadingMessage>
        ) : error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : (
          <>
            <ProductBox products={products} showTitle={false} />
            <PaginationWrapper>
              <PageButton
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Poprzednia
              </PageButton>

              {[...Array(totalPages)].map((_, index) => {
                // Pokazuj tylko kilka przycisków wokół aktualnej strony
                if (
                  index + 1 === 1 ||
                  index + 1 === totalPages ||
                  (index + 1 >= currentPage - 2 && index + 1 <= currentPage + 2)
                ) {
                  return (
                    <PageButton
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      $active={currentPage === index + 1}
                    >
                      {index + 1}
                    </PageButton>
                  );
                }

                if (
                  index + 1 === currentPage - 3 ||
                  index + 1 === currentPage + 3
                ) {
                  return <span key={index}>...</span>;
                }
                return null;
              })}

              <PageButton
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Następna
              </PageButton>
            </PaginationWrapper>
          </>
        )}
      </Center>
    </>
  );
}
