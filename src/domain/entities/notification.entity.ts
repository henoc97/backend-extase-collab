import mongoose, { Document } from 'mongoose';

// Définir une interface pour le document Notification
export interface INotification extends Document {
    title: string;
    content: string;
    type?: string;
    sendTo?: mongoose.Types.ObjectId;
    emailTo?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Créer le schéma de notification
const notificationSchema = new mongoose.Schema<INotification>({
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, required: false },
    sendTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    emailTo: { type: String }
}, { timestamps: true });

const Notification = mongoose.model<INotification>('Notification', notificationSchema);

export default Notification;