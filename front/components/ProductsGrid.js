"use client";
import styled from "styled-components";
import Button from "./Button";
import { useCart } from "./CartContext";

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 20px;
  padding-top: 30px;
`;

const ProductWrapper = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  img {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 5px;
  }
`;

const Title = styled.h2`
  font-weight: normal;
  font-size: 1rem;
  margin: 10px 0;
  color: inherit;
  text-decoration: none;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2px;
`;

const Price = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
`;

export default function ProductBox({ products }) {
  const { addProduct } = useCart();

  return (
    <ProductsGrid>
      {products?.map((product) => (
        <ProductWrapper key={product._id}>
          <img src={product.images?.[0]} alt={product.title} />
          <Title>{product.title}</Title>
          <PriceRow>
            <Price>{product.price} zł</Price>
            <Button $white onClick={() => addProduct(product._id)}>
              Dodaj do koszyka
            </Button>
          </PriceRow>
        </ProductWrapper>
      ))}
    </ProductsGrid>
  );
}
