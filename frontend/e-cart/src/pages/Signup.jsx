import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { AuthContext } from "../App";
import "./Auth.css";

const Signup = () => {
  const [form, setForm] = useState({ name: "", gender: "", email: "", password: "" });
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/signup", form);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      navigate("/");
    } catch (err) {
      alert("Signup failed, please try again.");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-box" onSubmit={handleSignup}>
        <h2>🧾 Signup</h2>
        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <select name="gender" value={form.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="Male">Male ♂</option>
          <option value="Female">Female ♀</option>
          <option value="Other">Other ⚧️</option>
        </select>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Create a password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Signup</button>
        <p className="switch-text">
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
