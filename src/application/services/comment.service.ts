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
    async createComment(content: string, taskId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId): Promise<IComment> {
        const comment = new Comment({ content, taskId, userId });
        return await comment.save();
    }

    // Lire tous les commentaires pour une tâche
    async getCommentsByTaskId(taskId: mongoose.Types.ObjectId): Promise<IComment[]> {
        return await Comment.find({ taskId }).populate('userId', 'name email'); // Populer les informations de l'utilisateur
    }

    // Mettre à jour un commentaire
    async updateComment(commentId: mongoose.Types.ObjectId, content: string): Promise<IComment | null> {
        return await Comment.findByIdAndUpdate(commentId, { content }, { new: true });
    }

    // Supprimer un commentaire
    async deleteComment(commentId: mongoose.Types.ObjectId): Promise<IComment | null> {
        return await Comment.findByIdAndDelete(commentId);
    }
}

export default CommentService.getInstance(); 