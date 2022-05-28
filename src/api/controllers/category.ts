import { Request, Response, NextFunction } from "express";
import db from "../../models/index.js";

const {Category} = db;

async function categories(req: Request, res: Response, next: NextFunction) {
    try {
        const {filter, pagination} = res.locals;
        const {count, rows} = await Category.findAndCountAll({ ...filter });
        if (count) {
            pagination.count = count;
            return res.status(200).json({ categories: rows, pagination })
        } else {
            return res.status(400).json({
                error: "No categories found"
            });
        }
    } catch (error) {
        console.log("\n\nError getting categories:", error, "\n\n");
        next({ status: 500, error: "Db error getting categories" });
    }
}

async function create(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, description } = req.body;
        const category = await Category.create({ name, description });
        if (category.dataValues) {
            return res.status(201).json({ category });
        } else {
            return res.status(400).json({
                error: "Category not created. Please try again"
            });
        }
    } catch (error) {
        console.log("\n\nError creating category: ", error, "\n\n");
        next({ status: 500, error: "Db error creating category" });
    }
}

async function read(req: Request, res: Response, next: NextFunction) {
    try {
        const category = await Category.findByPk(req.params.id);
        if (category === null) {
            return res.status(400).json({
                error: "Category not found"
            });
        } else {
            return res.status(200).json({ category });
        }
    } catch (error) {
        console.log("\n\nError getting category: ", error, "\n\n");
        next({ status: 500, error: "Db error getting category" });
    }
}

async function update(req: Request, res: Response, next: NextFunction) {
    try {
        const { id, name, description } = req.body;
        const [affectedRows] = await Category.update( { name, description }, { where: { id } });
        if (affectedRows !== 1) {
            return res.status(400).json({
                error: "Category not updated. Please try again"
            });
        } else {
            const category = await Category.findByPk(id);
            return res.status(200).json({ category });
        }
    } catch (error) {
        console.log("\n\nError updating category: ", error, "\n\n");
        next({ status: 500, error: "Db error updating category" });
    }
}

async function destroy(req: Request, res: Response, next: NextFunction) {
    try {
        const {id} = req.params;
        const affectedRows = await Category.destroy({ where: {id} });
        if (affectedRows !== id.length) {
            const notDeleted = id.length - affectedRows;
            return res.status(400).json({
                error: `${notDeleted > 1 ? `${notDeleted} categories`: "Category"} not deleted. Please try again`
            });
        } else {
            return res.status(200).json({
                message: `${id.length > 1 ? `${id.length} categories` : "Category"} deleted successfully`
            });
        }
    } catch (error) {
        console.log("\n\nError deleting category ", error, "\n\n");
        next({ status: 500, error: "Db error deleting category" });
    }
}

export {
    categories, create, read, update, destroy
}