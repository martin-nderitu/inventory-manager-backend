import Sequelize, {Order} from "sequelize";
import { Request } from "express";
import getPagination from "./pagination.js";
import {Filter} from "../types.js";

const Op = Sequelize.Op;

export default function commonFilters(
    req: Request,
    conditions: unknown[]
) {
    const { sort, page, limit, from, to } = req.query; // common query params

    // default ordering is "created_at desc"
    const order = (sort as unknown as Order | undefined) || [ ["createdAt", "desc"] ];

    const pagination = getPagination(
        page  as unknown as number | undefined,
        limit as unknown as number | "all" | undefined
    );

    if (from) {
        conditions.push({
            createdAt: { [Op.gte]: from }
        });
    }

    if (to) {
        conditions.push({
            createdAt: { [Op.lte]: to }
        });
    }

    let condition = {};
    if (conditions.length) {
        condition = {
            [Op.and]: [conditions]
        }
    }

    const filter: Filter = {
        where: condition,
        order,
    };

    if (pagination) {
        const { offset, limit } = pagination;
        filter.offset = offset;
        filter.limit = limit;
    }

    return {
        filter,
        pagination
    }
}