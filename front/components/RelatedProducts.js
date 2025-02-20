import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useCart } from "@/components/CartContext";
import Link from "next/link";

const RelatedSection = styled.div`
  margin: 40px 0;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: normal;
  margin: 30px 0 20px;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`;

const ProductBox = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #eee;
  display: flex;
  flex-direction: column;
`;

const WhiteBox = styled(Link)`
  background-color: white;
  padding: 20px;
  height: 120px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: 1px solid #eee;
  img {
    max-width: 100%;
    max-height: 80px;
  }
`;

const Title2 = styled.div`
  font-weight: normal;
  font-size: 1rem;
  margin: 10px 0;
  color: inherit;
  text-decoration: none;
`;

const ProductInfoBox = styled.div`
  margin-top: 10px;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
`;

const Price = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  margin-right: 20px;
`;

const CartButton = styled.button`
  background-color: transparent;
  border: none;
  width: 40px;
  height: 40px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  color: #5542f6;

  &:hover {
    background-color: rgba(85, 66, 246, 0.1);
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

export default function RelatedProducts({ currentProduct, categoryId }) {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { addProduct } = useCart();

  useEffect(() => {
    if (categoryId) {
      fetch(`/api/products/related/${categoryId}`)
        .then((res) => res.json())
        .then((data) => {
          const productsArray = Array.isArray(data) ? data : [];
          const filtered = productsArray.filter(
            (product) => product._id !== currentProduct
          );
          setRelatedProducts(filtered.slice(0, 4));
        })
        .catch((error) => {
          console.error("Error loading related products:", error);
          setRelatedProducts([]);
        });
    }
  }, [categoryId, currentProduct]);

  const handleAddToCart = useCallback(
    (product) => {
      addProduct({
        id: product._id,
        title: product.title,
        price: product.price,
        image: product.images?.[0],
      });
    },
    [addProduct]
  );

  if (relatedProducts.length === 0) return null;

  return (
    <RelatedSection>
      <Title>Podobne produkty</Title>
      <ProductsGrid>
        {relatedProducts.map((product) => (
          <ProductBox key={product._id}>
            <WhiteBox href={`/produkt/${product._id}`}>
              <div>
                <img src={product.images?.[0]} alt={product.title} />
              </div>
            </WhiteBox>
            <ProductInfoBox>
              <Title2>{product.title}</Title2>
              <PriceRow>
                <Price>{product.price} zł</Price>
                <CartButton onClick={() => handleAddToCart(product)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25Z" />
                    <path d="M3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
                  </svg>
                </CartButton>
              </PriceRow>
            </ProductInfoBox>
          </ProductBox>
        ))}
      </ProductsGrid>
    </RelatedSection>
  );
}
