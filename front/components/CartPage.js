"use client";
import styled from "styled-components";
import Center from "@/components/Center";
import Button from "@/components/Button";
import { useCart } from "@/components/CartContext";
import { useState } from "react";

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 40px;
  margin-top: 40px;
`;

const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
`;

const ProductRow = styled.div`
  display: grid;
  grid-template-columns: 0.8fr 1.2fr 1fr;
  gap: 20px;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
`;

const ProductImage = styled.img`
  max-width: 100px;
  max-height: 100px;
`;

const QuantityLabel = styled.span`
  padding: 0 15px;
`;

const QuantityButton = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid #aaa;
  background-color: transparent;
  cursor: pointer;
  &:hover {
    background-color: #eee;
  }
`;

const TotalPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 500;
  margin-top: 20px;
  text-align: right;
`;

const Input = styled.input`
  width: 100%;
  padding: 5px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
`;

const Title = styled.h2`
  margin: 0 0 20px 0;
  font-weight: 500;
`;

const CartPage = () => {
  const { cartProducts, updateQuantity } = useCart();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    city: "",
    postalCode: "",
    street: "",
    country: "",
  });

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const totalPrice = cartProducts.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  return (
    <Center>
      <ColumnsWrapper>
        <Box>
          <Title>Koszyk</Title>
          {cartProducts?.map((product) => (
            <ProductRow key={product.id}>
              <ProductImage src={product.image} alt={product.title} />
              <div>
                <h3>{product.title}</h3>
                <p>{product.price} zł</p>
              </div>
              <div>
                <QuantityButton
                  onClick={() =>
                    updateQuantity(product.id, product.quantity - 1)
                  }
                >
                  -
                </QuantityButton>
                <QuantityLabel>{product.quantity}</QuantityLabel>
                <QuantityButton
                  onClick={() =>
                    updateQuantity(product.id, product.quantity + 1)
                  }
                >
                  +
                </QuantityButton>
              </div>
            </ProductRow>
          ))}
          <TotalPrice>Suma: {totalPrice} zł</TotalPrice>
        </Box>
        <Box>
          <Title>Dane do zamówienia</Title>
          <Input
            type="text"
            placeholder="Imię"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <Input
            type="text"
            placeholder="Nazwisko"
            name="surname"
            value={formData.surname}
            onChange={handleInputChange}
          />
          <Input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          <Input
            type="text"
            placeholder="Miasto"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
          />
          <Input
            type="text"
            placeholder="Kod pocztowy"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleInputChange}
          />
          <Input
            type="text"
            placeholder="Ulica"
            name="street"
            value={formData.street}
            onChange={handleInputChange}
          />
          <Input
            type="text"
            placeholder="Kraj"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
          />
          <Button $primary style={{ width: "100%", marginTop: "20px" }}>
            Przejdź do płatności
          </Button>
        </Box>
      </ColumnsWrapper>
    </Center>
  );
};

export default CartPage;
