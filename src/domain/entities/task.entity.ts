import mongoose, { Document } from 'mongoose';
import { IObservable } from "../../application/observers/observable"
import { IObserver } from '../../application/observers/observer';


// Définir une interface pour le document Task
export class Task extends Document implements IObservable {
    title: string;
    description?: string;
    dueDate?: Date;
    status: 'pending' | 'in progress' | 'completed';
    priority: 'Urgent' | 'Normal' | 'Low';
    projectId: mongoose.Types.ObjectId;
    comments?: mongoose.Types.ObjectId[];
    assignedTo?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
    observers: IObserver[];

    constructor(init: Partial<Task>) {
        super();
        this.title = init.title!;
        this.description = init.description;
        this.dueDate = init.dueDate;
        this.status = init.status || 'pending';
        this.priority = init.priority || 'Low';
        this.projectId = init.projectId!;
        this.comments = init.comments;
        this.assignedTo = init.assignedTo;
        this.createdAt = init.createdAt;
        this.updatedAt = init.updatedAt;
        this.observers = [];
    }

    subscribe(observer: IObserver): void {
        throw new Error('Method not implemented.');
    }
    unsubscribe(observer: IObserver): void {
        throw new Error('Method not implemented.');
    }
    notifyObservers(): void {
        throw new Error('Method not implemented.');
    }
}

// Créer le schéma de tâche
const taskSchema = new mongoose.Schema<Task>({
    title: { type: String, required: true },
    description: { type: String, required: false },
    dueDate: { type: Date, required: false },
    status: { type: String, enum: ['pending', 'in progress', 'completed'], default: 'pending' },
    priority: { type: String, enum: ['Urgent', 'Normal', 'Low'], default: 'Low' },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Crew' },
    comments: { type: [mongoose.Schema.Types.ObjectId], ref: 'Comment', required: false },
}, { timestamps: true });

const TaskModel = mongoose.model<Task>('Task', taskSchema);
export default TaskModel;