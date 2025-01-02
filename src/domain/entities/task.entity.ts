import mongoose, { Document } from 'mongoose';
import { IObservable } from "../../application/observers/observable"
import { IObserver } from '../../application/observers/observer';
import Crew from './crew.entity';
import User from './user.entity';


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
        this.subscribeAllObservers();


    }

    subscribeAllObservers() {
        this.observers = [];
        if (this.assignedTo) {
            Crew.findById(this.assignedTo).populate('members').then(crew => {
                if (crew) {
                    crew.members.forEach(memberId => {
                        User.findById(memberId).then(user => {
                            if (user) {
                                this.subscribe(user);
                            }
                        });
                    });
                }
            });
        }
    }

    subscribe(observer: IObserver): void {
        this.observers.push(observer);
    }
    unsubscribe(observer: IObserver): void {
        this.observers = this.observers.filter(obs => obs !== observer);
    }
    notifyObservers(): void {
        for (const observer of this.observers) {
            observer.update("notifyObservers")
        }
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