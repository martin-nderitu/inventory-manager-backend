import { default as express } from "express";
import * as categoryController from "../controllers/category.js";
import {categoryRules} from "../../middlewares/validationRules/category.js";
import {validate} from "../../middlewares/validate.js";
import filter from "../../middlewares/filter.js";

export const router = express.Router();

router.route("/:id")
    .get(categoryRules.read, validate, categoryController.read)
    .delete(categoryRules.destroy, validate, categoryController.destroy);

router.route("/")
    .get(categoryRules.filter, validate, filter.category, categoryController.categories)
    .patch(categoryRules.update, validate, categoryController.update)
    .post(categoryRules.create, validate, categoryController.create);
