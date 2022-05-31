import {query, check, oneOf} from "express-validator";
import {isValid} from "date-fns";

/**
 * Common filters used for searching
 */

const pagination = [
    /**
     * limit - number of rows to return from db.
     * Should be a number between 5-500 or string "all" to return all rows
     */
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
    ], "Invalid limit. Provide a number 5-500 or string 'all'"),

    /**
     * page - the page number to get
     * Should be a number greater than 0
     */
    query("page")
        .optional({ checkFalsy: true })
        .trim().escape().isInt({ min: 1 }).withMessage("Page number must be greater than 0")
        .toInt(),
];

const sorting = [
    /**
     * sort - a comma separated string of space separated column and order direction.
     * Eg: "col1 asc, col2 desc"
     * column must be a valid column name
     * order direction must be either "asc" or "desc". "asc" is the default
     */
    query("sort")
        .optional({ checkFalsy: true })
        .trim().escape()
        .matches(/^[A-Za-z,\s]+$/)
        .withMessage("Sort must be a comma separated string of space separated column and order direction" +
            "e.g. \"col1, col2 desc, col3 asc\"")
        .customSanitizer((sort: string) =>
            sort.split(",").map(element => element.trim().toLowerCase().split(" "))
        )
        .custom((sort: string[][])=> {
            for (const element of sort){
                if (element.length > 1) {
                    const col = element[0];
                    const direction = element[1];
                    if (direction !== "asc" && direction !== "desc") {
                        throw new Error(`Invalid sort direction '${direction}' for column ${col}. Enter 'asc' or 'desc'`)
                    }
                }
            }
            return true;
        }),
];

const dates = [
    /**
     * from - a valid date
     * queries rows created since this date
     */
    query("from")
        .optional({ checkFalsy: true })
        .trim().escape()
        .custom(date => {
            if (isValid(new Date(date))) { return true; }
            throw new Error("Date from must be a valid date");
        })
        .bail()
        .customSanitizer((date: string) => new Date(date)),

    /**
     * to - a valid date
     * queries rows created earlier than or on this date
     */
    query("to")
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
        })
];

export default [...pagination, ...sorting, ...dates];
