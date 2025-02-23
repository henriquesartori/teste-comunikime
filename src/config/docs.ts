import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API - Teste Comunikime',
            version: '1.0.0'
        },
    },
    apis: [path.join(__dirname, '../api/routes/**/*.{ts,js}')]
}

export const specs = swaggerJsdoc(options)