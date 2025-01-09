import NotificationModel, { INotification } from "../../domain/entities/notification.entity";
import EmailService from './email.service';
import PushService from './push.service';
import SocketService from "./socket.service";

class NotificationService {
    private static instance: NotificationService;

    private constructor() { }

    public static getInstance(): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    // Créer une notification
    public async createNotification(notificationData: any): Promise<INotification> {
        try {
            const notification = new NotificationModel(notificationData);
            await notification.save();

            // Émettre un événement de notification via Socket.io
            SocketService.sendNotification(notificationData.receiverId, notificationData);

            // Envoyer un email
            await EmailService.sendEmail(notificationData.sendTo, notificationData.title, notificationData.content);

            // Envoyer une notification push (si l'abonnement est disponible)
            if (notificationData.subscription) {
                await PushService.sendPushNotification(notificationData.subscription, {
                    title: notificationData.title,
                    content: notificationData.content,
                    sendTo: notificationData.receiverId,
                });
            }

            return notification;
        } catch (error) {
            console.log('Error creating notification:', error);
            throw error;

        }
    }

    // Obtenir les notifications par utilisateur
    public async getNotificationsByUserId(userId: string): Promise<INotification[]> {
        return await NotificationModel.find({ sendTo: userId });
    }

    // Supprimer une notification
    public async deleteNotification(notificationId: string): Promise<INotification | null> {
        return await NotificationModel.findByIdAndDelete(notificationId);
    }
}

export default NotificationService.getInstance(); 