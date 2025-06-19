import { Router } from "express";
import * as ctrl from "../controllers/product.controller.js";

const router = Router();

router.get("/", ctrl.getAll);
router.get("/:pid", ctrl.getById);
router.post("/", ctrl.create);
router.put("/:pid", ctrl.update);
router.delete("/:pid", ctrl.remove);

export default router;
