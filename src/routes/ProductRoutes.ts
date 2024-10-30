import express from "express";
import { ProductController } from "../controller/ProductController";
export const productRouter = express.Router();

/**
 * @swagger
 * /getAllProducts:
 *   get:
 *     summary: Retorna todos os produtos
 *     responses:
 *       200:
 *         description: Lista de produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: './src/entities/product.ts'
 */
productRouter.get("/getAllProducts", ProductController.getAll);

/**
 * @swagger
 * /getById/{product_id}:
 *   get:
 *     summary: Obtém um produto pelo ID
 *     parameters:
 *       - in: path
 *         name: product_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Retorna o produto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: './src/entities/product.ts'
 *       404:
 *         description: Produto não encontrado
 */
productRouter.get("/getById/:product_id", ProductController.getById);

/**
 * @swagger
 * /create:
 *   post:
 *     summary: Cria um novo produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do produto
 *               price:
 *                 type: number
 *                 description: Preço do produto
 *               description:
 *                 type: string
 *                 description: Descrição do produto
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *       400:
 *         description: Requisição inválida
 */
productRouter.post("/create", ProductController.create);

/**
 * @swagger
 * /update/{product_id}:
 *   put:
 *     summary: Atualiza um produto existente
 *     parameters:
 *       - in: path
 *         name: product_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do produto
 *               price:
 *                 type: number
 *                 description: Preço do produto
 *               description:
 *                 type: string
 *                 description: Descrição do produto
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *       404:
 *         description: Produto não encontrado
 *       400:
 *         description: Requisição inválida
 */
productRouter.put("/update/:product_id", ProductController.update);

/**
 * @swagger
 * /delete/{product_id}:
 *   delete:
 *     summary: Deleta um produto
 *     parameters:
 *       - in: path
 *         name: product_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto deletado com sucesso
 *       404:
 *         description: Produto não encontrado
 */
productRouter.delete("/delete/:product_id", ProductController.delete);
