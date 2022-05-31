import { default as express } from "express";
import * as transferController from "../controllers/transfer.js";
import {transferRules} from "../../middlewares/validators/rules/transfer.js";
import {validate} from "../../middlewares/validators/validate.js";
import filter from "../../middlewares/filters/index.js";

export const router = express.Router();

router.route("/:id")
    .get(transferRules.read, validate, transferController.read)
    .delete(transferRules.destroy, validate, transferController.destroy);

router.route("/")
    .get(transferRules.filter, validate, filter.transfer, transferController.transfers)
    .post(transferRules.create, validate, transferController.create);

