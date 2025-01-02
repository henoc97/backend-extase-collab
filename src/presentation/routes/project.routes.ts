import { Router } from 'express';
import ProjectController from '../controllers/project.controller';
import authenticateToken from '../../application/middlewares/auth';

const router = Router();

router.use(authenticateToken)

// Définir les routes pour Project
router.post('/', ProjectController.createProject);
router.get('/:id', ProjectController.getProjectById);
router.put('/:id', ProjectController.updateProject);
router.delete('/:id', ProjectController.deleteProject);
router.get('/', ProjectController.getAllProjects); // Route pour obtenir tous les projets

export default router; 