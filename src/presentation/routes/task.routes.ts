import { Router } from 'express';
import TaskController from '../controllers/task.controller';
import { Server } from 'socket.io';
import authenticateToken from '../../application/middlewares/auth';

const router = Router();

export const createTaskRoutes = (io: Server) => {
    const taskController = new TaskController(io);
    router.use(authenticateToken)

    // Définir les routes pour Task
    router.post('/', (req, res) => taskController.createTask(req, res));
    router.get('/:id', taskController.getTaskById);
    router.put('/:id', taskController.updateTask);
    router.delete('/:id', taskController.deleteTask);
    router.get('/project/:projectId', taskController.getTasksByProjectId); // Route pour obtenir les tâches par projet
    router.put('/:id/assign', taskController.assignTask); // Route pour assigner une tâche

    return router;
};

export default createTaskRoutes; 