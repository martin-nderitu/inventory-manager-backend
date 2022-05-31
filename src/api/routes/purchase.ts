import { default as express } from "express";
import * as purchaseController from "../controllers/purchase.js";
import {purchaseRules} from "../../middlewares/validators/rules/purchase.js";
import {validate} from "../../middlewares/validators/validate.js";
import filter from "../../middlewares/filters/index.js";

export const router = express.Router();

router.route("/:id")
    .get(purchaseRules.read, validate, purchaseController.read)
    .delete(purchaseRules.destroy, validate, purchaseController.destroy);

router.route("/")
    .get(purchaseRules.filter, validate, filter.purchase, purchaseController.purchases)
    .patch(purchaseRules.update, validate, purchaseController.update)
    .post(purchaseRules.create, validate, purchaseController.create);

