import express, { Express, json } from "express";
import dotenv from "dotenv";
import AppDataSource from "./config/database";
import routes from "./config/routes";

dotenv.config();

const app: Express = express();
const host: string = process.env.API_HOST || 'localhost';
const port: number = Number(process.env.API_PORT) || 3000;

app.use(json())

app.use("/", routes)

AppDataSource.initialize()
    .then(() => {
        app.listen(port, host, () => {
            console.log(`[server]: Servidor inicializado em http://${host}:${port}`)
            console.log(`[server]: Documentação disponível em http://${host}:${port}/docs`)
        })
    })
    .catch((err) => {
        console.error('[server]: Falha na conexão com o SQL Server: ', err)
    })

export default app;