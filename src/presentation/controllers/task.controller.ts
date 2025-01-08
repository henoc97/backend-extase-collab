import { Request, Response } from 'express';
import TaskService from '../../application/services/task.service';
import { Server } from 'socket.io';
import { Task } from '../../domain/entities/task.entity';

class TaskController {
    private taskService: TaskService;

    public constructor(io: Server) {
        this.taskService = TaskService.getInstance(io);
    }

    public createTask = async (req: Request, res: Response): Promise<void> => {
        try {
            const taskData: Task = req.body;
            console.log('task data received: ', taskData);
            const task = await this.taskService.createTask(taskData);
            res.status(201).json(task);
        } catch (error) {
            if (error instanceof Error) {
                console.log(`Error create task controller: ${error.message}`);
                res.status(500).json(`Error: ${error.message}`);
            } else {
                res.status(500).json('Unknown error');
            }
        }
    }

    public getTaskById = async (req: Request, res: Response): Promise<void> => {
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

    public updateTask = async (req: Request, res: Response): Promise<void> => {
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

    public deleteTask = async (req: Request, res: Response): Promise<void> => {
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

    public getTasksByProjectId = async (req: Request, res: Response): Promise<void> => {
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

    public assignTask = async (req: Request, res: Response): Promise<void> => {
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