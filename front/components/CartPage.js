"use client";
import styled from "styled-components";
import Center from "@/components/Center";
import Button from "@/components/Button";
import { useCart } from "@/components/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-top: 40px;

  @media (min-width: 768px) {
    grid-template-columns: 1.2fr 0.8fr;
    gap: 40px;
  }
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

const PaymentMethods = styled.div`
  margin: 20px 0;
`;

const PaymentMethod = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    border-color: #8273d1;
  }
`;

const CartPage = () => {
  const { cartProducts, updateQuantity, clearCart } = useCart();
  const [selectedPayment, setSelectedPayment] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!selectedPayment) {
      alert("Proszę wybrać metodę płatności");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          products: cartProducts,
          totalAmount: totalPrice,
          shippingAddress: {
            name: formData.name,
            surname: formData.surname,
            email: formData.email,
            city: formData.city,
            postalCode: formData.postalCode,
            street: formData.street,
            country: formData.country,
          },
          paymentMethod: selectedPayment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Wystąpił błąd podczas składania zamówienia"
        );
      }

      clearCart();

      alert(`Dziękujemy! Twoje zamówienie zostało złożone pomyślnie.
      Numer zamówienia: ${data.orderId}
      Na Twój adres email zostanie wysłane potwierdzenie zamówienia.`);

      const session = await fetch("/api/auth/session");
      const sessionData = await session.json();

      if (sessionData) {
        router.push("/konto");
      } else {
        router.push("/auth/signin");
      }
    } catch (error) {
      console.error("Błąd:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

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
          <form onSubmit={handleSubmitOrder}>
            <Title>Dane do zamówienia</Title>
            <Input
              type="text"
              placeholder="Imię"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <Input
              type="text"
              placeholder="Nazwisko"
              name="surname"
              value={formData.surname}
              onChange={handleInputChange}
              required
            />
            <Input
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <Input
              type="text"
              placeholder="Miasto"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
            />
            <Input
              type="text"
              placeholder="Kod pocztowy"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              required
            />
            <Input
              type="text"
              placeholder="Ulica"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              required
            />
            <Input
              type="text"
              placeholder="Kraj"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              required
            />

            <Title>Metoda płatności</Title>
            <PaymentMethods>
              <PaymentMethod>
                <input
                  type="radio"
                  name="payment"
                  value="blik"
                  checked={selectedPayment === "blik"}
                  onChange={(e) => setSelectedPayment(e.target.value)}
                  required
                />
                <label>BLIK</label>
              </PaymentMethod>
              <PaymentMethod>
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={selectedPayment === "card"}
                  onChange={(e) => setSelectedPayment(e.target.value)}
                />
                <label>Karta płatnicza</label>
              </PaymentMethod>
              <PaymentMethod>
                <input
                  type="radio"
                  name="payment"
                  value="transfer"
                  checked={selectedPayment === "transfer"}
                  onChange={(e) => setSelectedPayment(e.target.value)}
                />
                <label>Przelew bankowy</label>
              </PaymentMethod>
            </PaymentMethods>

            <Button
              $primary
              type="submit"
              style={{ width: "100%", marginTop: "20px" }}
              disabled={loading}
            >
              {loading ? "Przetwarzanie zamówienia..." : "Zamów i zapłać"}
            </Button>
          </form>
        </Box>
      </ColumnsWrapper>
    </Center>
  );
};

export default CartPage;
