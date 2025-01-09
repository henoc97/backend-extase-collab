import mongoose, { Schema, Document } from 'mongoose';

export interface Subscription extends Document {
    userId: string; // ID de l'utilisateur
    endpoint: string; // URL pour envoyer la notification
    keys: {
        p256dh: string;
        auth: string;
    };
}

const SubscriptionSchema: Schema = new Schema({
    userId: { type: String, required: true },
    endpoint: { type: String, required: true },
    keys: {
        p256dh: { type: String, required: true },
        auth: { type: String, required: true },
    },
});

const SubscriptionModel = mongoose.model<Subscription>('Subscription', SubscriptionSchema);
export default SubscriptionModel;
