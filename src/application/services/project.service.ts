import mongoose from "mongoose";
import ProjectModel, { IProject } from "../../domain/entities/project.entity";
import crewService from "./crew.service";
import CrewService from "./crew.service";
import { Server } from 'socket.io';

class ProjectService {
    private static instance: ProjectService;

    private constructor() { }

    public static getInstance(): ProjectService {
        if (!ProjectService.instance) {
            ProjectService.instance = new ProjectService();
        }
        return ProjectService.instance;
    }

    public async createProject(projectData: any): Promise<IProject> {
        const project = new ProjectModel(projectData);
        return await project.save();
    }

    public async getProjectById(projectId: string): Promise<any> {
        const projectFound: any = await ProjectModel.findById(projectId)
            .populate({
                path: 'tasks',
                model: 'Task',
            }).exec();

        // Convert to plain TypeScript object
        const project = projectFound.toObject();

        const taskIds = project?.tasks!.map((task: any) => task._id);
        console.log("taskIds result from getProjectByID: ", taskIds);
        const teams = await crewService.getCrewsByTaskIds(taskIds);
        project.teams = teams;
        console.log("teams result from getProjectByID: ", teams);
        console.log("project result from getProjectByID: ", project);
        return project;
    }

    public async updateProject(projectId: string, updateData: any): Promise<IProject | null> {
        return await ProjectModel.findByIdAndUpdate(projectId, updateData, { new: true });
    }

    public async deleteProject(projectId: string): Promise<IProject | null> {
        return await ProjectModel.findByIdAndDelete(projectId);
    }

    public async getAllProjects(): Promise<IProject[]> {
        return await ProjectModel.find();
    }

    // Nouvelle méthode pour compter les projets
    public async getProjectByCreatorId(creatorId: string): Promise<string[]> {
        const projects = await ProjectModel.find({ creatorId: creatorId });
        const projectIds = projects.map(project => project._id!.toString());
        return projectIds;
    }

    // Nouvelle méthode pour compter les projets
    public async getProjectCountByCreatorId(creatorId: string): Promise<number> {
        return await ProjectModel.find({ creatorId: creatorId }).countDocuments();
    }

    public async getRecentProjects(creatorId: string): Promise<IProject[]> {
        const recentProjects = await ProjectModel.find({ creatorId: creatorId })
            .sort({ createdAt: -1 }) // Trie par date de création (du plus récent au plus ancien)
            .limit(5);
        return recentProjects;
    }
}

export default ProjectService.getInstance(); 