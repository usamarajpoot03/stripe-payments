import React from "react";
import logo from "./logo.svg";
import "./App.css";
import StripeCheckout from "react-stripe-checkout";
function App() {
  const [product, setProduct] = React.useState({
    name: "Iphone 13 Pro Max",
    price: 999,
    productBy: "Apple",
  });

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
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
        </a>
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
      </header>
    </div>
  );
}

export default App;
