import Sequelize from "sequelize";
import { Request, Response, NextFunction } from "express";
import processFilters from "./processFilters.js";

const Op = Sequelize.Op;

export function purchase(req: Request, res: Response, next: NextFunction) {
    const { supplier, product } = req.query;
    const conditions = [];

    if (supplier) {
        conditions.push({
            supplierId: supplier
        });
    }
    
    if (product) {
        conditions.push({
            productId: product
        });
    }
    
    processFilters(req, res, next, conditions);
}
