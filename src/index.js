import express from "express";
import { createServer } from "http";
import { Server as IOServer } from "socket.io";
import { engine } from "express-handlebars";
import ProductManager from "./managers/ProductManager.js";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

const app = express();
const PORT = 8080;

const httpServer = createServer(app);
const io = new IOServer(httpServer);
//config handlebars
app.engine(
  "handlebars",
  engine({
    layoutsDir: "src/views/layouts",
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");
app.set("views", "src/views");
//middlewares//
app.use(express.json());
app.use(express.static("public"));

app.use("/", viewsRouter);

app.set("io", io);

io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);
  const pm = new ProductManager("src/data/products.json");

  // envia lista al nuev cliente //
  socket.on("getProducts", async () => {
    const products = await pm.getAll();
    socket.emit("productsList", products);
  });

  // producto via ws //
  socket.on("createProduct", async (data) => {
    await pm.add(data);
    const products = await pm.getAll();
    io.emit("productsList", products);
  });

  // elimina prodct con ws //
  socket.on("deleteProduct", async (id) => {
    await pm.delete(id);
    const products = await pm.getAll();
    io.emit("productsList", products);
  });
});

// apis //
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

httpServer.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
