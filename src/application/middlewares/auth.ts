import jwt, { JwtPayload } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { NextFunction } from 'express';

dotenv.config();

// Middleware de vérification du token en Express.js
function authenticateToken(req: any, res: any, next: NextFunction): void {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.sendStatus(401); // Non authentifié

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error('JWT_SECRET environment variable is not defined');
    }

    jwt.verify(token, jwtSecret, (err: any, user: any) => {
        if (err) return res.sendStatus(403); // Non autorisé
        req.user = user;
        next();
    });
}

export default authenticateToken;