import { Router } from 'express';
import authenticateToken from '../../application/middlewares/auth';
import CommentController from '../controllers/comment.controller'

const router = Router();

router.use(authenticateToken)
// Routes pour les commentaires
// router.post('/comments', CommentController.createComment);
// router.get('/comments/:id', CommentController.getCommentById);
router.put('/comments/:id', CommentController.updateComment);
router.delete('/comments/:id', CommentController.deleteComment);

export default router;