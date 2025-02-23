import { Request, Response } from "express";
import { z } from "zod";
import { validate } from "../../src/middlewares/validate.middleware";
import { StatusCodes } from "http-status-codes";

const mock = z.object({
    name: z.string(),
    age: z.number().int()
})

describe('Validate Middleware', () => {

    it('deve chamar next() caso passe na validação', () => {

        const req = {
            body: {
                name: 'Henrique',
                age: 22
            }
        } as Request;

        const res = {} as Response;
        const next = jest.fn();

        const middleware = validate(mock);
        middleware(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    it('deve retornar um erro 400 e os erros quando a requisição for inválida', () => {

        const req = {
            body: {
                name: 123,
                age: 'Henrique'
            }
        } as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        const next = jest.fn();

        const middleware = validate(mock);
        middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Dados inválidos.',
            error: expect.any(Object)
        });
    });

    it('deve retornar um erro 500 quando ocorrer um erro desconhecido', () => {

        const req = {
            body: {
                name: 'Henrique',
                age: 22
            }
        } as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        const next = jest.fn();

        jest.spyOn(mock, 'parse').mockImplementation(() => {
            throw new Error('Erro desconhecido.')
        })

        const middleware = validate(mock);
        middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Erro interno do servidor.',
            error: expect.any(Error)
        });
    });

});