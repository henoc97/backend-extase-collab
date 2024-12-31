import { Request, Response } from 'express';
import TaskService from '../../application/services/task.service';
import { Server } from 'socket.io';
import { ITask } from '../../domain/entities/task.entity';

class TaskController {
    private taskService: TaskService;

    public constructor(io: Server) {
        this.taskService = TaskService.getInstance(io);
    }

    public async createTask(req: Request, res: Response): Promise<void> {
        try {
            const taskData: ITask = req.body;
            const task = await this.taskService.createTask(taskData);
            res.status(201).json(task);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json(`Error: ${error.message}`);
            } else {
                res.status(500).json('Unknown error');
            }
        }
    }

    public async getTaskById(req: Request, res: Response): Promise<void> {
        try {
            const taskId = req.params.id;
            const task = await this.taskService.getTaskById(taskId);
            if (!task) {
                res.status(404).json({ message: 'Task not found' });
            }
            res.status(200).json(task);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json(`Error: ${error.message}`);
            } else {
                res.status(500).json('Unknown error');
            }
        }
    }

    public async updateTask(req: Request, res: Response): Promise<void> {
        try {
            const taskId = req.params.id;
            const updateData = req.body;
            const updatedTask = await this.taskService.updateTask(taskId, updateData);
            if (!updatedTask) {
                res.status(404).json({ message: 'Task not found' });
            }
            res.status(200).json(updatedTask);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json(`Error: ${error.message}`);
            } else {
                res.status(500).json('Unknown error');
            }
        }
    }

    public async deleteTask(req: Request, res: Response): Promise<void> {
        try {
            const taskId = req.params.id;
            const deletedTask = await this.taskService.deleteTask(taskId);
            if (!deletedTask) {
                res.status(404).json({ message: 'Task not found' });
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

    public async getTasksByProjectId(req: Request, res: Response): Promise<void> {
        try {
            const projectId = req.params.projectId;
            const tasks = await this.taskService.getTasksByProjectId(projectId);
            res.status(200).json(tasks);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json(`Error: ${error.message}`);
            } else {
                res.status(500).json('Unknown error');
            }
        }
    }

    public async assignTask(req: Request, res: Response): Promise<void> {
        try {
            const taskId = req.params.id;
            const { assignedTo } = req.body;
            const updatedTask = await this.taskService.assignTask(taskId, assignedTo);
            if (!updatedTask) {
                res.status(404).json({ message: 'Task not found' });
            }
            res.status(200).json(updatedTask);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json(`Error: ${error.message}`);
            } else {
                res.status(500).json('Unknown error');
            }
        }
    }
}

export default TaskController; 