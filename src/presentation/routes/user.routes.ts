import { Router } from 'express';
import UserController from '../controllers/user.controller';

const router = Router();

// Définir les routes pour User
router.post('/', UserController.createUser);
router.get('/:id', UserController.getUserById);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

export default router;
