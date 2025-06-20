import * as service from "../services/cart.service.js";

export async function create(req, res) {
  try {
    const cart = await service.createCart();
    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function addProduct(req, res) {
  try {
    const updatedCart = await service.addProductToCart(
      req.params.cid,
      req.params.pid
    );
    res.json(updatedCart.products);
  } catch (err) {
    console.error(" addProduct error:", err.message);
    const status = err.message.includes("no encontrado") ? 404 : 400;
    res.status(status).json({ error: err.message });
  }
}

export async function getById(req, res) {
  try {
    const cart = await service.getCartById(req.params.cid);
    res.json(cart.products);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

export async function deleteProduct(req, res) {
  try {
    const updated = await service.deleteProductFromCart(
      req.params.cid,
      req.params.pid
    );
    res.json(updated.products);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

export async function updateCart(req, res) {
  try {
    const updated = await service.updateCartProducts(
      req.params.cid,
      req.body.products
    );
    res.json(updated.products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateQuantity(req, res) {
  try {
    const updated = await service.updateProductQuantity(
      req.params.cid,
      req.params.pid,
      req.body.quantity
    );
    res.json(updated.products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function clear(req, res) {
  try {
    await service.clearCart(req.params.cid);
    res.json({ message: "Carrito vaciado" });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}
