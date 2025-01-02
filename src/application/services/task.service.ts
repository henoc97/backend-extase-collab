import TaskModel, { Task } from "../../domain/entities/task.entity";
import NotificationService from './notification.service';
import UserObserverService from './user.observer.service';
import TaskFactory from '../factories/task.factory';
import { Server } from 'socket.io';
import { SortStrategy } from '../sorting/sort.strategy';
import crewService from "./crew.service";
import serService from "./user.service";

class TaskService {
    private static instance: TaskService;
    private userObserverService: UserObserverService;

    private constructor(io: Server) {
        this.userObserverService = UserObserverService.getInstance(io);
    }

    public static getInstance(io: Server): TaskService {
        if (!TaskService.instance) {
            TaskService.instance = new TaskService(io);
        }
        return TaskService.instance;
    }

    // Créer une tâche en utilisant la TaskFactory
    public async createTask(taskData: any): Promise<Task> {
        const task = TaskFactory.createTask(taskData);
        task.subscribeAllObservers();
        this.userObserverService.notify(task.observers, 'task created', `new task created for ecommerce project: ${task.title}`);
        return await task.save();
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
}

export default TaskService; 