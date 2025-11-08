import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import cors from "cors"
import authrouter from "./routes/auth.routes.js"
import productrouter from "./routes/product.routes.js"
import cartrouter from "./routes/cart.routes.js"
import cookieParser from "cookie-parser"

const port=process.env.PORT || 5000
dotenv.config()


const app=express()
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authrouter)
app.use("/api/product", productrouter)
app.use("/api/cart", cartrouter)


const startServer = async () => {
  await connectDb();

  app.listen(port, () => {
    console.log(`🚀 Server started on port: ${port}`);
  });
};

startServer();

