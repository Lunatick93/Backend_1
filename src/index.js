import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js"; // <- importa aquí

const app = express();
const PORT = 8080;

app.use(express.json());
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter); // <- monta aquí

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
