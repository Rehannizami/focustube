import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import youtubeRoutes from './routes/youtube.js';

// 1. Initialize dotenv immediately
dotenv.config();

// 2. Debug: Check for API Key
console.log("Checking for API Key...");
if (process.env.YOUTUBE_API_KEY) {
    console.log("✅ API Key found!");
} else {
    console.error("❌ API Key NOT found in environment!");
}

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 3. Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// 4. API Routes
app.use('/api/youtube', youtubeRoutes);

// 5. Front-end Page Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));
app.get('/search', (req, res) => res.sendFile(path.join(__dirname, '../search.html')));
app.get('/player', (req, res) => res.sendFile(path.join(__dirname, '../player.html')));
app.get('/documentation', (req, res) => res.sendFile(path.join(__dirname, '../documentation.html')));

// 6. 404 Fallback
app.use((req, res) => {
    res.status(404).send('Page not found on FocusTube');
});

// 7. Server Start
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 FocusTube server is running on port ${PORT}`);
});