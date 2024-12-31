import mongoose, { Document } from 'mongoose';

// Définir une interface pour le document utilisateur
export interface IUser extends Document {
    _id: string;
    googleId: string;
    name: string;
    email: string;
    password?: string | null;
    comments?: mongoose.Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}

// Définir le schéma
const userSchema = new mongoose.Schema<IUser>({
    googleId: { type: String, required: false },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    comments: { type: [mongoose.Schema.Types.ObjectId], ref: 'Comment', required: false },
}, { timestamps: true });

// Exporter le modèle
const User = mongoose.model<IUser>('User', userSchema);
export default User;
