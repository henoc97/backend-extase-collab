import { Router } from 'express';
import { Server } from 'socket.io';
import NotificationController from '../controllers/notification.controller';
import authenticateToken from '../../application/middlewares/auth';


const router = Router();

export const createNotificationRoutes = (io: Server) => {
    const notificationController = new NotificationController(io);
    router.use(authenticateToken)


    router.post('/', notificationController.createNotification);
    router.post('/push-subscription', notificationController.subscribe);
    router.get('/user/:userId', notificationController.getNotificationsByUserId);
    router.delete('/:id', notificationController.deleteNotification);

    return router;
}

export default createNotificationRoutes;