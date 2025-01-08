import mongoose, { Document, ObjectId } from 'mongoose';
import { IObserver } from "../../application/observers/observer"

// Définir une interface pour le document utilisateur
export class User extends Document implements IObserver {
    _id: ObjectId;
    googleId: string;
    name: string;
    email: string;
    password?: string | null;
    comments?: mongoose.Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;

    public constructor(
        _id: ObjectId,
        googleId: string,
        name: string,
        email: string,
        password?: string | null,
        comments?: mongoose.Types.ObjectId[],
        createdAt?: Date,
        updatedAt?: Date
    ) {
        super();
        this._id = _id;
        this.googleId = googleId;
        this.name = name;
        this.email = email;
        this.password = password;
        this.comments = comments;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    update(value: any): void {
        throw new Error('Method not implemented.');
    }
}

// Définir le schéma
const userSchema = new mongoose.Schema<User>({
    googleId: { type: String, required: false },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    comments: { type: [mongoose.Schema.Types.ObjectId], ref: 'Comment', required: false },
}, { timestamps: true });

// Exporter le modèle
const UserModel = mongoose.model<User>('User', userSchema);
export default UserModel;
