import { Request, Response, NextFunction } from "express";
import db from "../../models/index.js";

const {Product, Category} = db;

async function products(req: Request, res: Response, next: NextFunction) {
    try {
        const { filter, pagination} = res.locals;
        const {count, rows} = await Product.findAndCountAll({
            distinct: true,
            include: {
                model: Category,
                as: "category"
            },
            ...filter,
        });

        if (count) {
            pagination.count = count;
            return res.status(200).json({ products: rows, pagination });
        } else {
            return res.status(400).json({
                error: "No products found"
            });
        }
    } catch (error) {
        console.log("\n\nError getting products: ", error, "\n\n");
        next({ status: 500, error: "Db error getting products" });
    }
}

async function create(req: Request, res: Response, next: NextFunction) {
    try {
        const { categoryId, name, unitCost, unitPrice, store, counter, description } = req.body;
        const product = await Product.create({
            categoryId, name, unitCost, unitPrice, store, counter, description
        });
        if (product.dataValues) {
            return res.status(201).json({ product });
        } else {
            return res.status(400).json({
                error: "Product not created. Please try again"
            });
        }
    } catch (error) {
        console.log("\n\nError creating product: ", error, "\n\n");
        next({ status: 500, error: "Db error creating product" });
    }
}

async function read(req: Request, res: Response, next: NextFunction) {
    try {
        const product = await Product.findByPk(req.params.id);
        if (product === null) {
            return res.status(400).json({
                error: "Product not found"
            });
        } else {
            return res.status(200).json({ product });
        }
    } catch (error) {
        console.log("\n\nError getting product: ", error, "\n\n");
        next({ status: 500, error: "Db error getting product" });
    }
}

async function update(req: Request, res: Response, next: NextFunction) {
    try {
        const { id, categoryId, name, unitCost, unitPrice, store, counter, description } = req.body;
        const [affectedRows] = await Product.update({
            categoryId, name, unitCost, unitPrice, store, counter, description
        }, { where: { id } });

        if (affectedRows !== 1) {
            return res.status(400).json({
                error: "Product not updated. Please try again"
            });
        } else {
            const product = await Product.findByPk(id);
            return res.status(200).json({ product });
        }
    } catch (error) {
        console.log("\n\nError updating product: ", error, "\n\n");
        next({ status: 500, error: "Db error updating product" });
    }
}

async function destroy(req: Request, res: Response, next: NextFunction) {
    try {
        const {id} = req.params;
        const affectedRows = await Product.destroy({ where: { id } });
        if (affectedRows !== id.length) {
            const notDeleted = id.length - affectedRows;
            return res.status(400).json({
                error: `${notDeleted > 1 ? `${notDeleted} products`: "Product"} not deleted. Please try again`
            });
        } else {
            return res.status(200).json({
                message: `${id.length > 1 ? `${id.length} products` : "Product"} deleted successfully`
            });
        }
    } catch (error) {
        console.log("\n\nError deleting product(s) ", error, "\n\n");
        next({ status: 500, error: "Db error deleting product(s)" });
    }
}

export {
    products, create, read, update, destroy
}