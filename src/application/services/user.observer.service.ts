import { Server } from 'socket.io';
import { IObserver } from '../observers/observer';
import { IObserverService } from '../observers/observer.service';
import NotificationService from './notification.service';
import notificationService from './notification.service';


class UserObserverService implements IObserverService {

    private static instance: UserObserverService;

    private constructor() { }

    public static getInstance(): UserObserverService {
        if (!UserObserverService.instance) {
            UserObserverService.instance = new UserObserverService();
        }
        return UserObserverService.instance;
    }

    public notify(observers: any[], title: string, content: string): void {
        for (const observer of observers) {
            const notificationData = {
                "sendTo": observer!.id,
                "emailTo": observer.email,
                "title": title,
                "content": content
            }

            notificationService.createNotification(notificationData);
        }
    }

}

export default UserObserverService.getInstance();