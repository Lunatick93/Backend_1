import * as service from "../services/product.service.js";

export async function getAll(req, res) {
  try {
    const params = {
      limit: req.query.limit,
      page: req.query.page,
      sort: req.query.sort,
      query: req.query.query
    };
    const result = await service.queryProducts(params);
    res.json(result);
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
}

export async function getById(req, res) {
  try {
    const p = await service.getProduct(req.params.pid);
    if (!p) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(p);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function create(req, res) {
  try {
    const newP = await service.createProduct(req.body);
    res.status(201).json(newP);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function update(req, res) {
  try {
    if (!Object.keys(req.body).length) {
      return res.status(400).json({ error: "No hay campos para actualizar" });
    }
    const updated = await service.updateProduct(req.params.pid, req.body);
    if (!updated)
      return res.status(404).json({ error: "Producto no encontrado" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function remove(req, res) {
  try {
    const ok = await service.deleteProduct(req.params.pid);
    if (!ok) return res.status(404).json({ error: "Producto no encontrado" });
    res.json({ message: "Producto eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
