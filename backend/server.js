import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import profileRoutes
from "./src/routes/profileRoutes.js";
dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: '*' })); // tighten later
app.use(express.json());
app.use(
   "/api/profile",
   profileRoutes
);

app.use('/api/auth', authRoutes);

app.get('/', (_, res) => res.send('API running 🚀'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
