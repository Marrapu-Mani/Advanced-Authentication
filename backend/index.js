import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

import { connectDB } from './db/connectDB.js';
import authRoutes from '../backend/routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use(express.json());        // Middleware to parse JSON bodies
app.use(cookieParser());        // Middleware to parse cookies

app.use('/auth', authRoutes);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, '/frontend/dist')));    // tells the Express server to serve the files located in the /frontend/dist directory as static assets

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    })
}

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});