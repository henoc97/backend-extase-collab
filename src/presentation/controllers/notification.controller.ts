import { Request, Response } from 'express';
import { INotification } from '../../domain/entities/notification.entity';
import { Server } from 'socket.io';
import pusService from '../../application/services/push.service'
import notificationService from '../../application/services/notification.service';

class NotificationController {

    public constructor() { }

    public createNotification = async (req: Request, res: Response): Promise<void> => {
        try {
            const notificationData: INotification = req.body;
            const notification = await notificationService.createNotification(notificationData);
            res.status(201).json(notification);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json(`Error: ${error.message}`);
            } else {
                res.status(500).json('Unknown error');
            }
        }
    }

    public subscribe = async (req: any, res: Response): Promise<void> => {
        try {
            const { subscription } = req.body;
            console.log('req.body: ', req.body);
            console.log('subscription: ', subscription);
            if (!subscription) {
                res.status(400).json({ error: 'Missing subscription' });
                return;
            }
            await pusService.saveSubscription(subscription, req.user.id);
            console.log('Subscription saved');
            res.status(201).json({ message: 'Subscribed successfully!' });
        } catch (error) {
            if (error instanceof Error) {
                console.log("error during subscription", error);
                res.status(500).json(`Error: ${error.message}`);
            } else {
                res.status(500).json('Unknown error');
            }
        }
    }

    public getNotificationsByUserId = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.params.userId;
            const notifications = await notificationService.getNotificationsByUserId(userId);
            res.status(200).json(notifications);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json(`Error: ${error.message}`);
            } else {
                res.status(500).json('Unknown error');
            }
        }
    }

    public deleteNotification = async (req: Request, res: Response): Promise<void> => {
        try {
            const notificationId = req.params.id;
            const deletedNotification = await notificationService.deleteNotification(notificationId);
            if (!deletedNotification) {
                res.status(404).json({ message: 'Notification not found' });
            }
            res.status(204).send();
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json(`Error: ${error.message}`);
            } else {
                res.status(500).json('Unknown error');
            }
        }
    }
}

export default new NotificationController(); 