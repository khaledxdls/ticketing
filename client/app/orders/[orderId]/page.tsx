"use client";
import StripeCheckout from "@/app/_components/StripeCheckout";
import { useUser } from "@/app/_context/userContext";
import { useRequest } from "@/hooks/useRequest";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

interface Order {
  id: string;
  ticket: {
    title: string;
    price: number;
  };
  status: string;
  expiresAt: string;
}

function OrderPage({ params }: { params: Promise<{ orderId: string }> }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [orderId, setOrderId] = useState<string | null>(null); // State to store unwrapped orderId
  const currentUser = useUser();
  const router = useRouter();
  const { doRequest, isLoading, errors } = useRequest({
    url: `/api/payments`,
    method: "post",
    body: {},
    onSuccess: () => {
      router.push(`/orders`);
    },
  });

  // Unwrap params using React.use()
  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params;
      setOrderId(resolvedParams.orderId);
    };

    unwrapParams();
  }, [params]);

  // Fetch order details when orderId is available
  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    fetchOrder();
  }, [orderId]);

  // Calculate time left for payment
  useEffect(() => {
    if (!order) return;

    const calculateTimeLeft = () => {
      const msLeft = new Date(order.expiresAt).getTime() - new Date().getTime();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    const timerId = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Order {orderId}</h1>
      <div className="mb-4">
        <p>Ticket: {order.ticket.title}</p>
        <p>Price: ${order.ticket.price}</p>
        <p>Status: {order.status}</p>
        {timeLeft > 0 ? (
          <>
            <p>Time left to pay: {timeLeft} seconds</p>
            <StripeCheckout
              stripeKey="pk_test_51R4mZQ4WDKwskheMvupZnJ4fznCV3KsEJGw1bxGjUE9LC3iQ3dqxn1y2pSbpf5aAF3EbeCPXvGzWF7uMcQODCZof00jnloEPDf"
              amount={order.ticket.price * 100}
              email={currentUser?.email || ""}
              token={({ id }) => {
                // Use the doRequest function to send the token to the backend
                doRequest({
                  token: id,
                  orderId: order.id, // Pass the orderId here
                });
              }}
            />
          </>
        ) : (
          <p>Order expired</p>
        )}

        {errors}
        {isLoading && <div>Loading...</div>}
      </div>
    </div>
  );
}

export default OrderPage;
