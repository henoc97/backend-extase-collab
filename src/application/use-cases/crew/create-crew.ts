import express from 'express';
import mongoose from 'mongoose';

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mydatabase')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Sample route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
