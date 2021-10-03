require("dotenv").config();
const cors = require("cors");
const express = require("express");
const stripe = require("stripe")(process.env.STIPE_KEY);

console.log();
const { v4: uuidV4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Stripe Payments gateway is working");
});

app.get("/customer", (req, res) => {
  stripe.customers
    .create({
      email: "customer@example.com",
    })
    .then((customer) => {
      res.send(customer);
    })
    .catch((error) => console.error(error));
});

app.post("/payment", (req, res) => {
  const { token, product } = req.body;
  console.log({ token, product });

  const idempotencyKey = uuidV4();
  console.log({ idempotencyKey });
  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges
        .create(
          {
            amount: product.price * 100,
            currency: "usd",
            customer: customer.id,
            receipt_email: token.email,
            description: `purchase of ${product.name}`,
            shipping: {
              name: token.card.name,
              address: {
                country: token.card.address_country,
              },
            },
          },
          { idempotencyKey }
        )
        .then((result) => {
          console.log("TRANSACTION SUCCESSFULL");
          console.log({ result });
          res.status(200).json(result);
        });
    })
    .then((err) => console.log(err));
});

const YOUR_DOMAIN = "http://localhost:3000/checkout";
app.post("/create-checkout-session", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // TODO: replace this with the `price` of the product you want to sell
        price: "price_1JgTFGKxrUDgjNNxfcGixX8b",
        quantity: 2,
      },
    ],
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${YOUR_DOMAIN}?success=true`,
    cancel_url: `${YOUR_DOMAIN}?canceled=true`,
  });
  res.redirect(303, session.url);
});

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client

  let totalPrice = 0;
  items.forEach((item) => {
    totalPrice += item.price;
  });
  return totalPrice * 100;
};

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;
  console.log({ items });
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "usd",
  });
  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.listen(8000, () => {
  console.log("listening at port 8000");
});
