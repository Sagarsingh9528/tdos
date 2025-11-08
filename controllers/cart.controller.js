import Cart from "../models/cart.js";
import Product from "../models/product.js";


export const addToCart = async (req, res) => {
  try {
    const {  productId, quantity } = req.body;
    const userId = req.userId;

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    const totalPrice = product.price * quantity;

    
    const existingCartItem = await Cart.findOne({ user: userId, product: productId, status: "pending" });

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
      existingCartItem.totalPrice = existingCartItem.quantity * product.price;
      await existingCartItem.save();

      return res.status(200).json({
        success: true,
        message: "Cart item updated successfully",
        cartItem: existingCartItem,
      });
    }

    const newCart = new Cart({
      user: userId,
      product: productId,
      quantity,
      totalPrice,
    });

    await newCart.save();
    res.status(201).json({ success: true, message: "Item added to cart", cartItem: newCart });
  } catch (error) {
    res.status(500).json({ success: false, message: `Add to cart error: ${error.message}` });
  }
};


export const getUserCart = async (req, res) => {
  try {
    const userId = req.userId; // middleware se directly
    const cartItems = await Cart.find({ user: userId, status: "pending" })
      .populate("product", "productName price image description");

    res.status(200).json({ success: true, count: cartItems.length, cartItems });
  } catch (error) {
    res.status(500).json({ success: false, message: `Get cart error: ${error.message}` });
  }
};


export const updateCartItem = async (req, res) => {
  try {
    const { cartId } = req.params;
    const { quantity } = req.body;

    const cartItem = await Cart.findById(cartId).populate("product");
    if (!cartItem)
      return res.status(404).json({ success: false, message: "Cart item not found" });

    cartItem.quantity = quantity;
    cartItem.totalPrice = quantity * cartItem.product.price;
    await cartItem.save();

    res.status(200).json({ success: true, message: "Cart item updated", cartItem });
  } catch (error) {
    res.status(500).json({ success: false, message: `Update cart error: ${error.message}` });
  }
};


export const removeCartItem = async (req, res) => {
  try {
    const { cartId } = req.params;

    const cartItem = await Cart.findByIdAndDelete(cartId);
    if (!cartItem)
      return res.status(404).json({ success: false, message: "Cart item not found" });

    res.status(200).json({ success: true, message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ success: false, message: `Remove cart error: ${error.message}` });
  }
};


export const checkout = async (req, res) => {
  try {
    const userId = req.userId; // middleware se directly

    const cartItems = await Cart.find({ user: userId, status: "pending" })
      .populate("product", "productName price");

    if (cartItems.length === 0)
      return res.status(400).json({ success: false, message: "Cart is empty" });

    const subtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
    const gstRate = 0.18;
    const gstAmount = subtotal * gstRate;
    const totalAmount = subtotal + gstAmount;

    const itemDetails = cartItems.map((item) => ({
      productName: item.product.productName,
      quantity: item.quantity,
      pricePerItem: item.product.price,
      total: item.totalPrice,
    }));

    res.status(200).json({
      success: true,
      message: "Checkout summary generated",
      summary: {
        subtotal,
        gstRate: "18%",
        gstAmount,
        totalAmount,
        items: itemDetails,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: `Checkout error: ${error.message}` });
  }
};
