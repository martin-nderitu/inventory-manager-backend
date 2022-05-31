import {query, body} from "express-validator";
import Sequelize from "sequelize";
import db from "../../../models/index.js";
import {destroy} from "./libs/destroy.js";
import {read} from "./libs/read.js";
import filters from "./libs/filters.js";
import {queryWithFilter} from "./libs/queryWithFilter.js";

const Op = Sequelize.Op;
const {Purchase, Supplier, Product} = db;

const commonRules = [
    body("supplierId")
        .trim().escape().notEmpty().withMessage("Supplier id is required").bail()
        .custom(async (id: string) => {
            const supplier = await Supplier.findByPk(id);
            if (supplier === null) {
                throw new Error("Supplier not found");
            }
            return true;
        }),

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

    body("location")
        .trim().escape().notEmpty().withMessage("Location is required")
        .isAlpha().withMessage("Location must be alphabetic")
        .isIn(["store", "counter"]).withMessage("Valid locations are 'store' or 'counter'"),
];

export const purchaseRules = {
    filter: [
        queryWithFilter(
            "supplier",
            async (supplierName) => await Supplier.findAll({
                where: {
                    name: { [Op.like]: `%${supplierName}%` }
                }
            })
        ),

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

    create: commonRules,

    read: [
        read("Purchase"),
    ],

    update: [
        body("id")
            .trim().escape().notEmpty().withMessage("Purchase id is required").bail()
            .custom(async (id: string) => {
                const purchase = await Purchase.findByPk(id);
                if (purchase === null) {
                    throw new Error("Purchase not found");
                }
                return true;
            }),
        
        ...commonRules
    ],

    destroy: [
        destroy(
            "Purchase",
            async (pk) => await Purchase.findByPk(pk)
        ),
    ],
}
