import Sequelize from "sequelize";
import { Request, Response, NextFunction } from "express";

const Op = Sequelize.Op;


interface Pagination {
    [k: string]: number;
    currentPage: number;
    limit: number;
    offset: number;
}

interface Filter {
    where: any;
    order: any;
    offset?: number;
    limit?: number;
}

function getPagination(page: number | undefined, limit: number | "all" | undefined): Pagination | undefined {
    if (limit === "all") { return; }

    if (page) {
        if (page < 1) { page = 1; }
    } else { page = 1; }

    if (limit) {
        if (limit > 500) { limit = 500; }
        if (limit < 5) { limit = 5; }
    } else { limit = 5; }   // default limit

    let offset = page > 1 ? (page - 1) * limit : 0;

    return { currentPage: page, limit, offset };
}

function processFilters(req: Request, res: Response, next: NextFunction, conditions: any[]) {
    const { sort, page, limit, from, to } = req.query; // common query params
    const order = sort || [ ["createdAt", "desc"] ];   // default ordering is "createdAt desc"
    // @ts-ignore
    const pagination = getPagination(page, limit);

    if (from) { conditions.push({ createdAt: { [Op.gte]: from } }) }

    if (to) { conditions.push({ createAt: { [Op.lte]: to } }) }

    let condition = {};
    if (conditions.length) { condition = { [Op.and]: [conditions] } }

    const filter: Filter = {
        where: condition,
        order,
    };

    if (pagination) {
        const { offset, limit } = pagination;
        filter.offset = offset;
        filter.limit = limit;
    }

    res.locals.filter = filter;
    res.locals.pagination = pagination || {};
    next();
}

function category(req: Request, res: Response, next: NextFunction) {
    const { name } = req.query;
    const conditions = [];

    if (name) {
        conditions.push({
            name: { [Op.like]: `%${name}%` }
        })
    }

    processFilters(req, res, next, conditions);
}

function product(req: Request, res: Response, next: NextFunction) {
    const { name, category } = req.query;
    const conditions = [];
    if (name) {
        conditions.push({
            name: { [Op.like]: `%${name}%` }
        })
    }
    if (category) { conditions.push({ categoryId: category }); }
    processFilters(req, res, next, conditions);
}

function purchase(req: Request, res: Response, next: NextFunction) {
    const { supplier, product } = req.query;
    const conditions = [];

    if (supplier) { conditions.push({ supplierId: supplier }); }
    if (product) { conditions.push({ productId: product }); }
    processFilters(req, res, next, conditions);
}

function sale(req: Request, res: Response, next: NextFunction) {
    const { product } = req.query;
    const conditions = [];
    if (product) { conditions.push({ productId: product }); }

    processFilters(req, res, next, conditions);
}

function supplier(req: Request, res: Response, next: NextFunction) {
    const { name } = req.query;
    const conditions = [];

    if (name) {
        conditions.push({
            name: { [Op.like]: `%${name}%` }
        })
    }

    processFilters(req, res, next, conditions);
}

function transfer(req: Request, res: Response, next: NextFunction) {
    const { product } = req.query;
    const conditions = [];
    if (product) { conditions.push({ productId: product }); }

    processFilters(req, res, next, conditions);
}


export default {
    category, product, purchase, sale, supplier, transfer
}