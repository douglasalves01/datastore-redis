import express from "express";
import { Request, Response, Router } from "express";
import { ProductsRepository } from "./repositories/ProductsRepository";
import { runSQLDump } from "./db/loadData";
import { productRouter } from "./routes/ProductRoutes";
const app = express();
const port = 3000;
const routes = Router();

const productsRepo = new ProductsRepository();

routes.get("/", (req: Request, res: Response) => {
  res.statusCode = 200;
  res.send("Funcionando...");
});

// aplicar as rotas na aplicação web backend.
app.use(routes);
app.use("/", productRouter);
async function startServer() {
  await runSQLDump();
  await productsRepo.cacheAllProducts();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
startServer();
