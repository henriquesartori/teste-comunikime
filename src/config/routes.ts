import { Response, Router } from "express";
import customerRoutes from "../api/routes/customer.routes";
import { specs } from "./docs";
import redoc from "redoc-express";

const router = Router();

router.get('/', (_, res: Response) => { res.json({ status: 'OK' }) })
router.get('/docs', redoc({ title: 'API - Teste Comunikime', specUrl: '/docs/swagger.json' }))
router.get('/docs/swagger.json', (_, res: Response) => { res.send(specs); })

// 

router.use('/api/customers', customerRoutes);

// 

export default router;