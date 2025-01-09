import { Router } from 'express';
import authenticateToken from '../../application/middlewares/auth';
import notificationController from '../controllers/notification.controller';


const router = Router();
router.use(authenticateToken)


router.post('/', notificationController.createNotification);
router.post('/push-subscription', notificationController.subscribe);
router.get('/user/:userId', notificationController.getNotificationsByUserId);
router.delete('/:id', notificationController.deleteNotification);


export default router;