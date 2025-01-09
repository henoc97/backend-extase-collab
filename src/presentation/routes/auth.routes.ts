import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import passport from '../../application/config/passport.config';
import authenticateToken from '../../application/middlewares/auth';

const router = Router();

// Route pour l'authentification par Google
// router.get('/google', AuthController.googleAuth, (req, res) => {res.redirect('/'););

// // Callback de Google
// router.get('/google/callback', AuthController.googleCallback);

router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }),
    (req, res) => {
        // res.redirect('/');
    }
);
router.get(
    '/google/callback',
    passport.authenticate('google', { session: false }),
    AuthController.googleCallback
);


// Route pour l'authentification par email et mot de passe
router.post('/login', AuthController.login);

// Middleware pour protéger les routes
router.get('/protected', AuthController.protectedRoute);

router.get('/refresh-token', AuthController.refreshToken);

router.use(authenticateToken)

router.get('/logout', AuthController.logout);

export default router;