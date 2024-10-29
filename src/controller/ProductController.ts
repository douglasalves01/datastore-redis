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
}
