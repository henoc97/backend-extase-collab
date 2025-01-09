import { Router } from 'express';
import authenticateToken from '../../application/middlewares/auth';
import projectController from '../controllers/project.controller';

const router = Router();

router.use(authenticateToken)

// Définir les routes pour Project
router.post('/', projectController.createProject);
router.get('/:id', projectController.getProjectById);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);
router.get('/', projectController.getAllProjects); // Route pour obtenir tous les projets

export default router; 