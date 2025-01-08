import mongoose, { Document } from 'mongoose';

// Définir une interface pour le document Crew
export interface ICrew extends Document {
    title: string;
    projectId: mongoose.Types.ObjectId;
    crewDirector?: mongoose.Types.ObjectId;
    members?: mongoose.Types.ObjectId[];
    guests: string[]; // [john@example.com, jane@example.com]
    tasks: mongoose.Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}

// Créer le schéma de crew
const crewSchema = new mongoose.Schema<ICrew>({
    title: { type: String, required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    crewDirector: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }],
    guests: { type: [String], required: false },
    tasks: [{ type: [mongoose.Schema.Types.ObjectId], ref: 'Task', required: false }],
}, { timestamps: true });

const Crew = mongoose.model<ICrew>('Crew', crewSchema);

export default Crew;
