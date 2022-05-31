import { default as express } from "express";
import * as saleController from "../controllers/sale.js";
import {saleRules} from "../../middlewares/validators/rules/sale.js";
import {validate} from "../../middlewares/validators/validate.js";
import filter from "../../middlewares/filters/index.js";

export const router = express.Router();

router.route("/:id/cancel")
    .delete(saleRules.read, validate, saleController.cancelSale);

router.route("/:id")
    .get(saleRules.read, validate, saleController.read)
    .delete(saleRules.destroy, validate, saleController.destroy);

router.route("/")
    .get(saleRules.filter, validate, filter.sale, saleController.sales)
    .patch(saleRules.update, validate, saleController.update)
    .post(saleRules.create, validate, saleController.create);

