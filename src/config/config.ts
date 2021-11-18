import dotenv from "dotenv";

dotenv.config();


export default {
  "development": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": process.env.DB_DIALECT,
  },
  "test": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.TEST_DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": process.env.DB_DIALECT,
    "logging": false,
  },
  "production": {
    "use_env_variable": process.env.DATABASE_URL,
    "dialect": "postgres",
    "dialectOptions": {
      "ssl": {
        rejectUnauthorized: false
      },
    },
    "logging": false,
  }
}

