import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { addJob } from "../../config/bullmq";
import { ProcessCustomerService } from "../services/customer.service";

export const processCustomers = async (req: Request, res: Response): Promise<void> => {
    const filepath = (req.files as Array<Express.Multer.File>)[0].path; // validado no middleware de validação

    try {
        const message = await ProcessCustomerService(filepath);
        res.json({ message })
    }
    catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Erro interno do servidor.',
            error
        })
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
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Erro interno do servidor.",
            error
        });
    }
}