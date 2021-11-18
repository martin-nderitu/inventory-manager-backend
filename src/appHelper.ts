import { Request, Response, NextFunction } from "express";
import { default as DEBUG } from "debug";
import { default as createError } from "http-errors";
import dotenv from "dotenv";

import { server, port } from "./app.js";

const debug = DEBUG("inventory_manager:debug");
const dbgerror = DEBUG("inventory_manager:error");
dotenv.config();


function normalizePort(val: number | string): number | string | boolean {
    const port: number = (typeof val === "string") ? parseInt(val, 10): val;

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

function onError(error: NodeJS.ErrnoException) {
    dbgerror(error);
    if (error.syscall !== "listen") {
        throw error;
    }

    const bind = typeof port === "string"
        ? "Pipe " + port
        : "Port " + port;

    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    const addr = server.address();
    let bind = null;
    if (addr !== null) {
        bind = typeof addr === "string"
            ? "pipe " + addr
            : "port " + addr.port
    } else {
        throw new Error("The host address is null")
    }
    debug(`Listening on ${bind}`);
}

function handle404(req: Request, res: Response, next: NextFunction) {
    next(createError(404));
}

function errorHandler(
    err: { status?: number; error: string }, req: Request, res: Response, next: NextFunction) {
    console.log("\n\nERR = ", err, "\n\n");
    let error = process.env.NODE_ENV === "development" ? err.error : "An error occurred";
    const status = err.status || 500;
    return res.status(status).json({ error });
}


export {
    normalizePort, onError, onListening, handle404, errorHandler
}

