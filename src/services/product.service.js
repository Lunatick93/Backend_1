import Product from "../models/product.model.js";

export async function queryProducts({ limit = 10, page = 1, sort, query }) {
  const filter = {};
  if (query) {
    if (query === "available") filter.status = true;
    else filter.category = query;
  }

  const options = {
    page: Number(page),
    limit: Number(limit),
    lean: true
  };
  if (sort === "asc") options.sort = { price: 1 };
  if (sort === "desc") options.sort = { price: -1 };

  const result = await Product.paginate(filter, options);

  return {
    status: "success",
    payload: result.docs,
    totalPages: result.totalPages,
    prevPage: result.hasPrevPage ? result.prevPage : null,
    nextPage: result.hasNextPage ? result.nextPage : null,
    page: result.page,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevLink: result.hasPrevPage
      ? `?limit=${limit}&page=${result.prevPage}&sort=${sort || ""}&query=${query || ""}`
      : null,
    nextLink: result.hasNextPage
      ? `?limit=${limit}&page=${result.nextPage}&sort=${sort || ""}&query=${query || ""}`
      : null
  };
}

export async function getProduct(id) {
  const p = await Product.findById(id).lean();
  return p;
}

export async function createProduct(data) {
  if (!data.title || !data.price) {
    throw new Error("El título y el precio son obligatorios");
  }
  const newProd = new Product(data);
  return await newProd.save();
}

export async function updateProduct(id, data) {
  if (data.id) throw new Error("No se puede modificar el campo id");
  const updated = await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  }).lean();
  return updated;
}

export async function deleteProduct(id) {
  const deleted = await Product.findByIdAndDelete(id).lean();
  return deleted !== null;
}
