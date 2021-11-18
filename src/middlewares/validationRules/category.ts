import {query, body} from "express-validator";
import db from "../../models/index.js";
import {pagination} from "./common/pagination.js";
import {sorting} from "./common/sorting.js";
import {dateFrom, dateTo} from "./common/filters.js";
import {description} from "./common/description.js";
import {destroy} from "./common/destroy.js";
import {read} from "./common/read.js";
import {ValidationRules} from "./index.js";
import toTitleCase from "../../libs/toTitleCase.js";
import itemExists from "./common/itemExists.js";

const {Category} = db;

const categoryName = body("name")
    .trim().escape().notEmpty().withMessage("Category name is required")
    .isLength({ min: 2, max: 50 }).withMessage("Category name must be between 2 and 50 characters")
    .toLowerCase().bail()
    .custom( async (name, {req}) => {
        const category = await Category.findOne({ where : { name } });
        if(itemExists(category, req.body.id)) {
            return Promise.reject("A category with this name already exists");
        }
        return true;
    })
    .customSanitizer((name: string) => {
        return toTitleCase(name);
    });

export const categoryRules: ValidationRules = {
    filter: [
        query("name")
            .optional({ checkFalsy: true }).trim().escape(),
        dateFrom,
        dateTo,
        ...sorting,
        ...pagination,
    ],

    create: [
        categoryName,
        description,
    ],

    read: [
        read("Category")
    ],

    update: [
        body("id")
            .trim().escape().notEmpty().withMessage("Category id is required")
            .custom(async (id: string) => {
                const category = await Category.findByPk(id);
                if (category === null) {
                    throw new Error("Category not found");
                }
                return true;
            }),
        categoryName,
        description,
    ],

    destroy: [
        destroy(
            "Category",
            async (pk) => await Category.findByPk(pk)
        ),
    ],
};
