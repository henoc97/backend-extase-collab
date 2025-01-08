import { Router } from 'express';
import { Server } from 'socket.io';
import authenticateToken from '../../application/middlewares/auth';
import { MergeCallsController } from '../controllers/merge-calls.controller';

const router = Router();

export const createMergeReqRoutes = (io: Server) => {
    const mergeReqController = new MergeCallsController(io);
    router.use(authenticateToken)

    // Définir les routes pour MergeReq
    router.get('/dashboard-request', (req, res) => mergeReqController.dashboadRequests(req, res));

    return router;
};

export default createMergeReqRoutes; 