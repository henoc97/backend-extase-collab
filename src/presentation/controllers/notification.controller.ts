import { Request, Response } from 'express';
import NotificationService from '../../application/services/notification.service';
import { INotification } from '../../domain/entities/notification.entity';
import { Server } from 'socket.io';


class NotificationController {
    private notificationService: NotificationService;

    public constructor(io: Server) {
        this.notificationService = NotificationService.getInstance(io);
    }

    public createNotification = async (req: Request, res: Response): Promise<void> => {
        try {
            const notificationData: INotification = req.body;
            const notification = await this.notificationService.createNotification(notificationData);
            res.status(201).json(notification);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json(`Error: ${error.message}`);
            } else {
                res.status(500).json('Unknown error');
            }
        }
    }

    public getNotificationsByUserId = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.params.userId;
            const notifications = await this.notificationService.getNotificationsByUserId(userId);
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
            const deletedNotification = await this.notificationService.deleteNotification(notificationId);
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

export default NotificationController; 