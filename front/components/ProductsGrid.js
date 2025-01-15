"use client";
import styled from "styled-components";
import { useCart } from "./CartContext";
import Link from "next/link";

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 40px;
  padding-top: 30px;
`;

const ProductWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProductLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  flex-grow: 1;
  display: flex;
  flex-direction: column;

  &:hover {
    img {
      transform: scale(1.05);
      transition: transform 0.2s;
    }
  }
`;

const ImageWrapper = styled.div`
  padding: 10px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: 100%;
    max-height: 150px;
    object-fit: contain;
    transition: transform 0.2s;
  }
`;

const Title = styled.h2`
  font-weight: normal;
  font-size: 1rem;
  margin: 5px 0;
  color: inherit;
  text-decoration: none;
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
`;

const Button = styled.button`
  border: 0;
  padding: 8px 12px;
  background-color: #5542f6;
  color: white;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #1100af;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin: 30px 0 0 0;
`;

export default function ProductBox({ products, showTitle = true }) {
  const { addProduct } = useCart();

  if (!Array.isArray(products)) {
    console.log("Products is not an array:", products);
    return <div>Loading...</div>;
  }

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    const productToAdd = {
      id: product._id,
      title: product.title,
      price: product.price,
      image: product.images?.[0],
    };
    addProduct(productToAdd);
  };

  return (
    <>
      {showTitle && <SectionTitle>Najnowsze produkty</SectionTitle>}
      <ProductsGrid>
        {products.map((product) => (
          <ProductWrapper key={product._id}>
            <ProductLink href={`/produkt/${product._id}`}>
              <ImageWrapper>
                <img src={product.images?.[0]} alt={product.title} />
              </ImageWrapper>
              <Title>{product.title}</Title>
              <PriceRow>
                <Price>{product.price} zł</Price>
                <Button onClick={(e) => handleAddToCart(e, product)}>
                  Dodaj do koszyka
                </Button>
              </PriceRow>
            </ProductLink>
          </ProductWrapper>
        ))}
      </ProductsGrid>
    </>
  );
}
