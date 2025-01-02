import { Router } from 'express';
import UserController from '../controllers/user.controller';
import authenticateToken from '../../application/middlewares/auth';

const router = Router();

router.post('/', UserController.createUser);
router.use(authenticateToken)
// Définir les routes pour User
router.get('/:id', UserController.getUserById);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

export default router;
