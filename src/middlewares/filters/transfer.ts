import Sequelize from "sequelize";
import { Request, Response, NextFunction } from "express";
import processFilters from "./processFilters.js";

const Op = Sequelize.Op;

export function transfer(req: Request, res: Response, next: NextFunction) {
    const { product } = req.query;
    const conditions = [];
    if (product) {
        conditions.push({
            productId: product
        });
    }

    processFilters(req, res, next, conditions);
}
