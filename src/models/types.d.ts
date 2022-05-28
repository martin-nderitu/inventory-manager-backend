import {Sequelize} from "sequelize";
import {Category} from "./category.js";
import {Product} from "./product.js";
import {Purchase} from "./purchase.js";
import {Sale} from "./sale.js";
import {Supplier} from "./supplier.js";
import {Transfer} from "./transfer.js";

type DbModels = typeof Category | typeof Product | typeof Purchase | typeof Sale | typeof Supplier | typeof Transfer;

export interface Models {
    [k: string]: DbModels;
    Category: typeof Category;
    Product: typeof Product;
    Purchase: typeof Purchase;
    Sale: typeof Sale;
    Supplier: typeof Supplier;
    Transfer: typeof Transfer;
}

export interface Db extends Models {
    [k: string]: Sequelize | DbModels;
    sequelize: Sequelize;
}

