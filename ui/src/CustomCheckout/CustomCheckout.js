import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import "./stripeStyles.css";
// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// loadStripe is initialized with your real test publishable API key.
const promise = loadStripe(
  "pk_test_51JdCH5KxrUDgjNNxE8tOZrRW5xvDD0IC6qcSRIOZQ2BRclDtMupXpN23mNwY28D5faTX5DF8KagE7MujKgYRnlQx00oEfMf1aH"
);

export default function CustomCheckout({ products }) {
  return (
    <div>
      <Elements stripe={promise}>
        <CheckoutForm products={products} />
      </Elements>
    </div>
  );
}
