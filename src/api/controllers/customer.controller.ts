import { Request, Response } from "express";
import AppDataSource from "../../config/database"
import { Customer } from "../models/customer"
import { StatusCodes } from "http-status-codes";
import fs from "fs";
import csv from "csv-parser";
import { processCustomerCsvSchema } from "../../validators/customer.validator";
import { ZodFormattedError } from "zod";
import winston from "winston";
import path from "path";
import { addJob } from "../../config/bullmq";

export const processCustomers = async (req: Request, res: Response): Promise<void> => {
    const repository = AppDataSource.getRepository(Customer)
    const filepath = (req.files as Array<Express.Multer.File>)[0].path; // validado no middleware de validação

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
        const errors: {
            row: unknown
            error: ZodFormattedError<unknown>
        }[] = [];

        const stream = fs.createReadStream(filepath)
            .pipe(csv({ separator: ',' }))

        for await (const row of stream) {
            const result = processCustomerCsvSchema.safeParse(row);

            if (result.success) {
                await repository.save(result.data)
                success++;
            } else
                errors.push({ row, error: result.error.format() })
        }

        const message = `Processamento concluído. ${success} linhas inseridas. ${errors.length} falhas.`;

        logger.info({
            message,
            errors,
        })

        res.json({
            message
        })

    } catch (error) {
        const message = "Erro interno do servidor.";
        logger.error({
            message,
            error
        })
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message,
            error
        });

    } finally {
        fs.unlink(filepath, () => { });
    }
}

export const processCustomersQueue = async (req: Request, res: Response): Promise<void> => {
    const filepath = (req.files as Array<Express.Multer.File>)[0].path; // validado no middleware de validação
    try {
        await addJob('process_customers_job', filepath)
        res.json({
            message: 'Processamento solicitado com sucesso.'
        })
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Erro interno do servidor.",
            error
        });
    }
}