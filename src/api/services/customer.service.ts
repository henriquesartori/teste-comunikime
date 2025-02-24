import path from "path";
import fs from "fs";
import sql from "mssql";
import winston from "winston";
import { Customer } from "../models/customer";
import { processCustomerCsvSchema } from "../../validators/customer.validator";
import csvParser from "csv-parser";
import dotenv from "dotenv";

dotenv.config()

const config = {
    user: process.env.DB_USER || "",
    password: process.env.DB_PASS || "",
    server: process.env.DB_HOST || "",
    database: process.env.DB_NAME || "",
    options: { encrypt: true, trustServerCertificate: true }
}

export async function ProcessCustomerService(filepath: string) {

    const dir = path.dirname(path.join(__dirname, '../../../logs'));
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const logger = winston.createLogger({
        transports: [new winston.transports.File({
            filename: path.join(__dirname, `../../../logs/process_customers_${new Date().getTime()}.log`)
        })]
    })

    try {
        let success = 0;
        let failed = 0;

        const stream = fs.createReadStream(filepath).pipe(csvParser({ separator: ',' }))

        const customers: Partial<Customer>[] = [];

        for await (const row of stream) {
            const result = processCustomerCsvSchema.safeParse(row);
            if (result.success) {
                success++;
                customers.push(result.data)
            } else {
                failed++;
                logger.error({ row, error: result.error.format() })
            }
        }

        const pool = await sql.connect(config);
        const table = new sql.Table('customers');

        table.columns.add('uuid', sql.UniqueIdentifier, { nullable: false });
        table.columns.add('name', sql.NVarChar(255), { nullable: false });
        table.columns.add('birthDate', sql.DateTime2, { nullable: false });
        table.columns.add('gender', sql.NVarChar(50), { nullable: false });
        table.columns.add('email', sql.NVarChar(255), { nullable: false });
        table.columns.add('phone', sql.NVarChar(50), { nullable: false });
        table.columns.add('address', sql.NVarChar(255), { nullable: false });
        table.columns.add('city', sql.NVarChar(100), { nullable: false });
        table.columns.add('state', sql.NVarChar(50), { nullable: false });

        customers.forEach(c => table.rows.add(
            c.uuid,
            c.name,
            c.birthDate,
            c.gender,
            c.email,
            c.phone,
            c.address,
            c.city,
            c.state
        ))
        await pool.request().bulk(table);

        const message = `Processamento concluído. ${success} linhas inseridas. ${failed} falhas.`;
        logger.info({ message })
        return message;

    } catch (error) {

        const message = "Erro interno do servidor.";
        logger.error({ message, error })
        throw new Error(message);

    } finally {
        fs.unlink(filepath, () => { });
    }

}