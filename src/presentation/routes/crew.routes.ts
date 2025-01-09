import { Router } from 'express';
import authenticateToken from '../../application/middlewares/auth';
import crewController from '../controllers/crew.controller';

const router = Router();

router.use(authenticateToken)

// Définir les routes pour Crew
router.post('/', crewController.createCrew);
router.get('/:id', crewController.getCrewById);
router.put('/:id', crewController.updateCrew);
router.delete('/:id', crewController.deleteCrew);


export default router;