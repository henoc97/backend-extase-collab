import { Router } from 'express';
import CrewController from '../controllers/crew.controller';

const router = Router();

// Définir les routes pour Crew
router.post('/', CrewController.createCrew);
router.get('/:id', CrewController.getCrewById);
router.put('/:id', CrewController.updateCrew);
router.delete('/:id', CrewController.deleteCrew);

export default router;
