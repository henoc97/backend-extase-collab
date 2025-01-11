import NotificationModel, { INotification } from "../../domain/entities/notification.entity";
import { emailSwitcher } from "../helper/email-type-switcher";
import pushService from '../../infrastructure/external-services/push.service';
import socketService from "../../infrastructure/external-services/socket.service";

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
            try {
                socketService.sendNotification(notificationData.receiverId, notificationData)
                console.log('msg sent successfully by socket');

            } catch (error) {
                console.error('Error sending msg by socket:', error);
            }

            // Envoyer un email en fonction du type de notification
            try {
                await emailSwitcher(notificationData);
            } catch (error) {
                console.error('Error sending email:', error);
                // Optionally, you can implement additional logic here, such as logging the error to a database or notifying an admin.
            }
            // await emailService.sendEmail(notificationData.emailTo, notificationData.title, notificationData.content);

            // Envoyer une notification push (si l'abonnement est disponible)
            const isSubscribed = await pushService.getSubscription(notificationData.sendTo);
            if (isSubscribed) {
                await pushService.sendPushNotification(notificationData.subscription, {
                    title: notificationData.title,
                    content: notificationData.content,
                    sendTo: notificationData.sendTo,
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