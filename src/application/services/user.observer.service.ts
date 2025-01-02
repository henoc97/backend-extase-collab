import { Server } from 'socket.io';
import { IObserver } from '../observers/observer';
import { IObserverService } from '../observers/observer.service';
import NotificationService from './notification.service';


class UserObserverService implements IObserverService {

    private static instance: UserObserverService;
    private notificationService: NotificationService;

    private constructor(io: Server) {
        this.notificationService = NotificationService.getInstance(io);
    }

    public static getInstance(io: Server): UserObserverService {
        if (!UserObserverService.instance) {
            UserObserverService.instance = new UserObserverService(io);
        }
        return UserObserverService.instance;
    }

    public notify(observers: any[], title: string, content: string): void {
        for (const observer of observers) {
            const notificationData = {
                "receiverId": observer.id,
                "sendTo": observer.email,
                "title": title,
                "content": content
            }

            this.notificationService.createNotification(notificationData);
        }
    }

}

export default UserObserverService;