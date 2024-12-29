import { Request, Response } from 'express';
import ProjectService from '../../application/services/project.service';
import { IProject } from '../../domain/entities/project';

class ProjectController {
    private projectService = ProjectService;

    public async createProject(req: Request, res: Response): Promise<Response> {
        try {
            const projectData: IProject = req.body;
            const project = await this.projectService.createProject(projectData);
            return res.status(201).json(project);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    public async getProjectById(req: Request, res: Response): Promise<Response> {
        try {
            const projectId = req.params.id;
            const project = await this.projectService.getProjectById(projectId);
            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }
            return res.json(project);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    public async updateProject(req: Request, res: Response): Promise<Response> {
        try {
            const projectId = req.params.id;
            const updateData = req.body;
            const updatedProject = await this.projectService.updateProject(projectId, updateData);
            if (!updatedProject) {
                return res.status(404).json({ message: 'Project not found' });
            }
            return res.json(updatedProject);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    public async deleteProject(req: Request, res: Response): Promise<Response> {
        try {
            const projectId = req.params.id;
            const deletedProject = await this.projectService.deleteProject(projectId);
            if (!deletedProject) {
                return res.status(404).json({ message: 'Project not found' });
            }
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    public async getAllProjects(req: Request, res: Response): Promise<Response> {
        try {
            const projects = await this.projectService.getAllProjects();
            return res.json(projects);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

export default new ProjectController(); 