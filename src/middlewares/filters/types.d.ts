import {Order, WhereOptions} from "sequelize";

export interface Filter {
    where: WhereOptions;
    order: Order;
    offset?: number;
    limit?: number;
}

export interface Pagination {
    [k: string]: number;
    currentPage: number;
    limit: number;
    offset: number;
    count?: number;
}