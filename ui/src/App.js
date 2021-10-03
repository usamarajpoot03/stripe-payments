import React, { Profiler } from "react";
import logo from "./logo.svg";
import "./App.css";
import StripeCheckout from "react-stripe-checkout";
import AutoCheckout from "./AutoCheckout";
import CustomCheckout from "./CustomCheckout/CustomCheckout";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
function App() {
  const [product, setProduct] = React.useState({
    name: "Iphone 13 Pro Max",
    price: 999,
    productBy: "Apple",
  });

  const [products, setProducts] = React.useState([
    {
      id: 1,
      name: "Iphone 13 Pro Max",
      price: 999,
      productBy: "Apple",
      inCart: false,
      p_id: "prod_KLBbiLmbvkcEA0",
    },
    {
      id: 2,
      name: "Iphone 13 Pro",
      price: 899,
      productBy: "Apple",
      inCart: false,
      p_id: "prod_KLBcUasaZEUFHN",
    },
    {
      id: 3,
      name: "Iphone 13",
      price: 699,
      productBy: "Apple",
      inCart: false,
      p_id: "prod_KLBcQEI8mkEfdi",
    },
    {
      id: 4,
      name: "Iphone 13 Mini",
      price: 599,
      productBy: "Apple",
      inCart: false,
      p_id: "prod_KLBcACwgH2O8Px",
    },
  ]);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  console.log({ key: process.env.REACT_APP_KEY });
  const makePayment = (token) => {
    console.log({ token });
    const body = {
      token,
      product,
    };
    const headers = {
      "Content-Type": "application/json",
    };

    return fetch("http://localhost:8000/payment", {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
      .then((response) => {
        console.log({ response });
        const { status } = response;
        console.log({ status });
      })
      .catch((err) => console.log({ err }));
  };

  const handleAddToCart = (prod) => {
    const prods = products.map((prod) => ({ ...prod }));
    setProducts(
      prods.map((p) => {
        if (p.id == prod.id) p.inCart = true;
        return p;
      })
    );
  };
  return (
    <div className='App'>
      <div className='z-depth-3' style={{ padding: "18px" }}>
        <StripeCheckout
          stripeKey={process.env.REACT_APP_KEY}
          amount={product.price * 100}
          token={makePayment}
          name='Iphone 13 Pro Max'
        >
          <button className='btn-large pink'>
            Buy {product.name} in just {product.price}$
          </button>
        </StripeCheckout>
        <div
          style={{ display: "inline-block", float: "right", color: "green" }}
        >
          <h5 style={{ display: "inline-block", marginRight: "10px" }}>
            Items in Cart - {products.filter((prod) => prod.inCart).length}{" "}
          </h5>
          <button class='waves-effect waves-green btn' onClick={handleOpen}>
            Checkout
          </button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div>
          <h4>Products</h4>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "row",
            padding: "20px",
          }}
        >
          {products.map((prod) => (
            <div
              style={{
                background: "lightskyblue",
                padding: "20px",
                margin: "15px",
              }}
            >
              <h5>{prod.name}</h5>
              <h6>{prod.price}$</h6>
              <button
                disabled={prod.inCart}
                class='waves-effect waves-light btn'
                onClick={() => {
                  handleAddToCart(prod);
                }}
              >
                {prod.inCart ? "Added" : "Add to Cart"}
              </button>
            </div>
          ))}
        </div>
        <div>
          <AutoCheckout />
        </div>
        <div>
          <div>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby='modal-modal-title'
              aria-describedby='modal-modal-description'
            >
              <Box sx={style}>
                <div>
                  <CustomCheckout
                    products={products
                      .filter((p) => p.inCart)
                      .map((p) => ({
                        id: p.p_id,
                        price: p.price,
                      }))}
                  />
                </div>
              </Box>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
