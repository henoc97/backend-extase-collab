import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import passport from '../../application/config/passport.config';

const router = Router();

// Route pour l'authentification par Google
// router.get('/google', AuthController.googleAuth, (req, res) => {res.redirect('/'););

// // Callback de Google
// router.get('/google/callback', AuthController.googleCallback);

router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }),
    (req, res) => {
        res.redirect('/');
    }
);
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    AuthController.googleCallback
);


// Route pour l'authentification par email et mot de passe
router.post('/login', AuthController.login);

// Middleware pour protéger les routes
router.get('/protected', AuthController.protectedRoute);

export default router;