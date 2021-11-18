import {query, body, ValidationChain} from "express-validator";
import Sequelize from "sequelize";
import db from "../../models/index.js";
import {pagination} from "./common/pagination.js";
import {sorting} from "./common/sorting.js";
import {dateFrom, dateTo} from "./common/filters.js";
import {destroy} from "./common/destroy.js";
import {read} from "./common/read.js";
import {Middleware} from "express-validator/src/base";

const Op = Sequelize.Op;
const {Product, Transfer} = db;


export const transferRules = {
    filter: [
        query("product")
            .optional({ checkFalsy: true }).trim().escape().bail()
            .customSanitizer( async (product: string) => {
                const rows = await Product.findAll({
                    where: {
                        name: { [Op.like]: `%${product}%` }
                    }
                });
                if (rows.length) { return rows.map( (row) => row.id) }
                else { return null }
            }),
        dateFrom,
        dateTo,
        ...sorting,
        ...pagination,
    ],

    create: [
        body("productId")
            .trim().escape().notEmpty().withMessage("Product id is required").bail()
            .custom(async (id: string) => {
                const product = await Product.findByPk(id);
                if (product === null) {
                    throw new Error("Product not found");
                }
                return true;
            }),

        body("quantity")
            .trim().escape().notEmpty().withMessage("Quantity of items purchased is required")
            .isInt({ min: 1 }).withMessage("Quantity of items purchased must be greater than 0")
            .toInt(),

        body("source")
            .trim().escape().notEmpty().withMessage("Source location is required")
            .isAlpha().withMessage("Source location must be alphabetic")
            .isIn(["store", "counter"]).withMessage("Valid source locations are 'store' or 'counter'"),

        body("destination")
            .trim().escape().notEmpty().withMessage("Destination location is required")
            .isAlpha().withMessage("Destination location must be alphabetic")
            .isIn(["store", "counter"]).withMessage("Valid destination locations are 'store' or 'counter'"),
    ],

    read: [
        read("Transfer"),
    ],

    destroy: [
        destroy(
            "Transfer",
            async (pk) => await Transfer.findByPk(pk)
        ),
    ],
}
