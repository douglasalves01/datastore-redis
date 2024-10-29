import { ResultSetHeader, RowDataPacket } from "mysql2";
import { conn } from "../db/db";
import { Product } from "../entities/product";
import redisClient from "../config/redisClient";

export class ProductsRepository {
  async cacheAllProducts(): Promise<void> {
    const products = await this.getAll();
    products.forEach((product) => {
      redisClient.set(`product:${product.id}`, JSON.stringify(product));
    });
  }
  async getAll(): Promise<Product[]> {
    try {
      const cachedProducts = await redisClient.get("products");
      if (cachedProducts) {
        return JSON.parse(cachedProducts);
      }
      const products: Product[] = await new Promise((resolve, reject) => {
        conn.query("SELECT * FROM products", (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results as Product[]);
          }
        });
      });
      await redisClient.set("products", JSON.stringify(products));
      return products;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }
  async getById(product_id: number): Promise<Product | undefined> {
    try {
      const cachedProduct = await redisClient.get(`product:${product_id}`);
      if (cachedProduct) {
        return JSON.parse(cachedProduct);
      }

      const products = await new Promise<Product[]>((resolve, reject) => {
        conn.query(
          "SELECT * FROM products WHERE id = ?",
          [product_id],
          (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(results as Product[]);
            }
          }
        );
      });

      const product = products[0];
      if (product) {
        await redisClient.set(`product:${product_id}`, JSON.stringify(product));
      }

      return product;
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      throw error;
    }
  }

  create(p: Product): Promise<Product> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>(
        "INSERT INTO PRODUCTS (name, price, description) VALUES (?, ?, ?)",
        [p.name, p.price, p.description],
        async (err, res) => {
          if (err) {
            reject(err);
          } else {
            try {
              const createdProduct = await this.getById(res.insertId);
              if (createdProduct) {
                resolve(createdProduct); // Garante que um produto não nulo será retornado
              } else {
                reject(new Error("Produto criado, mas não encontrado."));
              }
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
        "UPDATE PRODUCTS SET name = ?, price = ?, description = ? WHERE id = ?",
        [p.name, p.price, p.description, p.id],
        (err, res) => {
          if (err) reject(err);
          else this.getById(p.id!).then(resolve).catch(reject);
        }
      );
    });
  }

  delete(product_id: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>(
        "DELETE FROM PRODUCTS WHERE id = ?",
        [product_id],
        (err, res) => {
          if (err) reject(err);
          else resolve(res.affectedRows);
        }
      );
    });
  }
}
