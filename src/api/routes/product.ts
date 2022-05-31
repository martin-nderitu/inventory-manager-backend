import { default as express } from "express";
import * as productController from "../controllers/product.js";
import {productRules} from "../../middlewares/validators/rules/product.js";
import {validate} from "../../middlewares/validators/validate.js";
import filter from "../../middlewares/filters/index.js";

export const router = express.Router();

router.route("/:id")
    .get(productRules.read, validate, productController.read)
    .delete(productRules.destroy, validate, productController.destroy);

router.route("/")
    .get(productRules.filter, validate, filter.product, productController.products)
    .patch(productRules.update, validate, productController.update)
    .post(productRules.create, validate, productController.create);
