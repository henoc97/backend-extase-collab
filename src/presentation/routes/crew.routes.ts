import { Router } from 'express';
import CrewController from '../controllers/crew.controller';
import authenticateToken from '../../application/middlewares/auth';

const router = Router();

router.use(authenticateToken)

// Définir les routes pour Crew
router.post('/', CrewController.createCrew);
router.get('/:id', CrewController.getCrewById);
router.put('/:id', CrewController.updateCrew);
router.delete('/:id', CrewController.deleteCrew);

export default router;
