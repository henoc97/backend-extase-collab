import mongoose, { Document } from 'mongoose';

// Définir une interface pour le document Comment
export interface IComment extends Document {
    content: string;
    taskId: mongoose.Types.ObjectId;
    author: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

// Créer le schéma de commentaire
const commentSchema = new mongoose.Schema<IComment>({
    content: { type: String, required: true },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }
}, { timestamps: true });

const Comment = mongoose.model<IComment>('Comment', commentSchema);

export default Comment;
