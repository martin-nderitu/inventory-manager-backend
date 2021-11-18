import {query} from "express-validator";
import {isValid} from "date-fns";

export const dateFrom = query("from")
    .optional({ checkFalsy: true })
    .trim().escape()
    .custom(date => {
        if (isValid(new Date(date))) { return true; }
        throw new Error("Date from must be a valid date");
    })
    .bail()
    .customSanitizer((date: string) => new Date(date));

export const dateTo = query("to")
    .optional({ checkFalsy: true })
    .trim().escape()
    .custom((date: string) => {
        if (isValid(new Date(date))) { return true; }
        throw new Error("Date to must be a valid date");
    })
    .bail()
    .customSanitizer((date: string) => new Date(date))
    .custom( (to, {req}) => {
        if (req.query?.from && to < req.query.from) {
            throw new Error("Date to cannot be before date from")
        }
        return true;
    });
