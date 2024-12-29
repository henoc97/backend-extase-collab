import { Request, Response } from 'express';
import UserService from '../../application/services/user.service';
import { IUser } from '../../domain/entities/user';

class UserController {
    private userService = UserService;

    public async createUser(req: Request, res: Response): Promise<Response> {
        try {
            const userData: IUser = req.body;
            const user = await this.userService.createUser(userData);
            return res.status(201).json(user);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    public async getUserById(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.params.id;
            const user = await this.userService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.json(user);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    public async updateUser(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.params.id;
            const updateData = req.body;
            const updatedUser = await this.userService.updateUser(userId, updateData);
            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.json(updatedUser);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    public async deleteUser(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.params.id;
            const deletedUser = await this.userService.deleteUser(userId);
            if (!deletedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

export default new UserController();
