import webPush from 'web-push';

class PushService {
    private static instance: PushService;

    private constructor() {
        // Configurer les clés VAPID pour les notifications push
        webPush.setVapidDetails(
            process.env.VAPID_EMAIL, // Votre email
            process.env.VAPID_PUBLIC_KEY, // Clé publique VAPID
            process.env.VAPID_PRIVATE_KEY // Clé privée VAPID
        );
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