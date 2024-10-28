import express from "express";
import { Request, Response, Router } from "express";
import { ProductsRepository } from "./ProductsRepository";
import { runSQLDump } from "./loadData";
const app = express();
const port = 3000;
const routes = Router();

const productsRepo = new ProductsRepository();

routes.get("/", (req: Request, res: Response) => {
  res.statusCode = 200;
  res.send("Funcionando...");
});

routes.get("/getAllProducts", async (req: Request, res: Response) => {
  // obter todos os produtos.
  const products = await productsRepo.getAll();
  res.statusCode = 200;
  res.type("application/json");
  res.send(products);
});

// aplicar as rotas na aplicação web backend.
app.use(routes);

async function startServer() {
  await runSQLDump();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
startServer();
