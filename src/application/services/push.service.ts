import webPush from 'web-push';
import * as dotenv from 'dotenv';

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
}

export default PushService.getInstance(); 