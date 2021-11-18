import {query, body} from "express-validator";
import Sequelize from "sequelize";
import toTitleCase from "../../libs/toTitleCase.js";
import db from "../../models/index.js";
import {pagination} from "./common/pagination.js";
import {sorting} from "./common/sorting.js";
import {dateFrom, dateTo} from "./common/filters.js";
import {description} from "./common/description.js";
import {destroy} from "./common/destroy.js";
import {read} from "./common/read.js";
import {ValidationRules} from "./index.js";
import itemExists from "./common/itemExists.js";

const Op = Sequelize.Op;
const {Category, Product} = db;

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

export const productRules: ValidationRules = {
    filter: [
        query("name")
            .optional({ checkFalsy: true }).trim().escape(),
        query("category")   // category name
            .optional().trim().escape().bail()
            .customSanitizer( async (categoryName: string) => {
                const rows = await Category.findAll({
                    where: {
                        name: { [Op.like]: `%${categoryName}%` }
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

    create: [ ...commonRules, description, ],

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
        description,
    ],

    destroy: [
        destroy(
            "Product",
            async (pk) => await Product.findByPk(pk)
        ),
    ],
}
