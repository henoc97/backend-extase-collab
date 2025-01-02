import Comment, { IComment } from '../../domain/entities/comment.entity';
import mongoose from 'mongoose';

class CommentService {
    private static instance: CommentService;

    private constructor() { }

    public static getInstance(): CommentService {
        if (!CommentService.instance) {
            CommentService.instance = new CommentService();
        }
        return CommentService.instance;
    }
    // Créer un commentaire
    async createComment(content: string, taskId: string, userId: string): Promise<IComment> {
        const comment = new Comment({ content, taskId, userId });
        return await comment.save();
    }

    // Lire tous les commentaires pour une tâche
    async getCommentsByTaskId(taskId: string): Promise<IComment[]> {
        return await Comment.find({ taskId }).populate('userId', 'name email'); // Populer les informations de l'utilisateur
    }

    // Mettre à jour un commentaire
    async updateComment(commentId: string, content: string): Promise<IComment | null> {
        return await Comment.findByIdAndUpdate(commentId, { content }, { new: true });
    }

    // Supprimer un commentaire
    async deleteComment(commentId: string): Promise<IComment | null> {
        return await Comment.findByIdAndDelete(commentId);
    }
}

export default CommentService.getInstance(); 