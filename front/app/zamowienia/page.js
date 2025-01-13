"use client";
import { useEffect, useState } from "react";
import styled from "styled-components";

const OrdersContainer = styled.div`
  max-width: 1000px;
  margin: 20px auto;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Tutaj dodasz później pobieranie zamówień
    setLoading(false);
  }, []);

  if (loading) return <div>Ładowanie zamówień...</div>;

  return (
    <OrdersContainer>
      <Title>Moje zamówienia</Title>
      {orders.length === 0 ? (
        <p>Nie masz jeszcze żadnych zamówień.</p>
      ) : (
        <div>{/* Tutaj będzie lista zamówień */}</div>
      )}
    </OrdersContainer>
  );
}
