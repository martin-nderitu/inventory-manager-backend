import {Pagination} from "../types.js";

export default function getPagination(
    page: number | undefined,
    limit: number | "all" | undefined
): Pagination | undefined {
    
    if (limit === "all") {
        return;     // no need to paginate if all items have been requested
    }

    if (page) {
        if (page < 1) {
            page = 1;
        }
    } else {
        page = 1;   // default page
    }

    if (limit) {
        if (limit > 500) {
            limit = 500;    // maximum limit is 500
        }
        if (limit < 5) {
            limit = 5;
        }
    } else {
        limit = 5;  // default limit
    }

    const offset = page > 1 ? (page - 1) * limit : 0;

    return {
        currentPage: page,
        limit,
        offset
    };
}