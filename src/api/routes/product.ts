import { default as express } from "express";
import * as productController from "../controllers/product.js";
import {productRules} from "../../middlewares/validationRules/product.js";
import {validate} from "../../middlewares/validate.js";
import filter from "../../middlewares/filter.js";

export const router = express.Router();

router.route("/:id")
    .get(productRules.read, validate, productController.read)
    .delete(productRules.destroy, validate, productController.destroy);

router.route("/")
    .get(productRules.filter, validate, filter.product, productController.products)
    .put(productRules.update, validate, productController.update)
    .post(productRules.create, validate, productController.create);
