import { DataSource } from "typeorm";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const AppDataSource: DataSource = new DataSource({
    type: "mssql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [path.join(__dirname, "../api/models/**/*.{ts,js}")],
    migrations: [path.join(__dirname, "../migrations/**/*.{ts,js}")],
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
    logging: false
});

export default AppDataSource