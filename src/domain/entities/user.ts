import mongoose, { Document } from 'mongoose';

// Définir une interface pour le document utilisateur
export interface IUser extends Document {
    name: string;
    email: string;
    password?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

// Définir le schéma
const userSchema = new mongoose.Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
}, { timestamps: true });

// Exporter le modèle
const UserModel = mongoose.model<IUser>('User', userSchema);
export default UserModel;
