import { Request, Response, NextFunction } from "express";
import db from "../../models/index.js";

const {sequelize, Purchase, Product, Supplier} = db;

async function purchases(req: Request, res: Response, next: NextFunction) {
    try {
        const { filter, pagination} = res.locals;
        const {count, rows} = await Purchase.findAndCountAll({
            distinct: true,
            include: [
                {
                    model: Product,
                    as: "product"
                },
                {
                    model: Supplier,
                    as: "supplier"
                },
            ],
            ...filter,
        });

        if (count) {
            pagination.count = count;
            return res.status(200).json({ purchases: rows, pagination });
        } else {
            return res.status(400).json({
                error: "No purchases found"
            });
        }
    } catch (error) {
        console.log("\n\nError getting purchases: ", error, "\n\n");
        next({ status: 500, error: "Db error getting purchases" });
    }
}

async function create(req: Request, res: Response) {
    try {
        const { supplierId, productId, quantity, unitCost, unitPrice, location } = req.body;
        const supplier = Supplier.findByPk(supplierId);
        if (supplier === null) {
            return res.status(400).json({
                error: "Supplier not found"
            })
        }

        const product = await Product.findByPk(productId);
        if (product === null) {
            return res.status(400).json({
                error: "Product not found"
            })
        }

        return await sequelize.transaction(async (t) => {
            const purchase = await Purchase.create({
                supplierId, productId, quantity, unitCost, unitPrice, location
            }, { transaction: t });

            let { store, counter } = product.dataValues!;
            if (location === "store") { store += quantity }
            if (location === "counter") { counter += quantity }
            if (store < 0) {
                throw new Error("Purchase creation will result in a negative value for items in store");
            }
            if (counter < 0) {
                throw new Error("Purchase creation will result in a negative value for items in counter");
            }
            const [affectedProductRows]= await Product.update({ unitCost, unitPrice, store, counter }, {
                where: { id: productId },
                transaction: t
            });

            if (purchase.dataValues && affectedProductRows === 1) {
                return res.status(201).json({ purchase });
            } else { throw new Error("Purchase not created. Please try again") }
        });
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
}

async function read(req: Request, res: Response, next: NextFunction) {
    try {
        const purchase = await Purchase.findByPk(req.params.id);
        if (purchase === null) {
            return res.status(400).json({
                error: "Purchase not found"
            });
        } else {
            return res.status(200).json({ purchase });
        }
    } catch (error) {
        console.log("\n\nError getting purchase: ", error, "\n\n");
        next({ status: 500, error: "Db error getting purchase" });
    }
}

async function update(req: Request, res: Response) {
    try {
        const { id, supplierId, productId, quantity, unitCost, unitPrice, location } = req.body;
        const purchase = await Purchase.findByPk(id);
        if (purchase === null) {
            return res.status(400).json({
                error: "Purchase not found"
            });
        }

        const supplier = Supplier.findByPk(supplierId);
        if (supplier === null) {
            return res.status(400).json({
                error: "Supplier not found"
            });
        }

        const product = await Product.findByPk(productId);
        if (product === null) {
            return res.status(400).json({
                error: "Product not found"
            });
        }

        return await sequelize.transaction(async (t) => {
            let { store, counter } = product.dataValues!;
            const prevLocation = purchase.dataValues!.location;
            const prevQuantity = purchase.dataValues!.quantity;

            if (prevLocation !== location) {
                if (prevLocation === "store") { store -= prevQuantity }
                if (prevLocation === "counter") { counter -= prevQuantity }

                if (store < 0) {
                    throw new Error("Purchase update will result in a negative value for items in store");
                }
                if (counter < 0) {
                    throw new Error("Purchase update will result in a negative value for items in counter");
                }
                if (location === "store") { store += quantity }
                if (location === "counter") { counter += quantity }
            }

            const [affectedPurchaseRow] = await Purchase.update({
                supplierId, productId, quantity, unitCost, unitPrice, location
            }, {
                where: { id } , transaction: t
            });

            const [affectedProductRow] = await Product.update({ store, counter }, {
                where: { id: productId }, transaction: t
            });

            if (affectedPurchaseRow === 1 && affectedProductRow === 1) {
                return res.status(200).json({ purchase });
            } else { throw new Error("Purchase not updated. Please try again") }

        });
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
}

async function destroy(req: Request, res: Response, next: NextFunction) {
    try {
        const {id} = req.params;
        const affectedRows = await Purchase.destroy({where: { id }});
        if (affectedRows !== id.length) {
            const notDeleted = id.length - affectedRows;
            return res.status(400).json({
                error: `${notDeleted > 1 ? `${notDeleted} purchases`: "Purchase"} not deleted. Please try again`
            });
        } else {
            return res.status(200).json({
                message: `${id.length > 1 ? `${id.length} purchases` : "Purchase"} deleted successfully`
            });
        }
    } catch (error) {
        console.log("\n\nError deleting purchase(s) ", error, "\n\n");
        next({ status: 500, error: "Db error deleting purchase(s)" });
    }
}


export {
    purchases, create, read, update, destroy
}
