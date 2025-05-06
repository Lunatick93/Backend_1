import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const pm = new ProductManager("data/products.json");

// Campos obligatorios y sus tipos esperados
const requiredFields = {
  title: "string",
  description: "string",
  code: "string",
  price: "number",
  status: "boolean",
  stock: "number",
  category: "string",
  thumbnails: "object" // esperamos un array - probar si o si
};

// Helper: valida body contra requiredFields - revisar la forma del profe por si no funciona esta manera.
function validateProductBody(body) {
  for (const [field, type] of Object.entries(requiredFields)) {
    if (!(field in body)) {
      return `Falta el campo obligatorio: ${field}`;
    }
    if (typeof body[field] !== type) {
      // para thumbnails, verificamos array
      if (field === "thumbnails" && Array.isArray(body[field])) continue;
      return `El campo ${field} debe ser de tipo ${type}`;
    }
  }
  return null;
}

// GET all
router.get("/", async (req, res) => {
  try {
    const products = await pm.getAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Error leyendo productos" });
  }
});

// GET by id
router.get("/:pid", async (req, res) => {
  try {
    const product = await pm.getById(req.params.pid);
    if (!product)
      return res.status(404).json({ error: "Producto no encontrado" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Error leyendo producto" });
  }
});

// POST create
router.post("/", async (req, res) => {
  // 1) Validación de body
  const errorMsg = validateProductBody(req.body);
  if (errorMsg) return res.status(400).json({ error: errorMsg });

  try {
    const newProduct = await pm.add(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: "Error creando producto" });
  }
});

// PUT update
router.put("/:pid", async (req, res) => {
  // 1) No permitimos actualizar el id
  if ("id" in req.body) {
    return res
      .status(400)
      .json({ error: "No se puede actualizar el campo id" });
  }
  // 2) Al menos un campo a actualizar
  if (Object.keys(req.body).length === 0) {
    return res
      .status(400)
      .json({ error: "Se requieren campos para actualizar" });
  }

  try {
    const updated = await pm.update(req.params.pid, req.body);
    if (!updated) {
      return res
        .status(404)
        .json({ error: "Producto no encontrado o sin cambios" });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Error actualizando producto" });
  }
});

// DELETE
router.delete("/:pid", async (req, res) => {
  try {
    const deleted = await pm.delete(req.params.pid);
    if (!deleted)
      return res.status(404).json({ error: "Producto no encontrado" });
    res.json({ message: "Producto eliminado" });
  } catch (err) {
    res.status(500).json({ error: "Error eliminando producto" });
  }
});

export default router;
