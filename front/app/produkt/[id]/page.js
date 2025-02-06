"use client";
import { useState, useEffect } from "react";
import { use } from "react";
import styled from "styled-components";
import Header from "@/components/Headers";
import Center from "@/components/Center";
import { useCart } from "@/components/CartContext";
import ProductReviews from "@/components/ProductReviews";
import RelatedProducts from "@/components/RelatedProducts";

const ProductWrapper = styled.div`
  margin: 40px 0;
`;

const ProductTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: normal;
  margin: 0 0 30px 0;
`;

const ProductLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }
`;

const ImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const MainImage = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 8px;
`;

const ImageButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: 10px;
`;

const ImageButton = styled.div`
  border: 2px solid ${(props) => (props.$active ? "#5542F6" : "#ccc")};
  border-radius: 5px;
  height: 80px;
  padding: 5px;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Price = styled.div`
  font-size: 2rem;
  font-weight: bold;
`;

const Description = styled.div`
  color: #555;
  font-size: 1rem;
  line-height: 1.6;
`;

const AddToCartButton = styled.button`
  background-color: #5542f6;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1rem;
  width: fit-content;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: #1100af;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

export default function ProductPage({ params }) {
  const resolvedParams = use(params);
  const { addProduct } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (resolvedParams?.id) {
      setIsLoading(true);
      fetch(`/api/products/${resolvedParams.id}`)
        .then((res) => res.json())
        .then((data) => {
          setProduct(data);
          setIsLoading(false);
        })
        .catch((err) => {
          setError("Wystąpił błąd podczas ładowania produktu");
          setIsLoading(false);
          console.error(err);
        });
    }
  }, [resolvedParams?.id]);

  const handleAddToCart = () => {
    if (product) {
      const productToAdd = {
        id: product._id,
        title: product.title,
        price: product.price,
        image: product.images?.[0],
      };
      addProduct(productToAdd);
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <Center>
          <div style={{ padding: "40px 0", textAlign: "center" }}>
            Ładowanie...
          </div>
        </Center>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <Center>
          <div style={{ padding: "40px 0", textAlign: "center", color: "red" }}>
            {error || "Nie znaleziono produktu"}
          </div>
        </Center>
      </>
    );
  }

  return (
    <>
      <Header />
      <Center>
        <ProductWrapper>
          <ProductTitle>{product.title}</ProductTitle>
          <ProductLayout>
            <ImageWrapper>
              <MainImage
                src={product.images?.[selectedImage]}
                alt={product.title}
              />
              {product.images?.length > 1 && (
                <ImageButtons>
                  {product.images.map((image, index) => (
                    <ImageButton
                      key={index}
                      $active={selectedImage === index}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img src={image} alt={`${product.title} ${index + 1}`} />
                    </ImageButton>
                  ))}
                </ImageButtons>
              )}
            </ImageWrapper>
            <ProductDetails>
              <Price>{product.price} zł</Price>
              <Description>{product.description}</Description>
              <AddToCartButton onClick={handleAddToCart}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25Z" />
                  <path d="M3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
                </svg>
                Dodaj do koszyka
              </AddToCartButton>
            </ProductDetails>
          </ProductLayout>

          <RelatedProducts
            currentProduct={product._id}
            categoryId={product.category}
          />
          <ProductReviews productId={product._id} />
        </ProductWrapper>
      </Center>
    </>
  );
}
