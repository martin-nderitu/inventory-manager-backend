import sequelize from "../config/config.js";
import {Db, Models} from "./types.js";
import {CategoryFactory} from "./category.js";
import {ProductFactory} from "./product.js";
import {PurchaseFactory} from "./purchase.js";
import {SaleFactory} from "./sale.js";
import {SupplierFactory} from "./supplier.js";
import {TransferFactory} from "./transfer.js";

const models: Models = {
    Category: CategoryFactory(sequelize),
    Product: ProductFactory(sequelize),
    Purchase: PurchaseFactory(sequelize),
    Sale: SaleFactory(sequelize),
    Supplier: SupplierFactory(sequelize),
    Transfer: TransferFactory(sequelize)
};

Object.keys(models).forEach((modelName: string) => {
    if (models[modelName].associations) {
        models[modelName].associate(models);
    }
});

const db: Db = {
    sequelize,
    ...models,
};

export default db;