import {query} from "express-validator";

interface U {
    id: string;
}

export const queryWithFilter = <T extends U>(
    fields: string | string[],
    filter: { (arg: string): Promise<T[]> }
) => {
    return query(fields)
        .optional().trim().escape().bail()
        .customSanitizer( async (value: string) => {
            const rows = await filter(value);
            if (rows.length) {
                return rows.map( (row) => row.id);
            }
            else {
                return null;
            }
        });
}