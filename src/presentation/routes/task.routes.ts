import { Router } from 'express';
import TaskController from '../controllers/task.controller';

const router = Router();

// Définir les routes pour Task
router.post('/', TaskController.createTask);
router.get('/:id', TaskController.getTaskById);
router.put('/:id', TaskController.updateTask);
router.delete('/:id', TaskController.deleteTask);
router.get('/project/:projectId', TaskController.getTasksByProjectId); // Route pour obtenir les tâches par projet
router.put('/:id/assign', TaskController.assignTask); // Route pour assigner une tâche

export default router; 