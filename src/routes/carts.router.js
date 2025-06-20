import { Router } from "express";
import * as ctrl from "../controllers/cart.controller.js";

const router = Router();

router.post("/", ctrl.create);
router.get("/:cid", ctrl.getById);
router.post("/:cid/product/:pid", ctrl.addProduct);
router.delete("/:cid/products/:pid", ctrl.deleteProduct);
router.put("/:cid", ctrl.updateCart);
router.put("/:cid/products/:pid", ctrl.updateQuantity);
router.delete("/:cid", ctrl.clear);

export default router;
