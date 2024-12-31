import { Request, Response } from 'express';
import UserService from '../../application/services/user.service';
import { User } from '../../domain/entities/user.entity';

class UserController {
    private userService = UserService;

    public async createUser(req: Request, res: Response): Promise<void> {
        try {
            const userData: User = req.body;
            const user = await this.userService.createUser(userData);
            res.status(201).json(user);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json(`Error: ${error.message}`);
            } else {
                res.status(500).json('Unknown error');
            }
        }
    }

    public async getUserById(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.id;
            const user = await this.userService.getUserById(userId);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(user);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json(`Error: ${error.message}`);
            } else {
                res.status(500).json('Unknown error');
            }
        }
    }

    public async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.id;
            const updateData = req.body;
            const updatedUser = await this.userService.updateUser(userId, updateData);
            if (!updatedUser) {
                res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(updatedUser);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json(`Error: ${error.message}`);
            } else {
                res.status(500).json('Unknown error');
            }
        }
    }

    public async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.id;
            const deletedUser = await this.userService.deleteUser(userId);
            if (!deletedUser) {
                res.status(404).json({ message: 'User not found' });
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
}

export default new UserController();
