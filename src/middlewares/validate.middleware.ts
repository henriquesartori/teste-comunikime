import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { z, ZodError } from "zod";

export function validate<T extends z.ZodRawShape>(schema: z.ZodObject<T>, validateWholeRequest: boolean = false) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(validateWholeRequest ? req : req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: 'Dados inválidos.',
                    error: error.format()
                })
            }
            else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: "Erro interno do servidor.",
                    error
                })
            }
        }
    }
}