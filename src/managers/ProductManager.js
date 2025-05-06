import { promises as fs } from "fs";

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  // Lee el JSON (o [] si no existe o esta vacio)
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

  // Escribe el array formateado - el anteior no funciono, este si.
  async _writeFile(products) {
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
  }

  // 1. Devuelve todos los productos
  async getAll() {
    return await this._readFile();
  }

  // 2. Busca y devuelve uno por id (o null si no existe)
  async getById(id) {
    const products = await this._readFile();
    const product = products.find((p) => p.id == id);
    return product || null;
  }

  // 3. Añade un producto (genera id automáticamente) -revisar el que mostro el profesor por las dudas
  async add(product) {
    const products = await this._readFile();
    const newId =
      products.length > 0
        ? Math.max(...products.map((p) => Number(p.id))) + 1
        : 1;
    const newProduct = { id: newId, ...product };
    products.push(newProduct);
    await this._writeFile(products);
    return newProduct;
  }

  // 4. Actualiza un producto (sin cambiar su id)
  async update(id, updatedFields) {
    const products = await this._readFile();
    const idx = products.findIndex((p) => p.id == id);
    if (idx === -1) return null;
    const updated = {
      ...products[idx],
      ...updatedFields,
      id: products[idx].id
    };
    products[idx] = updated;
    await this._writeFile(products);
    return updated;
  }

  // 5. Elimina un producto
  async delete(id) {
    const products = await this._readFile();
    const filtered = products.filter((p) => p.id != id);
    if (filtered.length === products.length) return false;
    await this._writeFile(filtered);
    return true;
  }
}
