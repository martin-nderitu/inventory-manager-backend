import {Sequelize} from "sequelize";
import dotenv from "dotenv";
import dbConfig from "../config/config.js";
import {CategoryFactory} from "./category.js";
import {ProductFactory} from "./product.js";
import {PurchaseFactory} from "./purchase.js";
import {SaleFactory} from "./sale.js";
import {SupplierFactory} from "./supplier.js";
import {TransferFactory} from "./transfer.js";

dotenv.config();

const env = process.env.NODE_ENV || "development";

// @ts-ignore
const config = dbConfig[env];

let sequelize;

if (config.use_env_variable) {
    // @ts-ignore
    sequelize = new Sequelize(config.use_env_variable, config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const db = {
    sequelize,
    Sequelize,
    Category: CategoryFactory(sequelize),
    Product: ProductFactory(sequelize),
    Purchase: PurchaseFactory(sequelize),
    Sale: SaleFactory(sequelize),
    Supplier: SupplierFactory(sequelize),
    Transfer: TransferFactory(sequelize),
};

Object.keys(db).forEach(modelName => {
    // @ts-ignore
    if (db[modelName].associations) {
        // @ts-ignore
        db[modelName].associate(db);
    }
})

export default db;
