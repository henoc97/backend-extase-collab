import { Request, Response } from 'express';
import passport from '../../application/config/passport.config';
import authService from '../../application/services/auth.service';
import jwt from 'jsonwebtoken';

class AuthController {
    public googleAuth = async (): Promise<any> => {
        // Authentification par Google
        passport.authenticate('google', { scope: ['profile', 'email'] });
    }

    public googleCallback = async (req: any, res: Response): Promise<void> => {
        if (!req.user) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        console.log("req.user: " + req.user);
        const tokens = authService.generateToken(req.user.id, req.user.email);

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

        res.redirect('http://localhost:3000/dashboard');
    }

    public login = async (req: Request, res: Response): Promise<void> => {
        const { email, password } = req.body;
        console.log("login", email, password);
        try {
            const user = await authService.login(email, password);
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

            res.status(200).json({ message: "success" });

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("error: ", error.message);
                res.status(401).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Unknown error occurred' });
            }
        }
    }

    public refreshToken = async (req: Request, res: Response): Promise<void> => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) res.sendStatus(401);

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET environment variable is not defined');
        }

        jwt.verify(refreshToken, jwtSecret, (err: any, user: any) => {
            if (err) return res.sendStatus(403);

            const accessToken = authService.generateAccessToken(user.id, user.email)

            res.cookie("accessToken", accessToken, {
                httpOnly: true, // Assurez-vous qu'il n'est pas accessible par JavaScript
                secure: false,  // Passez à true en production
                sameSite: "strict",
                maxAge: 60 * 60 * 1000, // 1 heure
            });

            res.status(200).json({ message: "success" });
        });
    }

    public logout = async (req: Request, res: Response): Promise<void> => {
        res.clearCookie("refreshToken");
        res.json({ message: "Déconnexion réussie" });
    }

    public protectedRoute = async (req: Request, res: Response): Promise<void> => {
        res.json({ message: 'Protected route accessed', user: req.user });
    }
}

export default new AuthController();