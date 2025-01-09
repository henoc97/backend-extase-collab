import { Router } from 'express';
import CrewController from '../controllers/crew.controller';
import authenticateToken from '../../application/middlewares/auth';
import { Server } from 'socket.io';

const router = Router();

export const createCrewRoutes = (io: Server) => {
    const crewController = new CrewController(io);
    router.use(authenticateToken)

    // Définir les routes pour Crew
    router.post('/', crewController.createCrew);
    router.get('/:id', crewController.getCrewById);
    router.put('/:id', crewController.updateCrew);
    router.delete('/:id', crewController.deleteCrew);

    return router;
}

export default createCrewRoutes;