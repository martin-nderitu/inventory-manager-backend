import {query, body} from "express-validator";
import Sequelize from "sequelize";
import db from "../../../models/index.js";
import {destroy} from "./libs/destroy.js";
import {read} from "./libs/read.js";
import itemExists from "./libs/itemExists.js";
import {description} from "./libs/description.js";
import toTitleCase from "../../../libs/toTitleCase.js";
import filters from "./libs/filters.js";
import {queryWithFilter} from "./libs/queryWithFilter.js";

const Op = Sequelize.Op;
const {Category, Product} = db;

// categoryId, name, description, unitCost, unitPrice, store, counter
const commonRules = [
    body("categoryId")
        .trim().escape().notEmpty().withMessage("Category id is required").bail()
        .custom(async (id: string) => {
            const category = await Category.findByPk(id);
            if (category === null) {
                throw new Error("Category not found");
            }
            return true;
        }),

    body("name")
        .trim().escape().notEmpty().withMessage("Product name is required")
        .isLength({ min: 2, max: 50 }).withMessage("Product name must be between 2 and 50 characters")
        .bail()
        .custom( async (name: string, {req}) => {
            const product = await Product.findOne({ where : { name } });
            if(itemExists(product, req.body.id)) {
                return Promise.reject("A product with this name already exists");
            }
            return true;
        })
        .customSanitizer((name: string) => {
            return toTitleCase(name);
        }),

    description,

    body("unitCost")
        .trim().escape().notEmpty().withMessage("Unit cost is required")
        .isDecimal({ decimal_digits: "1,2"} )
        .withMessage("Unit cost must not exceeding 2 decimal places")
        .isFloat({ min: 1.00 }).withMessage("Unit cost must be greater than 1.00")
        .toFloat(),

    body("unitPrice")
        .trim().escape().notEmpty().withMessage("Unit price is required")
        .isDecimal({decimal_digits: "1,2"})
        .withMessage("Unit price must not exceeding 2 decimal places")
        .isFloat({ min: 1.00 }).withMessage("Unit price must be greater than 1.00")
        .toFloat()
        .custom( (unitPrice, {req}) => {
            if (unitPrice < req.body.unitCost) {
                throw new Error("Unit price must not be less than unit cost");
            }
            return true;
        }),

    body("store")
        .trim().escape().notEmpty().withMessage("Number of items in store is required")
        .isInt({ min: 1 }).withMessage("Number of items in store must be greater than 0")
        .toInt(),

    body("counter")
        .trim().escape().notEmpty().withMessage("Number of items in counter is required")
        .isInt({ min: 1 }).withMessage("Number of items in counter must be greater than 0")
        .toInt(),
];

export const productRules = {
    filter: [
        query("name")
            .optional({ checkFalsy: true }).trim().escape(),

        queryWithFilter(
            "category",
            async (categoryName) => await Category.findAll({
                where: {
                    name: { [Op.like]: `%${categoryName}%` }
                }
            })
        ),
        
        ...filters,
    ],

    create: commonRules,

    read: [
        read("Product"),
    ],

    update: [
        body("id")
            .trim().escape().notEmpty().withMessage("Product id is required")
            .custom(async (id: string) => {
                const product = await Product.findByPk(id);
                if (product === null) {
                    throw new Error("Product not found");
                }
                return true;
            }),

        ...commonRules,
    ],

    destroy: [
        destroy(
            "Product",
            async (pk) => await Product.findByPk(pk)
        ),
    ],
}
