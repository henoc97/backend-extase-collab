import { Request, Response } from 'express';
import userService from '../../application/services/user.service';
import { User } from '../../domain/entities/user.entity';
import authService from '../../application/services/auth.service';

class UserController {
    public createUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const userData: User = req.body;
            console.log("user cata received: " + JSON.stringify(userData));
            const user: any = await userService.createUser(userData);
            console.log("user created: " + user);
            const tokens = authService.generateToken(user._id, user.email);

            // Stockage du refresh token dans un cookie sécurisé
            res.cookie("refreshToken", tokens.refreshToken, {
                httpOnly: true,
                secure: false, // Assurez-vous d'utiliser HTTPS
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
            });

            res.cookie("accessToken", tokens.accessToken, {
                httpOnly: true, // Assurez-vous qu'il n'est pas accessible par JavaScript
                secure: false,  // Passez à true en production
                sameSite: "strict",
                maxAge: 60 * 60 * 1000, // 1 heure
            });

            user.password = "";

            // Répondre avec un message de succès et les tokens
            res.status(201).json({ message: "success" });
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json(`Error: ${error.message}`);
            } else {
                res.status(500).json('Unknown error');
            }
        }
    }

    public getUserById = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.params.id;
            const user = await userService.getUserById(userId);
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

    public updateUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.params.id;
            const updateData = req.body;
            const updatedUser = await userService.updateUser(userId, updateData);
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

    public deleteUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.params.id;
            const deletedUser = await userService.deleteUser(userId);
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
