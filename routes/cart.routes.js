import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { addToCart, checkout, getUserCart, removeCartItem } from "../controllers/cart.controller.js";



const cartrouter = express.Router();


cartrouter.post("/", isAuth, addToCart);
cartrouter.get("/", isAuth, getUserCart);
cartrouter.delete("/:cartId", isAuth, removeCartItem);
cartrouter.get("/checkout", isAuth, checkout);

export default cartrouter;
