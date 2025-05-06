import { promises as fs } from "fs";

export default class CartManager {
  constructor(path) {
    this.path = path;
  }

  // ————— Métodos privados —————

  // Lee el JSON de carritos (o [] si no existe o está vacío)
  async _readFile() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      if (!data) return [];
      return JSON.parse(data);
    } catch (err) {
      if (err.code === "ENOENT") return [];
      throw err;
    }
  }

  // Escribe el array de carritos formateado
  async _writeFile(carts) {
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
  }

  // ————— Métodos públicos —————

  /**
   * createCart(): crea un carrito nuevo con id autogenerado y products = []
   * Devuelve el carrito creado.
   */
  async createCart() {
    const carts = await this._readFile();
    const newId =
      carts.length > 0 ? Math.max(...carts.map((c) => Number(c.id))) + 1 : 1;
    const newCart = { id: newId, products: [] };
    carts.push(newCart);
    await this._writeFile(carts);
    return newCart;
  }

  /**
   * getById(id): devuelve el carrito con ese id, o null si no existe.
   */
  async getById(id) {
    const carts = await this._readFile();
    const cart = carts.find((c) => c.id == id);
    return cart || null;
  }

  /**
   * addProductToCart(cartId, productId):
   * - Si productId ya existe en cart.products, incrementa quantity.
   * - Si no, agrega { product: productId, quantity: 1 }.
   * Devuelve el carrito actualizado, o null si no encontró el carrito.
   */
  async addProductToCart(cartId, productId) {
    const carts = await this._readFile();
    const idx = carts.findIndex((c) => c.id == cartId);
    if (idx === -1) return null;

    const cart = carts[idx];
    const existing = cart.products.find((p) => p.product == productId);

    if (existing) {
      existing.quantity++;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    carts[idx] = cart;
    await this._writeFile(carts);
    return cart;
  }
}
