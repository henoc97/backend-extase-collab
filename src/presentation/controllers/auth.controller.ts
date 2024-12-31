import { Request, Response } from 'express';
import passport from '../../application/config/passport.config';
import AuthService from '../../application/services/auth.service';
import { CookingPot } from 'lucide-react';

class AuthController {
    public async googleAuth(): Promise<any> {
        // Authentification par Google
        passport.authenticate('google', { scope: ['profile', 'email'] });
    }

    public async googleCallback(req: any, res: Response): Promise<void> {
        if (!req.user) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        console.log("req.user: " + req.user);
        const token = AuthService.generateToken(req.user.id);
        res.json({ token });
    }

    public async login(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;
        try {
            const user = await AuthService.login(email, password);
            const token = AuthService.generateToken(user._id);
            res.json({ token });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(401).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Unknown error occurred' });
            }
        }
    }

    public async protectedRoute(req: Request, res: Response): Promise<void> {
        res.json({ message: 'Protected route accessed', user: req.user });
    }
}

export default new AuthController();