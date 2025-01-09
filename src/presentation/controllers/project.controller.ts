import { Request, Response } from 'express';
import ProjectService from '../../application/services/project.service';
import { IProject } from '../../domain/entities/project.entity';
import { Server } from 'socket.io';

class ProjectController {
    private projectService: ProjectService;

    public constructor(io: Server) {
        this.projectService = ProjectService.getInstance(io);
    }

    public createProject = async (req: any, res: any): Promise<void> => {
        try {
            const projectData: IProject = req.body;
            projectData.creatorId = req.user.id;
            console.log("Project received: " + JSON.stringify(projectData));
            const project = await this.projectService.createProject(projectData);
            console.log("Project created: " + JSON.stringify(project));
            res.status(201).json(project);
        } catch (error) {
            if (error instanceof Error) {
                console.log("error: ", error);
                res.status(500).json(`Error: ${error.message}`);
            } else {
                res.status(500).json('Unknown error');
            }
        }
    }

    public getProjectById = async (req: Request, res: Response): Promise<void> => {
        try {
            const projectId = req.params.id;
            console.log("projectId: ", projectId);
            const project = await this.projectService.getProjectById(projectId);
            if (!project) {
                res.status(404).json({ message: 'Project not found' });
            }
            console.log("project got: ", project);
            res.status(200).json(project);
        } catch (error) {
            if (error instanceof Error) {
                console.log("error: ", error);
                res.status(500).json(`Error: ${error.message}`);
            } else {
                res.status(500).json('Unknown error');
            }
        }
    }

    public updateProject = async (req: Request, res: Response): Promise<void> => {
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

    public deleteProject = async (req: Request, res: Response): Promise<void> => {
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

    public getAllProjects = async (req: Request, res: Response): Promise<void> => {
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

export default ProjectController; 