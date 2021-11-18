import {query} from "express-validator";


/**
 * sort is a comma separated string of space separated column and order direction e.g.
 * "col1 asc, col2 desc"
 * column is a valid column name
 * order direction is either 'asc' or 'desc'. 'asc' is the default
 */
export const sorting = [
    query("sort")
        .optional({ checkFalsy: true })
        .trim().escape()
        .matches(/^[A-Za-z,\s]+$/)
        .withMessage("Sort must be a comma separated string of space separated column and order direction" +
            "e.g. \"col1, desc col2, asc\"")
        .customSanitizer((sort: string) =>
            sort.split(",").map(element => element.trim().toLowerCase().split(" "))
        )
        .custom((sort: string[])=> {
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
