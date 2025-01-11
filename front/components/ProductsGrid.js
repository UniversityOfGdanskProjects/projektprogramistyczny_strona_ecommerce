"use client";
import styled from "styled-components";
import { useCart } from "./CartContext";

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 40px;
  padding-top: 30px;
`;

const ProductWrapper = styled.div`
  display: flex;
  flex-direction: column;
  img {
    max-width: 100%;
    max-height: 150px;
    object-fit: contain;
  }
`;

const Title = styled.h2`
  font-weight: normal;
  font-size: 1rem;
  margin-top:5px
  color: inherit;
  text-decoration: none;
  margin-bottom: auto; // This helps push the price row to the bottom
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
  background-color: #5542f6; // Purple color
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

export default function ProductBox({ products }) {
  const { addProduct, cartProducts } = useCart();

  if (!Array.isArray(products)) {
    console.log("Products is not an array:", products);
    return <div>Loading...</div>;
  }

  const handleAddToCart = (product) => {
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
      <SectionTitle>Najnowsze produkty</SectionTitle>
      <ProductsGrid>
        {products.map((product) => (
          <ProductWrapper key={product._id}>
            <img src={product.images?.[0]} alt={product.title} />
            <Title>{product.title}</Title>
            <PriceRow>
              <Price>{product.price} zł</Price>
              <Button onClick={() => handleAddToCart(product)}>
                Dodaj do koszyka
              </Button>
            </PriceRow>
          </ProductWrapper>
        ))}
      </ProductsGrid>
    </>
  );
}
