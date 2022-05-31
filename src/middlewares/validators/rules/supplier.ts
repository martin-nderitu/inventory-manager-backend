import {query, body} from "express-validator";
import db from "../../../models/index.js";
import {destroy} from "./libs/destroy.js";
import {read} from "./libs/read.js";
import itemExists from "./libs/itemExists.js";
import toTitleCase from "../../../libs/toTitleCase.js";
import filters from "./libs/filters.js";

const {Supplier} = db;

const commonRules = [
    body("name")
        .trim().escape().notEmpty().withMessage("Supplier's name is required")
        .isLength({ min: 2, max: 50 }).withMessage("Supplier's name must be between 2 and 50 characters")
        .bail()
        .custom( async (name: string, {req}) => {
            const supplier = await Supplier.findOne({ where : { name } });
            if(itemExists(supplier, req.body.id)) {
                return Promise.reject("A supplier with this name already exists");
            }
            return true;
        })
        .customSanitizer((name: string) => {
            return toTitleCase(name);
        }),

    body("phone")
        .trim().escape().notEmpty().withMessage("Supplier's phone number is required")
        .isLength({min: 10, max: 10}).withMessage("A phone number must be 10 characters long")
        .isInt().withMessage("A phone number must be numerical")
        .bail()
        .custom( async (phone: string, {req}) => {
            const supplier = await Supplier.findOne({ where : { phone } });
            if(itemExists(supplier, req.body.id)) {
                return Promise.reject("A supplier with this phone number already exists");
            }
            return true;
        }),

    body("email")
        .optional({ checkFalsy: true })
        .trim().escape().isLength({ min: 5, max: 40 }).withMessage("Email must be between 5 and 40 characters long")
        .isEmail().withMessage("Please provide a valid email address")
        .normalizeEmail().toLowerCase().bail()
        .custom( async (email: string, {req}) => {
            const supplier = await Supplier.findOne({ where : { email } });
            if(itemExists(supplier, req.body.id)) {
                return Promise.reject("A supplier with this email address already exists");
            }
            return true;
        }),
];

export const supplierRules = {
    filter: [
        query("name")
            .optional({ checkFalsy: true }).trim().escape(),
        
        ...filters,
    ],

    create: commonRules,

    read: [
        read("Supplier"),
    ],

    update: [
        body("id")
            .trim().escape().notEmpty().withMessage("Supplier id is required")
            .custom(async (id: string) => {
                const supplier = await Supplier.findByPk(id);
                if (supplier === null) {
                    throw new Error("Supplier not found");
                }
                return true;
            }),
        
        ...commonRules,
    ],

    destroy: [
        destroy(
            "Supplier",
            async (pk) => await Supplier.findByPk(pk)
        ),
    ],
}
