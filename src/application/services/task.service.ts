import TaskModel, { Task } from "../../domain/entities/task.entity";
import NotificationService from './notification.service';
import UserObserverService from './user.observer.service';
import TaskFactory from '../factories/task.factory';
import { Server } from 'socket.io';
import { SortStrategy } from '../sorting/sort.strategy';
import crewService from "./crew.service";
import serService from "./user.service";
import Project from "../../domain/entities/project.entity";
import projectService from "./project.service";
import CrewService from "./crew.service";
import ProjectService from "./project.service";

class TaskService {
    private static instance: TaskService;
    private userObserverService: UserObserverService;
    private crewService: CrewService;
    private projectService: ProjectService;

    private constructor(io: Server) {
        this.userObserverService = UserObserverService.getInstance(io);
        this.crewService = CrewService.getInstance(io);
        this.projectService = ProjectService.getInstance(io);
    }

    public static getInstance(io: Server): TaskService {
        if (!TaskService.instance) {
            TaskService.instance = new TaskService(io);
        }
        return TaskService.instance;
    }

    // Créer une tâche en utilisant la TaskFactory
    public async createTask(taskData: any): Promise<Task> {
        console.log('task received in service: ', taskData);  // Vérifiez que c'est bien une instance de Task
        // const task = TaskFactory.createTask(taskData);
        // console.log('task in service from TaskFactory: ', task);  // Vérifiez que c'est bien une instance de Task
        // console.log('typeof task.subscribeAllObservers: ', typeof task.subscribeAllObservers); // Vérifiez que la méthode existe
        // if (task && task.subscribeAllObservers) {
        //     await task.subscribeAllObservers();  // Appel de la méthode
        // } else {
        //     console.error('La méthode subscribeAllObservers est introuvable');
        // }
        // this.userObserverService.notify(task.observers, 'task created', `new task created for ecommerce project: ${task.title}`);
        const taskModel = new TaskModel(taskData);
        const result = await taskModel.save();

        // Mettre à jour le projet pour inclure cette tâche
        await Project.updateOne(
            { _id: taskData.project },
            { $push: { tasks: taskModel._id } }
        );

        return result;
    }


    // Obtenir une tâche par ID
    public async getTaskById(taskId: string): Promise<Task | null> {
        const task = await TaskModel.findById(taskId);
        task!.subscribeAllObservers();
        return task;
    }

    // Mettre à jour une tâche
    public async updateTask(taskId: string, updateData: any): Promise<Task | null> {
        const updatedTask = await TaskModel.findByIdAndUpdate(taskId, updateData, { new: true });

        updatedTask!.subscribeAllObservers();
        this.userObserverService.notify(updatedTask!.observers, 'task updated', `new task updated for ecommerce project: ${updatedTask!.title}`);
        return updatedTask;
    }

    // Supprimer une tâche
    public async deleteTask(taskId: string): Promise<Task | null> {
        const taskDeleted = await TaskModel.findByIdAndDelete(taskId);
        return taskDeleted;
    }

    // Obtenir toutes les tâches d'un projet
    public async getTasksByProjectId(projectId: string): Promise<Task[]> {
        const tasks = await TaskModel.find({ projectId });
        tasks.forEach(task => {
            task.subscribeAllObservers(); // Abonne les observateurs pour chaque tâche
        });
        return tasks; // Assurez-vous de retourner les tâches
    }

    // Assigner une tâche à un membre de l'équipe
    public async assignTask(taskId: string, assignedTo: string): Promise<Task | null> {
        const updatedTask = await TaskModel.findByIdAndUpdate(taskId, { assignedTo }, { new: true });

        updatedTask!.subscribeAllObservers();
        this.userObserverService.notify(updatedTask!.observers, 'task updated', `new task updated for ecommerce project: ${updatedTask!.title}`);

        return updatedTask;
    }

    // Obtenir les utilisateurs assignés à une tâche par ID
    public async getAssignedById(taskId: string): Promise<string> {
        const task = await TaskModel.findById(taskId);
        return task ? task.assignedTo!.toString() : ''; // Retourne les utilisateurs assignés ou un tableau vide si la tâche n'existe pas
    }

    // Trier les tâches en utilisant une stratégie de tri
    public async sortTasks(strategy: SortStrategy): Promise<Task[]> {
        const tasks = await TaskModel.find();
        tasks.forEach(task => {
            task.subscribeAllObservers(); // Abonne les observateurs pour chaque tâche
        });
        return strategy.sort(tasks);
    }

    // Nouvelle méthode : Obtenir les tâches actives
    // public async getActiveTasksCount(): Promise<number> {
    //     const activeTasks = await TaskModel.find({ status: 'in progress' });
    //     return activeTasks.length;
    // }

    public async getTasksCountByStatus(status: string, userId: string): Promise<number> {
        const teamIds = await this.crewService.getCrewIds(userId);
        const projectIds = await this.projectService.getProjectByCreatorId(userId);
        const count = await TaskModel.find({
            status: status,
            $or: [
                { assignedTo: { $in: teamIds } },
                { project: { $in: projectIds } },
            ]
        }).countDocuments();
        return count;
    }

    public async getActiveTasksCount(userId: string): Promise<number> {
        const activeTasks = await this.getTasksCountByStatus('in progress', userId);
        return activeTasks;
    }

    public async getCompletedTasksCount(userId: string): Promise<number> {
        const completedTasks = await this.getTasksCountByStatus('done', userId);
        return completedTasks;
    }

    // Méthode pour obtenir les tâches avec des échéances proches
    public async getUpcomingDeadlines(userId: string, days: number = 7): Promise<Task[]> {
        const teamIds = await this.crewService.getCrewIds(userId);
        const today = new Date();
        const deadline = new Date();
        deadline.setDate(today.getDate() + days);

        return await TaskModel.find({
            assignedTo: { $in: teamIds },
            dueDate: { $gte: today, $lte: deadline },
            status: { $ne: 'done' }, // Exclure les tâches déjà terminées
        })
            .populate({
                path: 'comments',
                model: 'Comment', // Nom du modèle à utiliser pour résoudre `comments`
                populate: {
                    path: 'author',
                    model: 'User', // Résout l'auteur de chaque commentaire
                    select: 'name', // Inclut les informations nécessaires sur l'auteur
                },
            })
            .populate({
                path: 'project',
                model: 'Project', // Nom du modèle à utiliser pour résoudre `comments`
                select: 'name'
            })
            .populate({
                path: 'assignedTo',
                model: 'Crew', // Nom du modèle à utiliser pour résoudre `comments`
                select: 'title'
            })
            .sort({ dueDate: 1 }) // Trier par ordre croissant de date
            .exec();
    }
}

export default TaskService; 