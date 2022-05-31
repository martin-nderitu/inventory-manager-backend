import { Request, Response, NextFunction } from "express";
import {ValidationError, validationResult} from "express-validator";

interface InvalidData {
    [k: string]: string;
}

const createInvalidDataObject = (errors: ValidationError[]) => {
    const invalidData: InvalidData = {};

    for (const error of errors) {
        if (error.nestedErrors) {
            (error.nestedErrors as ValidationError[]).forEach(error => invalidData[error.param] = error.msg);
        }
        else {
            invalidData[error.param] = error.msg;
        }
    }

    return invalidData;
}

export function validate(req: Request, res: Response, next: NextFunction) {
    try {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            next();
        } else {
            const errs = errors.array();
            const invalidData = createInvalidDataObject(errs);

            return res.status(400).json({
                invalidData
            });
        }
    } catch (error) {
        console.log("\n\nError in validate middleware = ", error, "\n\n")
    }
}
