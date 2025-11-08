import express from "express";
import { upload } from "../middlewares/multer.js";
import { addProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "../controllers/product.controller.js";





const productrouter = express.Router();

productrouter.post("/", upload.single("image"), addProduct);
productrouter.get("/", getAllProducts);
productrouter.get("/:id", getProductById);
productrouter.put("/:id", upload.single("image"), updateProduct);
productrouter.delete("/:id", deleteProduct);

export default productrouter;
