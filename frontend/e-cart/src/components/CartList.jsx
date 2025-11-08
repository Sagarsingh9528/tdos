import { useEffect, useState } from "react";
import axios from "axios";

export default function CartList() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutSummary, setCheckoutSummary] = useState(null);

  const token = localStorage.getItem("token"); // JWT from login

  // Fetch cart items
  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data.cartItems);
    } catch (err) {
      console.log("Error fetching cart:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchCart();
  }, [token]);

  // Remove item
  const handleRemove = async (cartId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${cartId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart();
    } catch (err) {
      console.log("Error removing cart item:", err.response?.data);
    }
  };

  // Update quantity
  const handleUpdate = async (cartId, quantity) => {
    if (quantity < 1) return;
    try {
      await axios.put(
        `http://localhost:5000/api/cart/${cartId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch (err) {
      console.log("Error updating cart:", err.response?.data);
    }
  };

  // Checkout
  const handleCheckout = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/cart/checkout", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCheckoutSummary(res.data.summary);
    } catch (err) {
      console.log("Error in checkout:", err.response?.data);
    }
  };

  if (loading)
    return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading cart...</p>;

  const containerStyle = {
    maxWidth: "800px",
    margin: "20px auto",
    padding: "15px",
    fontFamily: "Arial, sans-serif",
  };

  const cardStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "15px",
    marginBottom: "15px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    backgroundColor: "#fff",
  };

  const itemHeaderStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px",
  };

  const buttonStyle = {
    padding: "6px 12px",
    margin: "0 5px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#4CAF50",
    color: "#fff",
    fontWeight: "bold",
  };

  const removeBtnStyle = { ...buttonStyle, backgroundColor: "#f44336" };

  const checkoutBtnStyle = {
    ...buttonStyle,
    backgroundColor: "#ff9800",
    width: "100%",
    marginTop: "20px",
  };

  const summaryStyle = {
    marginTop: "20px",
    border: "1px solid #ddd",
    padding: "15px",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Your Cart</h2>

      {cart.length === 0 ? (
        <p style={{ textAlign: "center" }}>Your cart is empty.</p>
      ) : (
        cart.map((item) => (
          <div key={item._id} style={cardStyle}>
            <div style={itemHeaderStyle}>
              <p>
                <strong>{item.product.productName}</strong>
              </p>
              <p>₹{item.totalPrice.toFixed(2)}</p>
              <div>
                <button
                  style={buttonStyle}
                  onClick={() => handleUpdate(item._id, item.quantity + 1)}
                >
                  +
                </button>
                <span style={{ margin: "0 10px", fontWeight: "bold" }}>
                  {item.quantity}
                </span>
                <button
                  style={buttonStyle}
                  onClick={() => handleUpdate(item._id, item.quantity - 1)}
                >
                  -
                </button>
                <button style={removeBtnStyle} onClick={() => handleRemove(item._id)}>
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      {cart.length > 0 && (
        <button style={checkoutBtnStyle} onClick={handleCheckout}>
          Checkout
        </button>
      )}

      {checkoutSummary && (
        <div style={summaryStyle}>
          <h3>Checkout Summary</h3>
          <p>Subtotal: ₹{checkoutSummary.subtotal.toFixed(2)}</p>
          <p>GST (18%): ₹{checkoutSummary.gstAmount.toFixed(2)}</p>
          <p>
            <strong>Total: ₹{checkoutSummary.totalAmount.toFixed(2)}</strong>
          </p>
          <h4>Items:</h4>
          {checkoutSummary.items.map((item, idx) => (
            <p key={idx}>
              {item.productName} - Qty: {item.quantity} - ₹{item.total.toFixed(2)}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
