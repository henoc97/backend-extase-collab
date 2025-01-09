import { Router } from 'express';
import authenticateToken from '../../application/middlewares/auth';
import mergeCallsController from '../controllers/merge-calls.controller';

const router = Router();

router.use(authenticateToken)

// Définir les routes pour MergeReq
router.get('/dashboard-request', mergeCallsController.dashboadRequests);

export default router; 