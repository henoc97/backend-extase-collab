import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { NextFunction } from 'express';

dotenv.config();

// Middleware de vérification du token en Express.js
function authenticateToken(req: any, res: any, next: NextFunction): void {
    const accessToken = req.cookies.accessToken
    if (!accessToken) return res.sendStatus(401); // Non authentifié

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error('JWT_SECRET environment variable is not defined');
    }

    jwt.verify(accessToken, jwtSecret, (err: any, user: any) => {
        if (err) return res.sendStatus(403); // Non autorisé
        req.user = user;
        next();
    });
}

export default authenticateToken;