import { default as express } from "express";
import * as supplierController from "../controllers/supplier.js";
import {supplierRules} from "../../middlewares/validators/rules/supplier.js";
import {validate} from "../../middlewares/validators/validate.js";
import filter from "../../middlewares/filters/index.js";

export const router = express.Router();

router.route("/:id")
    .get(supplierRules.read, validate, supplierController.read)
    .delete(supplierRules.destroy, validate, supplierController.destroy);

router.route("/")
    .get(supplierRules.filter, validate, filter.supplier, supplierController.suppliers)
    .patch(supplierRules.update, validate, supplierController.update)
    .post(supplierRules.create, validate, supplierController.create);

