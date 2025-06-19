import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

export async function getCartById(id) {
  return Cart.findById(id).populate("products.product").lean();
}

export async function deleteProductFromCart(cid, pid) {
  const cart = await Cart.findById(cid);
  if (!cart) throw new Error("Carrito no encontrado");
  cart.products = cart.products.filter((p) => p.product.toString() !== pid);
  await cart.save();
  return cart.populate("products.product").lean();
}

export async function updateCartProducts(cid, productsArray) {
  const cart = await Cart.findById(cid);
  if (!cart) throw new Error("Carrito no encontrado");
  // productsArray = [{ product: pid, quantity: n }, ...]
  cart.products = productsArray;
  await cart.save();
  return cart.populate("products.product").lean();
}

export async function updateProductQuantity(cid, pid, qty) {
  const cart = await Cart.findById(cid);
  if (!cart) throw new Error("Carrito no encontrado");
  const item = cart.products.find((p) => p.product.toString() === pid);
  if (!item) throw new Error("Producto no encontrado en carrito");
  item.quantity = qty;
  await cart.save();
  return cart.populate("products.product").lean();
}

export async function clearCart(cid) {
  const cart = await Cart.findById(cid);
  if (!cart) throw new Error("Carrito no encontrado");
  cart.products = [];
  await cart.save();
  return cart;
}
