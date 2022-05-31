import {query, body} from "express-validator";
import Sequelize from "sequelize";
import db from "../../../models/index.js";
import {destroy} from "./libs/destroy.js";
import {read} from "./libs/read.js";
import filters from "./libs/filters.js";
import {queryWithFilter} from "./libs/queryWithFilter.js";

const Op = Sequelize.Op;
const {Product, Sale} = db;

const quantity = body("quantity")
    .trim().escape().notEmpty().withMessage("Quantity of items sold is required")
    .isInt({ min: 1 }).withMessage("Quantity of items sold must be greater than 0")
    .toInt();

export const saleRules = {
    filter: [
        queryWithFilter(
            "product",
            async (productName) => await Product.findAll({
                where: {
                    name: { [Op.like]: `%${productName}%` }
                }
            })
        ),
        
        ...filters,
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
        
        quantity,
    ],

    destroy: [
        destroy(
            "Sale",
            async (pk) => await Sale.findByPk(pk)
        ),
    ],
}
