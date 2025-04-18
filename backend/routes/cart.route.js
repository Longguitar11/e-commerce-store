import express from "express";
import { addToCart, clearCart, getCartProducts, removeProductFromCart, updateQuantity } from "../controllers/cart.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getCartProducts);
router.post("/", protectRoute, addToCart);
router.delete("/:id", protectRoute, removeProductFromCart);
router.delete("/", protectRoute, clearCart);
router.put("/:id", protectRoute, updateQuantity);

export default router;