import { ResultSetHeader, RowDataPacket } from "mysql2";
import { conn } from "../db/db";
import { Product } from "../entities/product";
import redisClient from "../config/redisClient";

export class ProductsRepository {
  private static redisKey = "products"; // Chave única

  async cacheAllProducts(): Promise<void> {
    const products = await this.getAll(); //busca a função para pegar dados do banco
    await redisClient.set(
      //gera primeiro carregamento do cache
      ProductsRepository.redisKey,
      JSON.stringify(products)
    );
  }
  private async updateCache(): Promise<void> {
    const products = await new Promise<Product[]>((resolve, reject) => {
      conn.query("SELECT * FROM products", (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results as Product[]);
        }
      });
    });
    await redisClient.set(
      ProductsRepository.redisKey,
      JSON.stringify(products)
    );
  }

  async getAll(): Promise<Product[]> {
    try {
      const cachedProducts = await redisClient.get(ProductsRepository.redisKey);

      if (cachedProducts) {
        return JSON.parse(cachedProducts);
      } else {
        await this.updateCache(); // Atualiza o cache se ele não existir
        const updatedCache = await redisClient.get(ProductsRepository.redisKey); // Re-obtem o cache
        return updatedCache ? JSON.parse(updatedCache) : []; // Verifica novamente para garantir que não seja null
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  async getById(product_id: number): Promise<Product | undefined> {
    const products = await this.getAll();
    const foundProduct = products.find((product) => product.id === product_id);

    return foundProduct; // Retorne o produto encontrado
  }

  async create(p: Product): Promise<Product> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>(
        "INSERT INTO products (name, price, description) VALUES (?, ?, ?)",
        [p.name, p.price, p.description],
        async (err, res) => {
          if (err) {
            reject(err);
          } else {
            try {
              const createdProduct = {
                id: res.insertId,
                ...p,
              };
              await this.updateCache(); // Atualiza o cache após a criação
              resolve(createdProduct);
            } catch (error) {
              reject(error);
            }
          }
        }
      );
    });
  }

  update(p: Product): Promise<Product | undefined> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>(
        "update products SET name = ?, price = ?, description = ? where id = ?",
        [p.name, p.price, p.description, p.id],
        async (err, res) => {
          if (err) {
            reject(err);
          } else {
            try {
              await this.updateCache(); // Atualiza o cache após a atualização
              const updatedProduct = await this.getById(p.id!); //busca produto que acabou de ser atualizado
              resolve(updatedProduct); // Retorna o produto atualizado
            } catch (error) {
              reject(error);
            }
          }
        }
      );
    });
  }

  delete(product_id: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>(
        "delete from products where id = ?",
        [product_id],
        async (err, res) => {
          if (err) {
            reject(err);
          } else {
            try {
              await this.updateCache(); // Atualiza o cache após a atualização
              resolve(res.affectedRows); // Retorna o produto atualizado
            } catch (error) {
              reject(error);
            }
          }
        }
      );
    });
  }
}
