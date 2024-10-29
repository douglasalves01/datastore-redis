import express from "express";
import { ProductController } from "../controller/ProductController";
export const productRouter = express.Router();

productRouter.get("/getAllProducts", ProductController.getAll);
productRouter.get("/getById/:product_id", ProductController.getById);
