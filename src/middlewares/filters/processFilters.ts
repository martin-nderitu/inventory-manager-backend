import { Request, Response, NextFunction } from "express";
import commonFilters from "./libs/common.js";

export default function processFilters(
    req: Request,
    res: Response,
    next: NextFunction,
    conditions: unknown[]
) {
    const {filter, pagination} = commonFilters(req, conditions);
    res.locals.filter = filter;
    res.locals.pagination = pagination || {};
    next();
}