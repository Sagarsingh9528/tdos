import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./components/cartList";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Navbar from "./components/Navbar"; // ✅ Add this

export const AuthContext = createContext();

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Router>
        <Navbar /> {/* ✅ Navbar Always Visible */}
        <Routes>
          {!user ? (
            <>
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
