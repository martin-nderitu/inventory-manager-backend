import {ValidationChain} from "express-validator";
import {Middleware} from "express-validator/src/base";

export interface ValidationRules {
    [k: string]: ValidationChain[] | Middleware[];
    filter: Middleware[];
    create: ValidationChain[];
    read: ValidationChain[];
    update: ValidationChain[];
    destroy: ValidationChain[];
}
