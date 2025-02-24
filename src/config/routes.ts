import { Response, Router } from "express";
import customerRoutes from "../api/routes/customer.routes";
import { specs } from "./docs";
import redoc from "redoc-express";
import { healthCheck } from "../api/controllers/healthcheck.controller";

const router = Router();

router.get('/', healthCheck);
router.get('/docs', redoc({ title: 'API - Teste Comunikime', specUrl: '/docs/swagger.json' }))
router.get('/docs/swagger.json', (_, res: Response) => { res.send(specs); })

// 

router.use('/api/customers', customerRoutes);

// 

export default router;