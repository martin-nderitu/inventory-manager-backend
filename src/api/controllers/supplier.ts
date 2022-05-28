import { Request, Response, NextFunction } from "express";
import db from "../../models/index.js";

const {Supplier} = db;

async function suppliers(req: Request, res: Response, next: NextFunction) {
    try {
        const { filter, pagination } = res.locals;
        const {count, rows} = await Supplier.findAndCountAll({ ...filter });

        if (count) {
            pagination.count = count;
            return res.status(200).json({ suppliers: rows, pagination });
        } else {
            return res.status(400).json({
                error: "No suppliers found"
            });
        }
    } catch (error) {
        console.log("\n\nError getting suppliers: ", error, "\n\n");
        next({ status: 500, error: "Db error getting suppliers" });
    }
}

async function create(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, phone, email } = req.body;
        const supplier = await Supplier.create({ name, phone, email });
        if (supplier.dataValues) {
            return res.status(201).json({ supplier });
        } else {
            return res.status(400).json({
                error: "Supplier not created. Please try again"
            });
        }
    } catch (error) {
        console.log("\n\nError creating supplier: ", error, "\n\n");
        next({ status: 500, error: "Db error creating supplier" });
    }
}

async function read(req: Request, res: Response, next: NextFunction) {
    try {
        const supplier = await Supplier.findByPk(req.params.id);
        if (supplier === null) {
            return res.status(400).json({
                error: "Supplier not found"
            });
        } else {
            return res.status(200).json({ supplier });
        }
    } catch (error) {
        console.log("\n\nError getting supplier: ", error, "\n\n");
        next({ status: 500, error: "Db error getting supplier" });
    }
}

async function update(req: Request, res: Response, next: NextFunction) {
    try {
        const { id, name, phone, email } = req.body;
        let [affectedRows] = await Supplier.update({ name, phone, email }, { where: { id } } );

        if (affectedRows !== 1) {
            return res.status(400).json({
                error: "Supplier not updated. Please try again"
            });
        } else {
            const supplier = await Supplier.findByPk(id);
            return res.status(200).json({ supplier });
        }
    } catch (error) {
        console.log("\n\nError updating supplier: ", error, "\n\n");
        next({ status: 500, error: "Db error updating supplier" });
    }
}

async function destroy(req: Request, res: Response, next: NextFunction) {
    try {
        const {id} = req.params;
        const affectedRows = await Supplier.destroy({where: {id}});
        if (affectedRows !== id.length) {
            const notDeleted = id.length - affectedRows;
            return res.status(400).json({
                error: `${notDeleted > 1 ? `${notDeleted} suppliers`: "Supplier"} not deleted. Please try again`
            });
        } else {
            return res.status(200).json({
                message: `${id.length > 1 ? `${id.length} suppliers` : "Supplier"} deleted successfully`
            });
        }
    } catch (error) {
        console.log("\n\nError deleting supplier(s) ", error, "\n\n");
        next({ status: 500, error: "Db error deleting supplier(s)" });
    }
}

export {
    suppliers, create, read, update, destroy
}
