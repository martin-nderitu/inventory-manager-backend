import { default as express } from "express";
import { router as categoryRoutes } from "./category.js";
import { router as productRoutes } from "./product.js";
import { router as purchaseRoutes } from "./purchase.js";
import { router as saleRoutes } from "./sale.js";
import { router as supplierRoutes } from "./supplier.js";
import { router as transferRoutes } from "./transfer.js";


export const router = express.Router();

router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/purchases", purchaseRoutes);
router.use("/sales", saleRoutes);
router.use("/suppliers", supplierRoutes);
router.use("/transfers", transferRoutes);
