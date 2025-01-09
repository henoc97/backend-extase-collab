import { Router } from 'express';
import authenticateToken from '../../application/middlewares/auth';
import taskController from '../controllers/task.controller';

const router = Router();
router.use(authenticateToken)

// Définir les routes pour Task
router.post('/', (req, res) => taskController.createTask(req, res));
router.get('/:id', taskController.getTaskById);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.get('/project/:projectId', taskController.getTasksByProjectId); // Route pour obtenir les tâches par projet
router.put('/:id/assign', taskController.assignTask); // Route pour assigner une tâche


export default router; 