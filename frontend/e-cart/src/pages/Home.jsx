import React, { useContext, useState } from "react";
import ProductList from "../components/productList";
import { AuthContext } from "../App";
import api from "../api";

const Home = () => {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState("");

  const addToCart = async (product) => {
    try {
      if (!user || !user._id) {
        alert("Please login first!");
        return;
      }

      await api.post("/cart", {
        userId: user._id,
        productId: product._id,
        quantity: 1, 
      });

      setMessage(`${product.productName || product.name} added to cart!`);
      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      console.error("Error adding to cart:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Error adding to cart!");
    }
  };

  return (
    <div>
      <h1>🛒 Vibe Commerce</h1>
      {message && <p className="message">{message}</p>}
      <ProductList onAddToCart={addToCart} />
    </div>
  );
};

export default Home;
