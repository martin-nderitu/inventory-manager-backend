import {query, body} from "express-validator";
import Sequelize from "sequelize";
import db from "../../models/index.js";
import {pagination} from "./common/pagination.js";
import {sorting} from "./common/sorting.js";
import {dateFrom, dateTo} from "./common/filters.js";
import {destroy} from "./common/destroy.js";
import {read} from "./common/read.js";
import {ValidationRules} from "./index.js";

const Op = Sequelize.Op;
const {Product, Sale} = db;

const quantity = body("quantity")
    .trim().escape().notEmpty().withMessage("Quantity of items purchased is required")
    .isInt({ min: 1 }).withMessage("Quantity of items purchased must be greater than 0")
    .toInt();

export const saleRules: ValidationRules = {
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
        quantity,
    ],

    read: [
        read("Sale"),
    ],

    update: [
        body("id")
            .trim().escape().notEmpty().withMessage("Sale id is required").bail()
            .custom(async (id: string) => {
                const sale = await Sale.findByPk(id);
                if (sale === null) {
                    throw new Error("Sale not found");
                }
                return true;
            }),
        quantity
    ],

    destroy: [
        destroy(
            "Sale",
            async (pk) => await Sale.findByPk(pk)
        ),
    ],
}
