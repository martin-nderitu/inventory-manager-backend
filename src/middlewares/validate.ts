import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";


export function validate(req: Request, res: Response, next: NextFunction) {
    try {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            next();
        } else {
            const errs = errors.array();
            const invalidData: { [k: string]: string } = {};

            for (const err of errs) {
                if (err.nestedErrors) {
                    const errors = [];
                    for (const nestedErr of err.nestedErrors) {
                        // @ts-ignore
                        invalidData[nestedErr.param] = nestedErr.msg;
                        errors.push({...invalidData});
                    }
                }
                else {
                    invalidData[err.param] = err.msg;
                }
            }

            return res.status(400).json({
                invalidData
            });
        }
    } catch (errors) {
        console.log("\n\nErrors in validation middleware = ", errors, "\n\n")
    }
}

