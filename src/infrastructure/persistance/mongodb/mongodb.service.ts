import mongoose from 'mongoose';

class MongoDBService {
    private static instance: MongoDBService;

    private constructor() { }

    public static getInstance(): MongoDBService {
        if (!MongoDBService.instance) {
            MongoDBService.instance = new MongoDBService();
        }
        return MongoDBService.instance;
    }

    public async connect(uri: string): Promise<void> {
        try {
            await mongoose.connect(uri);
            console.log('MongoDB Connected');
        } catch (err) {
            console.error('MongoDB connection error:', err);
            throw err; // Propager l'erreur pour la gestion ultérieure
        }
    }
}

export default MongoDBService.getInstance(); 