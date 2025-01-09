import { Server } from 'socket.io';

class SocketService {
    // private static instance: SocketService;
    private static io: Server;

    // public static getInstance(): SocketService {
    //     if (!SocketService.instance) {
    //         SocketService.instance = new SocketService();
    //     }
    //     return SocketService.instance;
    // }

    static initialize(io: Server) {
        SocketService.io = io;
    }

    static getIO() {
        return SocketService.io;
    }

    static sendNotification(userId: string, message: string) {
        SocketService.io.to(userId).emit('notification', message);
    }
}

export default SocketService;


// Dans vos autres services
// SocketService.sendNotification(userId, 'Nouvelle notification');
