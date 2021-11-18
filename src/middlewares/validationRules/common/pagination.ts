import {query, check, oneOf} from "express-validator";


export const pagination = [

    oneOf([
        check("limit")
            .optional({ checkFalsy: true })
            .trim().escape()
            .isInt({ min: 5, max: 500}).withMessage("Limit must be between 5 and 500")
            .toInt(),

        check("limit")
            .optional({ checkFalsy: true })
            .trim().escape()
            .isAlpha().withMessage("Limit must be alphabetic")
            .isIn(["all"]).withMessage("Invalid limit. Did you mean 'all'?")
            .toLowerCase(),
    ], "Invalid limit. Provide number 5-500 or 'all'"),

    query("page")
        .optional({ checkFalsy: true })
        .trim().escape().isInt({ min: 1 }).withMessage("Page number must be greater than 0")
        .toInt(),
];
