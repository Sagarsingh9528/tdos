import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../App";
import "./ProductList.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/product")
      .then((res) => {
        if (res.data && Array.isArray(res.data.products)) {
          setProducts(res.data.products);
        } else {
          console.error("Unexpected data:", res.data);
        }
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const handleAddToCart = async (productId) => {
    if (!user) {
      alert("Please login first!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/cart",
        { userId: user._id, productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert("✅ Product added to cart!");
      }
    } catch (err) {
      console.error("Error adding to cart:", err.response?.data || err.message);
      alert("Failed to add product to cart.");
    }
  };

  return (
    <div className="product-list">
      <h2>🛍️ Our Products</h2>

      <div className="product-grid">
        {products.map((p) => (
          <div className="product-card" key={p._id}>
            <img
              src={p.image || "https://via.placeholder.com/200"}
              alt={p.productName}
              className="product-img"
            />
            <h3>{p.productName}</h3>
            <p className="desc">{p.description}</p>
            <p className="price">₹{p.price}</p>
            <button className="btn" onClick={() => handleAddToCart(p._id)}>
              Add to Cart 🛒
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
