import {param} from "express-validator";

export const destroy = (name: string, callback: { (pk: string): any }, fields: string | string[] = "id") => {
    return param(fields)
        .trim().escape().notEmpty().withMessage(`${name} id(s) is/are required`)
        .bail().customSanitizer( (value: string) => value.split(","))
        .custom(async (value: string[]) => {
            for (const id of value) {
                const response = await callback(id);
                if (response === null) {
                    return Promise.reject(`${name} with id '${id}' not found`);
                }
            }
            return true;
        });
}