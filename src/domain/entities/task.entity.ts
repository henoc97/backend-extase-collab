import mongoose, { Document } from 'mongoose';
import { IObservable } from "../../application/observers/observable"
import { IObserver } from '../../application/observers/observer';
import Crew from './crew.entity';
import User from './user.entity';


export class Task extends Document implements IObservable {
    title: string;
    description?: string;
    dueDate?: Date;
    status: 'todo' | 'in progress' | 'review' | 'done';
    priority: 'urgent' | 'high' | 'medium' | 'low';
    project: mongoose.Types.ObjectId;
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
        this.status = init.status || 'todo';
        this.priority = init.priority || 'low';
        this.project = init.project!;
        this.comments = init.comments;
        this.assignedTo = init.assignedTo;
        this.createdAt = init.createdAt;
        this.updatedAt = init.updatedAt;
        this.observers = []; // Toujours initialiser comme un tableau
        this.subscribeAllObservers();
    }

    // Méthode améliorée pour gérer l'asynchronicité
    async subscribeAllObservers() {
        this.observers = []; // Réinitialiser les observateurs
        console.log("Subscribing observers...");
        if (this.assignedTo) {
            try {
                const crew = await Crew.findById(this.assignedTo).populate('members');
                console.log('Crew:', crew);  // Vérifiez la structure de `crew`
                if (crew && crew.members) {
                    await Promise.all(
                        crew.members.map(async (memberId) => {
                            const user = await User.findById(memberId);
                            console.log('User:', user);  // Vérifiez la structure de `user`
                            if (user) {
                                this.subscribe(user); // Ajouter l'utilisateur comme observateur
                            }
                        })
                    );
                }
            } catch (error) {
                console.error("Error subscribing observers:", error);
            }
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
            observer.update("notifyObservers");
        }
    }
}


// Créer le schéma de tâche
const taskSchema = new mongoose.Schema<Task>({
    title: { type: String, required: true },
    description: { type: String, required: false },
    dueDate: { type: Date, required: false },
    status: { type: String, enum: ['todo', 'in progress', 'review', 'done'], default: 'todo' },
    priority: { type: String, enum: ['urgent', 'high', 'medium', 'low'], default: 'low' },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Crew', required: false },
    comments: { type: [mongoose.Schema.Types.ObjectId], ref: 'Comment', required: false },
}, { timestamps: true });

const TaskModel = mongoose.model<Task>('Task', taskSchema);
export default TaskModel;