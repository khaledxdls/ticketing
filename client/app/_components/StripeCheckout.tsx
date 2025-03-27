import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";

const StripeCheckout = ({
  stripeKey,
  amount,
  email,
  token,
}: {
  stripeKey: string;
  amount: number;
  email: string;
  token: (paymentToken: { id: string }) => void;
}) => {
  const stripePromise = loadStripe(stripeKey);

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm amount={amount} email={email} token={token} />
    </Elements>
  );
};

const CheckoutForm = ({
  amount,
  email,
  token,
}: {
  amount: number;
  email: string;
  token: (paymentToken: { id: string }) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.error("Stripe.js has not loaded yet.");
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      console.error("CardElement not found.");
      return;
    }

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: { email },
      });

      if (error) {
        console.error("Payment error:", error.message);
        alert(error.message);
        setIsProcessing(false);
        return;
      }

      // Pass the payment token back to the parent component
      token({ id: paymentMethod!.id });
      alert("Payment token generated successfully!");
    } catch (err) {
      console.error("Error processing payment:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? "Processing..." : `Pay $${(amount / 100).toFixed(2)}`}
      </button>
    </form>
  );
};

export default StripeCheckout;
