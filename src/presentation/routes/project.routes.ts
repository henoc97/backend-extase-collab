import { Router } from 'express';
import ProjectController from '../controllers/project.controller';

const router = Router();

// Définir les routes pour Project
router.post('/', ProjectController.createProject);
router.get('/:id', ProjectController.getProjectById);
router.put('/:id', ProjectController.updateProject);
router.delete('/:id', ProjectController.deleteProject);
router.get('/', ProjectController.getAllProjects); // Route pour obtenir tous les projets

export default router; 