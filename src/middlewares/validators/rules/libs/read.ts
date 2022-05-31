import {param} from "express-validator";

export const read = (
    name: string,
    fields: string | string[] = "id"
) => {
    return param(fields)
        .trim().escape().notEmpty().withMessage(`${name} id is required`)
}