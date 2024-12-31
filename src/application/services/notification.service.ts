import NotificationModel, { INotification } from "../../domain/entities/notification.entity";
import { Types } from 'mongoose';
import { Server } from 'socket.io';
import EmailService from './email.service';
import PushService from './push.service';

class NotificationService {
    private static instance: NotificationService;
    private io: Server;

    private constructor(io: Server) {
        this.io = io;
    }

    public static getInstance(io: Server): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService(io);
        }
        return NotificationService.instance;
    }

    // Créer une notification
    public async createNotification(notificationData: any): Promise<INotification> {
        const notification = new NotificationModel(notificationData);
        await notification.save();

        // Émettre un événement de notification via Socket.io
        this.io.emit('notification', notificationData);

        // Envoyer un email
        await EmailService.sendEmail(notificationData.sendTo, notificationData.title, notificationData.content);

        // Envoyer une notification push (si l'abonnement est disponible)
        if (notificationData.subscription) {
            await PushService.sendPushNotification(notificationData.subscription, {
                title: notificationData.title,
                body: notificationData.content,
            });
        }

        return notification;
    }

    // Obtenir les notifications par utilisateur
    public async getNotificationsByUserId(userId: Types.ObjectId): Promise<INotification[]> {
        return await NotificationModel.find({ sendTo: userId });
    }

    // Supprimer une notification
    public async deleteNotification(notificationId: string): Promise<INotification | null> {
        return await NotificationModel.findByIdAndDelete(notificationId);
    }
}

export default NotificationService; 