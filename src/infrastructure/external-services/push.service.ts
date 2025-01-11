import webPush from 'web-push';
import * as dotenv from 'dotenv';
import SubscriptionModel, { Subscription } from '../../domain/entities/subscription.entity'
import { INotification } from '../../domain/entities/notification.entity';

dotenv.config();

class PushService {
    private static instance: PushService;

    private constructor() {
        const email = process.env.VAPID_EMAIL || "";
        const publicKey = process.env.VAPID_PUBLIC_KEY || "";
        const privateKey = process.env.VAPID_PRIVATE_KEY || "";

        if (!email || !publicKey || !privateKey) {
            throw new Error("Les détails VAPID (email, publicKey, privateKey) doivent être définis.");
        }

        webPush.setVapidDetails(email, publicKey, privateKey);
    }

    public static getInstance(): PushService {
        if (!PushService.instance) {
            PushService.instance = new PushService();
        }
        return PushService.instance;
    }

    public async sendPushNotification(subscription: any, payload: any): Promise<void> {
        await webPush.sendNotification(subscription, JSON.stringify(payload));
    }

    sendNotificationToUser = async (userId: string, payload: INotification): Promise<void> => {
        try {
            const subscription = await this.getSubscription(userId);

            if (!subscription) {
                console.error(`No subscription found for userId: ${userId}`);
                return;
            }

            await this.sendPushNotification(subscription, payload);
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    };

    public async saveSubscription(subscription: any, userId: string): Promise<void> {
        try {
            const existingSubscription = await SubscriptionModel.findOne({ userId });

            if (existingSubscription) {
                // Mettre à jour si une subscription existe déjà
                existingSubscription.endpoint = subscription.endpoint;
                existingSubscription.keys = subscription.keys;
                await existingSubscription.save();
            } else {
                // Créer une nouvelle subscription
                const newSubscription = new SubscriptionModel({
                    userId,
                    endpoint: subscription.endpoint,
                    keys: subscription.keys,
                });
                await newSubscription.save();
            }

            console.log('Subscription saved successfully');
        } catch (error) {
            console.error('Error saving subscription to database:', error);
        }
    };

    public async getSubscription(userId: string): Promise<PushSubscription | null> {
        try {
            const subscriptionData = await SubscriptionModel.findOne({ userId });

            if (!subscriptionData) return null;

            return {
                endpoint: subscriptionData.endpoint,
                keys: {
                    p256dh: subscriptionData.keys.p256dh,
                    auth: subscriptionData.keys.auth,
                },
            } as unknown as PushSubscription;
        } catch (error) {
            console.error('Error retrieving subscription:', error);
            return null;
        }
    };
}

export default PushService.getInstance(); 