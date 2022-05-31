import Sequelize from "sequelize";
import { Request, Response, NextFunction } from "express";
import processFilters from "./processFilters.js";

const Op = Sequelize.Op;

export function category (req: Request, res: Response, next: NextFunction) {
    const {name} = req.query;
    const conditions = [];

    if (name) {
        conditions.push({
            name: {
                [Op.like]: `%${name}%`
            }
        });
    }

    processFilters(req, res, next, conditions);
}