import { default as express } from "express";
import * as purchaseController from "../controllers/purchase.js";
import {purchaseRules} from "../../middlewares/validationRules/purchase.js";
import {validate} from "../../middlewares/validate.js";
import filter from "../../middlewares/filter.js";

export const router = express.Router();

router.route("/:id")
    .get(purchaseRules.read, validate, purchaseController.read)
    .delete(purchaseRules.destroy, validate, purchaseController.destroy);

router.route("/")
    .get(purchaseRules.filter, validate, filter.purchase, purchaseController.purchases)
    .put(purchaseRules.update, validate, purchaseController.update)
    .post(purchaseRules.create, validate, purchaseController.create);

