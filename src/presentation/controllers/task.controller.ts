import { Request, Response } from 'express';
import TaskService from '../../application/services/task.service';
import { ITask } from '../../domain/entities/task';

class TaskController {
    private taskService = TaskService;

    public async createTask(req: Request, res: Response): Promise<Response> {
        try {
            const taskData: ITask = req.body;
            const task = await this.taskService.createTask(taskData);
            return res.status(201).json(task);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    public async getTaskById(req: Request, res: Response): Promise<Response> {
        try {
            const taskId = req.params.id;
            const task = await this.taskService.getTaskById(taskId);
            if (!task) {
                return res.status(404).json({ message: 'Task not found' });
            }
            return res.json(task);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    public async updateTask(req: Request, res: Response): Promise<Response> {
        try {
            const taskId = req.params.id;
            const updateData = req.body;
            const updatedTask = await this.taskService.updateTask(taskId, updateData);
            if (!updatedTask) {
                return res.status(404).json({ message: 'Task not found' });
            }
            return res.json(updatedTask);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    public async deleteTask(req: Request, res: Response): Promise<Response> {
        try {
            const taskId = req.params.id;
            const deletedTask = await this.taskService.deleteTask(taskId);
            if (!deletedTask) {
                return res.status(404).json({ message: 'Task not found' });
            }
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    public async getTasksByProjectId(req: Request, res: Response): Promise<Response> {
        try {
            const projectId = req.params.projectId;
            const tasks = await this.taskService.getTasksByProjectId(projectId);
            return res.json(tasks);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    public async assignTask(req: Request, res: Response): Promise<Response> {
        try {
            const taskId = req.params.id;
            const { assignedTo } = req.body;
            const updatedTask = await this.taskService.assignTask(taskId, assignedTo);
            if (!updatedTask) {
                return res.status(404).json({ message: 'Task not found' });
            }
            return res.json(updatedTask);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

export default new TaskController(); 