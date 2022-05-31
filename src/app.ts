import { default as express } from "express";
import session from "express-session";
import { default as cookieParser } from "cookie-parser";
import helmet from "helmet";
import { default as logger } from "morgan";
import url from "url";
import path from "path";
import * as http from "http";
import dotenv from "dotenv";
import { Request, Response } from "express";
import {router} from "./api/routes/index.js";
import { normalizePort, onError, onListening, errorHandler, handle404 } from "./appHelper.js";
import db from "./models/index.js";


export const app = express();
export const port = normalizePort(process.env.PORT || "5000");
app.set("port", port);

export const server = http.createServer(app);
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
server.on("error", onError);
server.on("listening", onListening);

export const __filename = url.fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

dotenv.config();

try {
    await db.sequelize.authenticate();
    console.log("Connection established");
} catch(error) {
    console.error("Unable to connect to database:", error);
}

try {
    await db.sequelize.sync();
    console.log("All models were synchronized successfully.");
} catch (error) {
    console.error("Unable to synchronize models:", error);
}


// @ts-ignore
app.use(logger("dev"));
// @ts-ignore
app.use(helmet());
// @ts-ignore
app.use(express.json());
// @ts-ignore
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: "veryveryimportantsecret",
    name: "veryverysecretname",
    cookie: {
        httpOnly: true,
        sameSite: true,
        maxAge: 24 * 60 * 60 * 1000
    },
    resave: false,
    saveUninitialized: true
}));
app.use("/static", express.static(path.join(__dirname, "..", "build", "static")));
app.use("/api/v1", router);

// serve react build
app.get("*", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

app.use(handle404);
app.use(errorHandler);
