import emailService from '../../infrastructure/external-services/email.service';

export async function emailSwitcher(notificationData: any): Promise<void> {
    switch (notificationData.type) {
        case 'task':
            await emailService.sendTaskNotificationEmail(notificationData.emailTo, notificationData);
            break;
        case 'crew':
            await emailService.sendCrewNotificationEmail(notificationData.emailTo, notificationData);
            break;
        case 'project':
            await emailService.sendProjectNotificationEmail(notificationData.emailTo, notificationData);
            break;
        default:
            console.error('Unknown notification type:', notificationData.type);
    }
}