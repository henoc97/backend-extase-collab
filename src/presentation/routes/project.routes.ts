import { Router } from 'express';
import ProjectController from '../controllers/project.controller';
import authenticateToken from '../../application/middlewares/auth';
import { Server } from 'socket.io';

const router = Router();

export const createProjectRoutes = (io: Server) => {
    const projectController = new ProjectController(io);
    router.use(authenticateToken)

    // Définir les routes pour Project
    router.post('/', projectController.createProject);
    router.get('/:id', projectController.getProjectById);
    router.put('/:id', projectController.updateProject);
    router.delete('/:id', projectController.deleteProject);
    router.get('/', projectController.getAllProjects); // Route pour obtenir tous les projets

    return router;
}

export default createProjectRoutes; 