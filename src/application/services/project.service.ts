import ProjectModel, { IProject } from "../../domain/entities/project";

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

    public async getProjectById(projectId: string): Promise<IProject | null> {
        return await ProjectModel.findById(projectId);
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
}

export default ProjectService.getInstance(); 