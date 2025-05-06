import { Router } from "express";
import CartManager from "../managers/CartManager.js";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const cm = new CartManager("data/carts.json");
const pm = new ProductManager("data/products.json");

// POST crear carrito
router.post("/", async (req, res) => {
  try {
    const cart = await cm.createCart();
    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json({ error: "Error creando carrito" });
  }
});

// GET productos de carrito
router.get("/:cid", async (req, res) => {
  try {
    const cart = await cm.getById(req.params.cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(cart.products);
  } catch (err) {
    res.status(500).json({ error: "Error leyendo carrito" });
  }
});

// POST agregar/incrementar producto
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    // 1) Validar existencia de carrito
    const cart = await cm.getById(req.params.cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    // 2) Validar existencia de producto
    const product = await pm.getById(req.params.pid);
    if (!product)
      return res.status(404).json({ error: "Producto no encontrado" });

    // 3) Agregar o incrementar
    const updatedCart = await cm.addProductToCart(
      req.params.cid,
      req.params.pid
    );
    res.json(updatedCart);
  } catch (err) {
    res.status(500).json({ error: "Error agregando producto al carrito" });
  }
});

export default router;
