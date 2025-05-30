import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const pm = new ProductManager("src/data/products.json");

router.get("/home", async (req, res) => {
  try {
    const products = await pm.getAll();
    res.render("home", { products });
  } catch (err) {
    res.status(500).send("Error al cargar página de productos");
  }
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

export default router;
