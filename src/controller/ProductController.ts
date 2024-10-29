import { ProductsRepository } from "../repositories/ProductsRepository";
import { Request, Response, Router } from "express";
export class ProductController {
  private static productsRepo = new ProductsRepository();

  static async getAll(req: Request, res: Response) {
    const products = await ProductController.productsRepo.getAll();
    res.statusCode = 200;
    res.type("application/json");
    res.send(products);
  }
  static async getById(req: Request, res: Response) {
    const product_id = parseInt(req.params.product_id);
    const product = await ProductController.productsRepo.getById(product_id);
    res.statusCode = 200;
    res.type("application/json");
    res.send(product);
  }
  static async create(req: Request, res: Response) {
    const { name, price, description } = req.body; // Extrai os campos do corpo da requisição
    const product = { name, price, description };
    await ProductController.productsRepo.create(product);
    res.statusCode = 200;
    res.type("application/json");
    res.send("Product registered");
  }
  static async update(req: Request, res: Response) {
    const id = parseInt(req.params.product_id);
    const { name, price, description } = req.body;
    const product = { id, name, price, description };
    await ProductController.productsRepo.update(product);
    res.statusCode = 200;
    res.type("application/json");
    res.send(product);
  }
  static async delete(req: Request, res: Response) {
    const id = parseInt(req.params.product_id);
    await ProductController.productsRepo.delete(id);
    res.statusCode = 200;
    res.type("application/json");
    res.send("exclusão realizada com sucesso!");
  }
}
