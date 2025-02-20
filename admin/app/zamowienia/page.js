"use client";
import { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

const OrdersGrid = styled.div`
  margin: 40px 0;
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
  margin-bottom: 15px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
`;

const OrderInfo = styled.div`
  margin-bottom: 15px;
`;

const StatusSelect = styled.select`
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ddd;
`;

const ProductList = styled.div`
  margin: 15px 0;
`;

const ProductItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  &:last-child {
    border-bottom: none;
  }
`;

const ProductDetails = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
`;

const ProductQuantity = styled.span`
  background-color: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
  margin-left: 10px;
`;

const TotalAmount = styled.div`
  text-align: right;
  font-weight: bold;
  margin-top: 15px;
  font-size: 1.1em;
  color: #2c5282;
  padding-top: 10px;
  border-top: 2px solid #edf2f7;
`;

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const response = await axios.get("/api/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Błąd pobierania zamówień:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(orderId, newStatus) {
    try {
      await axios.put("/api/orders", {
        orderId,
        status: newStatus,
      });
      await fetchOrders();
    } catch (error) {
      console.error("Błąd aktualizacji statusu:", error);
    }
  }

  if (loading) return <div>Ładowanie zamówień...</div>;

  return (
    <div>
      <h1>Zarządzanie Zamówieniami</h1>
      <OrdersGrid>
        {orders.length === 0 ? (
          <p>Brak zamówień</p>
        ) : (
          orders.map((order) => (
            <OrderBox key={order._id}>
              <OrderHeader>
                <div>
                  <h2>Zamówienie #{order._id}</h2>
                  <div>Data: {new Date(order.createdAt).toLocaleString()}</div>
                </div>
                <StatusSelect
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                >
                  <option value="Nowe">Nowe</option>
                  <option value="W realizacji">W realizacji</option>
                  <option value="Wysłane">Wysłane</option>
                  <option value="Dostarczone">Dostarczone</option>
                  <option value="Anulowane">Anulowane</option>
                </StatusSelect>
              </OrderHeader>

              <OrderInfo>
                <div>
                  <strong>Email klienta:</strong> {order.userEmail}
                </div>
                <div>
                  <strong>Adres dostawy:</strong>
                  <div style={{ marginLeft: "10px" }}>
                    {order.shippingAddress?.name}{" "}
                    {order.shippingAddress?.surname}
                    <br />
                    {order.shippingAddress?.street}
                    <br />
                    {order.shippingAddress?.postalCode}{" "}
                    {order.shippingAddress?.city}
                    <br />
                    {order.shippingAddress?.country}
                  </div>
                </div>
              </OrderInfo>

              <ProductList>
                <h3>Produkty:</h3>
                {order.products.map((product, index) => (
                  <ProductItem key={index}>
                    <ProductDetails>
                      <div>
                        {product.title}
                        <ProductQuantity>x{product.quantity}</ProductQuantity>
                      </div>
                      <div>{product.price} zł</div>
                    </ProductDetails>
                  </ProductItem>
                ))}
                <TotalAmount>Suma: {order.totalAmount} zł</TotalAmount>
              </ProductList>
            </OrderBox>
          ))
        )}
      </OrdersGrid>
    </div>
  );
}
