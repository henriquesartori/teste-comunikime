import { Job } from "bullmq";
import fs from "fs";
import csv from "csv-parser";
import path from "path";
import winston from "winston";
import { ZodFormattedError } from "zod";
import { processCustomerCsvSchema } from "../validators/customer.validator";
import { Repository } from "typeorm";
import { Customer } from "../api/models/customer";

async function ProcessCustomersJob(job: Job, repo: Repository<Customer>) {

    if (!job.data)
        throw new Error('Job data inexistente.')

    const filepath = job.data;

    const dir = path.dirname(path.join(__dirname, '../../logs'));
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const logger = winston.createLogger({
        transports: [new winston.transports.File({
            filename: path.join(__dirname, `../../logs/process_customers_${new Date().getTime()}.log`)
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
                await repo.save(result.data)
                success++;
            } else
                errors.push({ row, error: result.error.format() })
        }

        const message = `Processamento concluído. ${success} linhas inseridas. ${errors.length} falhas.`;

        logger.info({
            message,
            errors,
        })

    } catch (error) {

        console.log(error)

        const message = 'Erro interno do servidor.'
        logger.error({
            message,
            error
        })
        throw new Error(message)

    } finally {
        fs.unlink(filepath, () => { });
    }

}

export { ProcessCustomersJob };