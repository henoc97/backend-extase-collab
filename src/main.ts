import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import MongoDBService from './infrastructure/persistance/mongodb/mongodb.service';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(express.json());

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI as string
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

        // Sample route
        app.get('/', (req, res) => {
            res.send('Hello, World!');
        });

        // Start the server
        server.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1); // Arrêter le serveur si la connexion échoue
    });