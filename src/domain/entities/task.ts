import mongoose, { Document } from 'mongoose';

// Définir une interface pour le document Task
export interface ITask extends Document {
    title: string;
    description?: string;
    dueDate?: Date;
    status: 'pending' | 'in progress' | 'completed';
    priority: 'Urgent' | 'Normal' | 'Low';
    projectId: mongoose.Types.ObjectId;
    assignedTo?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

// Créer le schéma de tâche
const taskSchema = new mongoose.Schema<ITask>({
    title: { type: String, required: true },
    description: { type: String, required: false },
    dueDate: { type: Date, required: false },
    status: { type: String, enum: ['pending', 'in progress', 'completed'], default: 'pending' },
    priority: { type: String, enum: ['Urgent', 'Normal', 'Low'], default: 'Low' },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Crew' }
}, { timestamps: true });

const Task = mongoose.model<ITask>('Task', taskSchema);

export default Task;