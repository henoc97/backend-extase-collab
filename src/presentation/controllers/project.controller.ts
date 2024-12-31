import { Request, Response } from 'express';
import ProjectService from '../../application/services/project.service';
import { IProject } from '../../domain/entities/project.entity';

class ProjectController {
    private projectService = ProjectService;


    public async createProject(req: any, res: any): Promise<void> {
        try {
            const projectData: IProject = req.body;
            const project = await this.projectService.createProject(projectData);
            res.status(201).json(project);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json(`Error: ${error.message}`);
            } else {
                res.status(500).json('Unknown error');
            }
        }
    }

    public async getProjectById(req: Request, res: Response): Promise<void> {
        try {
            const projectId = req.params.id;
            const project = await this.projectService.getProjectById(projectId);
            if (!project) {
                res.status(404).json({ message: 'Project not found' });
            }
            res.status(200).json(project);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json(`Error: ${error.message}`);
            } else {
                res.status(500).json('Unknown error');
            }
        }
    }

    public async updateProject(req: Request, res: Response): Promise<void> {
        try {
            const projectId = req.params.id;
            const updateData = req.body;
            const updatedProject = await this.projectService.updateProject(projectId, updateData);
            if (!updatedProject) {
                res.status(404).json({ message: 'Project not found' });
            }
            res.status(200).json(updatedProject);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json(`Error: ${error.message}`);
            } else {
                res.status(500).json('Unknown error');
            }
        }
    }

    public async deleteProject(req: Request, res: Response): Promise<void> {
        try {
            const projectId = req.params.id;
            const deletedProject = await this.projectService.deleteProject(projectId);
            if (!deletedProject) {
                res.status(404).json({ message: 'Project not found' });
            }
            res.status(204).send();
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json(`Error: ${error.message}`);
            } else {
                res.status(500).json('Unknown error');
            }
        }
    }

    public async getAllProjects(req: Request, res: Response): Promise<void> {
        try {
            const projects = await this.projectService.getAllProjects();
            res.status(200).json(projects);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json(`Error: ${error.message}`);
            } else {
                res.status(500).json('Unknown error');
            }
        }
    }
}

export default new ProjectController(); 