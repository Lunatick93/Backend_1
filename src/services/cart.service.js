import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

export async function createCart() {
  const cart = await Cart.create({ products: [] });
  return cart.toObject();
}

export async function addProductToCart(cid, pid) {
  const cart = await Cart.findById(cid);
  if (!cart) throw new Error("Carrito no encontrado");

  const prod = await Product.findById(pid);
  if (!prod) throw new Error("Producto no encontrado");

  const item = cart.products.find((p) => p.product.toString() === pid);
  if (item) {
    item.quantity++;
  } else {
    cart.products.push({ product: pid, quantity: 1 });
  }

  await cart.save();
  const populatedCart = await cart.populate("products.product");
  return populatedCart.toObject();
}

export async function getCartById(id) {
  const cart = await Cart.findById(id).populate("products.product");
  return cart.toObject();
}

export async function deleteProductFromCart(cid, pid) {
  const cart = await Cart.findById(cid);
  if (!cart) throw new Error("Carrito no encontrado");
  cart.products = cart.products.filter((p) => p.product.toString() !== pid);
  await cart.save();
  const populatedCart = await cart.populate("products.product");
  return populatedCart.toObject();
}

export async function updateCartProducts(cid, productsArray) {
  const cart = await Cart.findById(cid);
  if (!cart) throw new Error("Carrito no encontrado");
  cart.products = productsArray;
  await cart.save();
  const populatedCart = await cart.populate("products.product");
  return populatedCart.toObject();
}

export async function updateProductQuantity(cid, pid, qty) {
  const cart = await Cart.findById(cid);
  if (!cart) throw new Error("Carrito no encontrado");
  const item = cart.products.find((p) => p.product.toString() === pid);
  if (!item) throw new Error("Producto no encontrado en carrito");
  item.quantity = qty;
  await cart.save();
  const populatedCart = await cart.populate("products.product");
  return populatedCart.toObject();
}

export async function clearCart(cid) {
  const cart = await Cart.findById(cid);
  if (!cart) throw new Error("Carrito no encontrado");
  cart.products = [];
  await cart.save();
  return cart.toObject();
}
