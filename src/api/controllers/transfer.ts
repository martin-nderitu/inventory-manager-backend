import { Request, Response, NextFunction } from "express";
import db from "../../models/index.js";

const {sequelize, Transfer, Product} = db;

async function transfers(req: Request, res: Response, next: NextFunction) {
    try {
        const {filter, pagination} = res.locals;
        const {count, rows} = await Transfer.findAndCountAll({
            distinct: true,
            include: {
                model: Product,
                as: "product"
            },
            ...filter,
        });

        if (count) {
            pagination.count = count;
            return res.status(200).json({ transfers: rows, pagination });
        } else {
            return res.status(400).json({
                error: "No transfers found"
            });
        }
    } catch (error) {
        console.log("\n\nError getting transfers: ", error, "\n\n");
        next({ status: 500, error: "Db error getting transfers" });
    }
}

async function create(req: Request, res: Response) {
    try {
        const { productId, quantity, source, destination } = req.body;
        const product = await Product.findByPk(productId);
        if (product === null) {
            return res.status(400).json({
                error: "Product not found"
            });
        }
        let {store, counter} = product.dataValues!;

        switch(source) {
            case "counter":
                if (quantity <= counter) {
                    counter -= quantity;
                    store += quantity;
                } else {
                    return res.status(400).json({
                        error: `Only ${counter} items are left in ${source}`
                    });
                }
                break;

            case "store":
                if (quantity <= store) {
                    store -= quantity;
                    counter += quantity;
                } else {
                    return res.status(400).json({
                        error: `Only ${store} items are left in ${source}`
                    });
                }
                break;

            default:
                return res.status(400).json({
                    error: `Source must be either 'store' or 'counter'`
                });
        }

        return await sequelize.transaction(async (t) => {
            const [affectedProductRows] = await Product.update({ counter, store }, {
                where: { id: productId }, transaction: t
            });

            const transfer = await Transfer.create({ productId, quantity, source, destination },
                { transaction: t});

            if (affectedProductRows === 1 && transfer.dataValues) {
                return res.status(201).json({ transfer });
            } else { throw new Error("Transfer not created. Please try again") }

        });
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
}

async function read(req: Request, res: Response, next: NextFunction) {
    try {
        const transfer = await Transfer.findByPk(req.params.id);
        if (transfer === null) {
            return res.status(400).json({
                error: "Transfer not found"
            });
        } else {
            return res.status(200).json({ transfer });
        }
    } catch (error) {
        console.log("\n\nError getting transfer: ", error, "\n\n");
        next({ status: 500, error: "Db error getting transfer" });
    }
}

async function destroy(req: Request, res: Response, next: NextFunction) {
    try {
        const {id} = req.params;
        const affectedRows = await Transfer.destroy({where: {id}});
        if (affectedRows !== id.length) {
            const notDeleted = id.length - affectedRows;
            return res.status(400).json({
                error: `${notDeleted > 1 ? `${notDeleted} transfers`: "Transfer"} not deleted. Please try again`
            });
        } else {
            return res.status(200).json({
                message: `${id.length > 1 ? `${id.length} transfers` : "Transfer"} deleted successfully`
            });
        }
    } catch (error) {
        console.log("\n\nError deleting transfer(s) ", error, "\n\n");
        next({ status: 500, error: "Db error deleting transfer(s)" });
    }
}

export {
    transfers, create, read, destroy
}
