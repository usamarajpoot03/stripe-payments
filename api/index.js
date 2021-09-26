const cors = require("cors");
const express = require("express");
const stripe = require("stripe")(process.env.STIPE_KEY);
const { v4: uuidV4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

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

  // return stripe.customers
  //   .create({
  //     email: "customer@example.com",
  //   })
  //   .then((customer) => {
  //     // have access to the customer object
  //     return stripe.invoiceItems
  //       .create({
  //         customer: customer.id, // set the customer id
  //         amount: 2500, // 25
  //         currency: "usd",
  //         description: "One-time setup fee",
  //       })
  //       .then((invoiceItem) => {
  //         return stripe.invoices.create({
  //           collection_method: "send_invoice",
  //           customer: invoiceItem.customer,
  //         });
  //       })
  //       .then((invoice) => {
  //         // New invoice created on a new customer
  //         console.log("TRANSACTION SUCCESSFULL");
  //         console.log({ invoice });
  //         res.status(200).json(invoice);
  //       })
  //       .catch((err) => {
  //         // Deal with an error
  //         console.log({ err });
  //       });
  //   });

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

app.listen(8000, () => {
  console.log("listening at port 8000");
});
