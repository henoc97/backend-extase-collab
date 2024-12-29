import TaskModel, { ITask } from "../../domain/entities/task";
import NotificationService from './notification.service';
import TaskFactory from '../factories/task.factory';
import { Server } from 'socket.io';
import { SortStrategy } from '../sorting/sort.strategy';

class TaskService {
    private static instance: TaskService;
    private notificationService: NotificationService;

    private constructor(io: Server) {
        this.notificationService = NotificationService.getInstance(io);
    }

    public static getInstance(io: Server): TaskService {
        if (!TaskService.instance) {
            TaskService.instance = new TaskService(io);
        }
        return TaskService.instance;
    }

    // Créer une tâche en utilisant la TaskFactory
    public async createTask(taskData: any): Promise<ITask> {
        const task = TaskFactory.createTask(taskData);
        return await task.save();
    }

    // Obtenir une tâche par ID
    public async getTaskById(taskId: string): Promise<ITask | null> {
        return await TaskModel.findById(taskId);
    }

    // Mettre à jour une tâche
    public async updateTask(taskId: string, updateData: any): Promise<ITask | null> {
        const updatedTask = await TaskModel.findByIdAndUpdate(taskId, updateData, { new: true });

        // Envoyer une notification si la tâche est mise à jour
        if (updatedTask) {
            await this.notificationService.createNotification({
                title: 'Tâche mise à jour',
                content: `La tâche "${updatedTask.title}" a été mise à jour.`,
                sendTo: updatedTask.assignedTo,
            });
        }

        return updatedTask;
    }

    // Supprimer une tâche
    public async deleteTask(taskId: string): Promise<ITask | null> {
        return await TaskModel.findByIdAndDelete(taskId);
    }

    // Obtenir toutes les tâches d'un projet
    public async getTasksByProjectId(projectId: string): Promise<ITask[]> {
        return await TaskModel.find({ projectId });
    }

    // Assigner une tâche à un membre de l'équipe
    public async assignTask(taskId: string, assignedTo: string): Promise<ITask | null> {
        const updatedTask = await TaskModel.findByIdAndUpdate(taskId, { assignedTo }, { new: true });

        // Envoyer une notification si la tâche est assignée
        if (updatedTask) {
            await this.notificationService.createNotification({
                title: 'Tâche assignée',
                content: `La tâche "${updatedTask.title}" a été assignée à vous.`,
                sendTo: assignedTo,
            });
        }

        return updatedTask;
    }

    // Trier les tâches en utilisant une stratégie de tri
    public async sortTasks(strategy: SortStrategy): Promise<ITask[]> {
        const tasks = await TaskModel.find();
        return strategy.sort(tasks);
    }
}

export default TaskService; 