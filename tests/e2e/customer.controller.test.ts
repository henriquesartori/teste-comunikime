import request from 'supertest';
import app from '../../src';
import AppDataSource from '../../src/config/database';
import path from 'path';
import { Customer } from '../../src/api/models/customer';
import { StatusCodes } from 'http-status-codes';

describe('Customer Controller', () => {

    beforeAll(async () => {
        jest.spyOn(console, 'log').mockImplementation(() => { }) // para prevenir os logs durante os testes

        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
    })

    afterAll(async () => {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    });

    it('deve validar o arquivo csv e salvar as linhas no banco', async () => {

        const response = await request(app)
            .post('/api/customers/process')
            .attach('file', path.join(__dirname, '../mocks/data.csv'))

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: expect.any(String)
        })

        const repo = AppDataSource.getRepository(Customer);
        const customer = await repo.findOneBy({ uuid: "00000000-0000-0000-0000-000000000000" });

        expect(customer).toBeInstanceOf(Customer);

        if (customer)
            await repo.remove(customer)

    });

    it('deve falhar ao nao receber nenhum arquivo', async () => {

        const response = await request(app)
            .post('/api/customers/process')

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it('deve falhar ao receber múltiplos arquivos', async () => {

        const response = await request(app)
            .post('/api/customers/process')
            .attach('file', path.join(__dirname, '../mocks/data.csv'))
            .attach('file', path.join(__dirname, '../mocks/data.csv'))

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it('deve falhar ao receber um arquivo que náo é .csv', async () => {

        const response = await request(app)
            .post('/api/customers/process')
            .attach('file', path.join(__dirname, '../mocks/data.txt'))

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

});