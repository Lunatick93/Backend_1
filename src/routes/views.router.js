import { Router } from "express";
import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";
import mongoosePaginate from "mongoose-paginate-v2";

const router = Router();

router.get("/products", async (req, res) => {
  const { limit, page, sort, query } = req.query;
  const result = await Product.paginate(query ? { category: query } : {}, {
    page: Number(page) || 1,
    limit: Number(limit) || 10,
    sort: sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {}
  });

  let cart = await Cart.findOne();
  if (!cart) cart = await Cart.create({ products: [] });

  res.render("index", {
    title: "Productos",
    products: result.docs,
    cartId: cart._id.toString(),
    pagination: {
      totalPages: result.totalPages,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      baseLink: `/products?limit=${limit || 10}&sort=${sort || ""}&query=${query || ""}`
    }
  });
});

router.get("/products/:pid", async (req, res) => {
  const prod = await Product.findById(req.params.pid).lean();
  res.render("productDetail", { title: prod.title, product: prod });
});

router.get("/carts/:cid", async (req, res) => {
  const cart = await mongoose
    .model("Cart")
    .findById(req.params.cid)
    .populate("products.product")
    .lean();
  res.render("cartDetail", { title: "Carrito", products: cart.products });
});

export default router;
