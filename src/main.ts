import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import MongoDBService from './infrastructure/persistance/mongodb/mongodb.service';
import * as dotenv from 'dotenv';
import crewRoutes from './presentation/routes/crew.routes';
import userRoutes from './presentation/routes/user.routes';
import projectRoutes from './presentation/routes/project.routes';
import taskRoutes from './presentation/routes/task.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/extasecollabdb';
MongoDBService.connect(mongoUri)
    .then(() => {
        // Create HTTP server
        const server = http.createServer(app);
        const io = new Server(server);

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
        app.use('/api/projects', projectRoutes);
        app.use('/api/tasks', taskRoutes);

        // Start the server
        server.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1); // Arrêter le serveur si la connexion échoue
    });