import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import MongoDBService from './infrastructure/persistance/mongodb/mongodb.service';
import * as dotenv from 'dotenv';
import crewRoutes from './presentation/routes/crew.routes';
import userRoutes from './presentation/routes/user.routes';
import projectRoutes from './presentation/routes/project.routes';
import { createTaskRoutes } from './presentation/routes/task.routes';
import { createNotificationRoutes } from './presentation/routes/notification.routes';
import commentRoutes from './presentation/routes/comment.routes';
import authRoutes from './presentation/routes/auth.routes';
import passport from './application/config/passport.config';
import session from 'express-session';

dotenv.config();

const app = express();
app.use(cors({
    origin: 'http://localhost:3000', // Remplacez par votre domaine en production
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Autorisez les méthodes nécessaires
    credentials: true, // Si vous utilisez des cookies ou des sessions
}));

const PORT = process.env.PORT || 5000;

// Vérifiez que JWT_SECRET est défini
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is not defined');
}

// Middleware
app.use(express.json());
app.use(session({
    secret: jwtSecret, // Utilisez la variable vérifiée
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/extasecollabdb';
MongoDBService.connect(mongoUri)
    .then(() => {
        // Create HTTP server
        const server = http.createServer(app);
        const io = new Server(server);
        u
        // Socket.io connection
        io.on('connection', (socket) => {
            console.log('A user connected:', socket.id);

            // Handle disconnection
            socket.on('disconnect', () => {
                console.log('User disconnected:', socket.id);
            });
        });

        // Utiliser les routes
        app.use('/api/crews', crewRoutes);
        app.use('/api/users', userRoutes);
        app.use('/api/comments', commentRoutes);
        app.use('/api/projects', projectRoutes);
        app.use('/api/tasks', createTaskRoutes(io));
        app.use('/api/notifications', createNotificationRoutes(io));
        app.use('/api/auth', authRoutes);

        // Start the server
        server.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1); // Arrêter le serveur si la connexion échoue
    });