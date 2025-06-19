import { Router } from "express";
import * as ctrl from "../controllers/cart.controller.js";

const router = Router();

router.get("/:cid", ctrl.getById);
router.delete("/:cid/products/:pid", ctrl.deleteProduct);
router.put("/:cid", ctrl.updateCart);
router.put("/:cid/products/:pid", ctrl.updateQuantity);
router.delete("/:cid", ctrl.clear);

export default router;
