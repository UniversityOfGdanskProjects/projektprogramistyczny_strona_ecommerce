"use client";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "@/components/Headers";
import Center from "@/components/Center";
import { useSession } from "next-auth/react";

const AccountContainer = styled.div`
  margin: 40px 0;
`;

const WelcomeBox = styled.div`
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 30px;
`;

const OrdersSection = styled.div`
  margin-top: 30px;
`;

const OrderBox = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 15px;
`;
const LoadingSpinner = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
`;

const StatusBadge = styled.span`
  padding: 5px 10px;
  border-radius: 5px;
  background-color: ${(props) => {
    switch (props.status) {
      case "Nowe":
        return "#e3f2fd";
      case "W realizacji":
        return "#fff3e0";
      case "Wysłane":
        return "#e8f5e9";
      case "Dostarczone":
        return "#e0f2f1";
      case "Anulowane":
        return "#ffebee";
      default:
        return "#f5f5f5";
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case "Nowe":
        return "#1976d2";
      case "W realizacji":
        return "#f57c00";
      case "Wysłane":
        return "#388e3c";
      case "Dostarczone":
        return "#00897b";
      case "Anulowane":
        return "#d32f2f";
      default:
        return "#757575";
    }
  }};
`;

const ProductList = styled.div`
  margin: 15px 0;
`;

const ProductItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
`;

const TotalAmount = styled.div`
  text-align: right;
  font-weight: bold;
  margin-top: 15px;
  font-size: 1.1em;
`;

const SectionTitle = styled.h2`
  margin-bottom: 20px;
  color: #333;
`;

export default function AccountPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchOrders();
    }
  }, [session]);

  async function fetchOrders() {
    try {
      const response = await fetch("/api/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Błąd podczas pobierania zamówień:", error);
    } finally {
      setLoading(false);
    }
  }

  if (!session) return null;

  if (loading) {
    return (
      <Center>
        <LoadingSpinner>Ładowanie zamówień...</LoadingSpinner>
      </Center>
    );
  }

  return (
    <>
      <Header />
      <Center>
        <AccountContainer>
          <WelcomeBox>
            <h1>Witaj w Twoim koncie!</h1>
            <p>Email: {session.user.email}</p>
          </WelcomeBox>

          <OrdersSection>
            <SectionTitle>Twoje zamówienia</SectionTitle>
            {loading ? (
              <div>Ładowanie zamówień...</div>
            ) : orders.length === 0 ? (
              <p>Nie masz jeszcze żadnych zamówień.</p>
            ) : (
              orders.map((order) => (
                <OrderBox key={order._id}>
                  <OrderHeader>
                    <div>
                      <strong>Zamówienie #{order._id}</strong>
                      <div>
                        Data: {new Date(order.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <StatusBadge status={order.status}>
                      {order.status}
                    </StatusBadge>
                  </OrderHeader>

                  <ProductList>
                    {order.products.map((product, index) => (
                      <ProductItem key={index}>
                        <span>{product.title}</span>
                        <span>{product.price} zł</span>
                      </ProductItem>
                    ))}
                  </ProductList>

                  <TotalAmount>Razem: {order.totalAmount} zł</TotalAmount>
                </OrderBox>
              ))
            )}
          </OrdersSection>
        </AccountContainer>
      </Center>
    </>
  );
}
