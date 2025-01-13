"use client";
import Center from "./Center";
import styled from "styled-components";
import Button from "./Button";
import { useEffect, useState } from "react";
import ProductBox from "./ProductsGrid";
import { useCart } from "./CartContext";
import { useSession } from "next-auth/react";

const Bg = styled.div`
  background-color: #222;
  color: #fff;
  padding: 50px 0;
`;

const Title = styled.h1`
  margin: 0;
  font-weight: normal;
  font-size: 2.5rem;
`;

const Desc = styled.p`
  color: #aaa;
`;

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 0.9fr 1fr;
  gap: 40px;
  img {
    max-width: 100%;
  }
`;

const Column = styled.div`
  display: flex;
  align-items: center;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 25px;
`;

const WelcomeMessage = styled.div`
  color: #aaa;
  margin-bottom: 20px;
  font-size: 1.2rem;
`;

export default function Featured() {
  const { addProduct } = useCart();
  const [products, setProducts] = useState([]);
  const [macbookProduct, setMacbookProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    fetch("/api/products")
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        console.log("Raw API response:", data);

        if (!data) {
          throw new Error("No data received");
        }

        const productsArray = Array.isArray(data) ? data : Object.values(data);

        if (productsArray.length === 0) {
          console.warn("Received empty products array");
        }

        console.log("Processed products array:", productsArray);

        setProducts(productsArray);

        const macbook = productsArray.find((p) =>
          p?.title?.toLowerCase().includes("macbook")
        );

        if (macbook) {
          console.log("Found Macbook product:", macbook);
          setMacbookProduct(macbook);
        } else {
          console.warn("Macbook product not found in the data");
        }
      })
      .catch((err) => {
        console.error("Error loading products:", err);
        setError(err.message);
        setProducts([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleAddToCart = () => {
    if (macbookProduct) {
      const productToAdd = {
        id: macbookProduct._id,
        title: macbookProduct.title,
        price: macbookProduct.price,
        image: macbookProduct.images?.[0],
      };
      console.log("Dodawanie produktu do koszyka:", productToAdd);
      addProduct(productToAdd);
    } else {
      console.warn("Nie można dodać produktu - brak danych o MacBooku");
    }
  };

  if (error) {
    console.error("Błąd ładowania produktów:", error);
  }

  return (
    <>
      <Bg>
        <Center>
          {session && (
            <WelcomeMessage>Witaj, {session.user.email}!</WelcomeMessage>
          )}
          <Wrapper>
            <Column>
              <div>
                <Title>Macbook Pro M2</Title>
                <Desc>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam.
                </Desc>
                <ButtonWrapper>
                  <Button $outline $white>
                    Czytaj więcej
                  </Button>
                  <Button
                    $primary
                    onClick={handleAddToCart}
                    disabled={!macbookProduct}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6"
                    >
                      <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
                    </svg>
                    Dodaj do koszyka
                  </Button>
                </ButtonWrapper>
              </div>
            </Column>
            <Column>
              <img
                src="https://ifixindia.in/wp-content/uploads/2018/09/macbook-air-png-transparent-background-6.png"
                alt="Macbook Pro"
              />
            </Column>
          </Wrapper>
        </Center>
      </Bg>
      <Center>
        {isLoading ? (
          <div>Ładowanie produktów...</div>
        ) : error ? (
          <div>Błąd: {error}</div>
        ) : (
          <ProductBox products={products} />
        )}
      </Center>
    </>
  );
}
