import { ProductsRepository } from "../repositories/ProductsRepository";
import { Request, Response, Router } from "express";
export class ProductController {
  private static productsRepo = new ProductsRepository();

  static async getAll(req: Request, res: Response) {
    try {
      const products = await ProductController.productsRepo.getAll();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve products" });
    }
  }
  static async getById(req: Request, res: Response) {
    const product_id = parseInt(req.params.product_id);
    const product = await ProductController.productsRepo.getById(product_id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: "Produto não encontrado" });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    const { name, price, description } = req.body; // Extrai os campos do corpo da requisição
    if (!name || typeof price !== "number" || !description) {
      res.status(400).json({ error: "Dados do produto inválidos" });
      return;
    }
    try {
      const product = await ProductController.productsRepo.create({
        name,
        price,
        description,
      });
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar produto" });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.product_id);
    const { name, price, description } = req.body;
    if (!name || !price || !description) {
      res.status(400).json({ error: "Dados do produto inválidos" });
      return;
    }
    try {
      const product = await ProductController.productsRepo.update({
        id,
        name,
        price,
        description,
      });
      if (product) {
        res.status(200).json(product);
      } else {
        res.status(404).json({ error: "Produto não encontrado" });
      }
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar produto" });
    }
  }

  static async delete(req: Request, res: Response) {
    const id = parseInt(req.params.product_id);
    const affectedRows = await ProductController.productsRepo.delete(id);
    if (affectedRows > 0) {
      res.status(200).json({ message: "Produto deletado com sucesso!" });
    } else {
      res.status(404).json({ error: "Produto não encontrado" });
    }
  }
}
