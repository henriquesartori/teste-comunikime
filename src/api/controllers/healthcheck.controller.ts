import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import AppDataSource from "../../config/database";
import { Customer } from "../models/customer";

export const healthCheck = async (_: Request, res: Response): Promise<void> => {

    try {
        const repo = AppDataSource.getRepository(Customer);
        const customers = await repo.count();

        res.json({
            status: 'OK',
            customers
        })
    }
    catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Erro interno do servidor.',
            error
        })
    }

}