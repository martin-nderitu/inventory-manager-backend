import { default as express } from "express";
import * as transferController from "../controllers/transfer.js";
import {transferRules} from "../../middlewares/validationRules/transfer.js";
import {validate} from "../../middlewares/validate.js";
import filter from "../../middlewares/filter.js";

export const router = express.Router();

router.route("/:id")
    .get(transferRules.read, validate, transferController.read)
    .delete(transferRules.destroy, validate, transferController.destroy);

router.route("/")
    .get(transferRules.filter, validate, filter.transfer, transferController.transfers)
    .post(transferRules.create, validate, transferController.create);

