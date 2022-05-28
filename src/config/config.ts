import { Dialect, Sequelize } from "sequelize";
import "dotenv/config";

let sequelize: Sequelize;
const env = process.env.NODE_ENV as "development" | "test" | "production";

if (env === "production") {
  const useEnvVariable = process.env.DATABASE_URL as string;
  const productionConfig = {
    "dialect": "postgres" as Dialect,
    "dialectOptions": {
      "ssl": {
        rejectUnauthorized: false
      },
    },
    "logging": false,
  }
  sequelize = new Sequelize(useEnvVariable, productionConfig);
} else {
  let dbName = "";
  const dbUser = process.env.DB_USER as string;
  const dbHost = process.env.DB_HOST as string;
  const dbPassword = process.env.DB_PASSWORD as string;
  const dbDialect = process.env.DB_DIALECT as Dialect;

  if (env === "development") { dbName = process.env.DB_NAME as string; }
  if (env === "test") { dbName = process.env.TEST_DB_NAME as string; }

  sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    dialect: dbDialect,
  });
}

export default sequelize;
