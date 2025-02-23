import { Router } from "express";
import multer from "multer";
import { processCustomers, processCustomersQueue } from "../controllers/customer.controller";
import { validate } from "../../middlewares/validate.middleware";
import { processCustomerSchema } from "../../validators/customer.validator";

const router = Router();

const upload = multer({ dest: '/tmp/' });
/**
 * @openapi
 * /api/customers/process:
 *   post:
 *     summary: Processar .csv
 *     description: Processa um arquivo .csv, valida, transforma e salva os customers no banco de dados.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo CSV a ser processado.
 *     responses:
 *       200:
 *         description: Processamento concluído com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Processamento concluído. X linhas inseridas. X falhas."
 *       400:
 *         description: Dados inválidos.
 *       500:
 *         description: Erro interno do servidor.
 */
router.post('/process', upload.array('file'), validate(processCustomerSchema, true), processCustomers);

/**
 * @openapi
 * /api/customers/process_queue:
 *   post:
 *     summary: Processar .csv em fila
 *     description: Adiciona um processamento de um arquivo .csv em fila. Valida, transforma e salva os customers no banco de dados.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo CSV a ser processado.
 *     responses:
 *       200:
 *         description: Processamento solicitado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Processamento solicitado com sucesso."
 *       400:
 *         description: Dados inválidos.
 *       500:
 *         description: Erro interno do servidor.
 */
router.post('/process_queue', upload.array('file'), validate(processCustomerSchema, true), processCustomersQueue);

export default router;