import mongoose, { Document } from 'mongoose';

// Définir une interface pour le document Project
export interface IProject extends Document {
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    status: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Créer le schéma de projet
const projectSchema = new mongoose.Schema<IProject>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, required: true },
}, { timestamps: true });

const Project = mongoose.model<IProject>('Project', projectSchema);

export default Project;
