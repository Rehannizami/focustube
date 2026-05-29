import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import youtubeRoutes from './routes/youtube.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/api', youtubeRoutes);
app.use(cors()); 
app.use(express.json()); 

app.use(express.static(path.join(__dirname, '../')));

// ---------------------------------------------------------
// API Routes (Connected)
// ---------------------------------------------------------
app.use('/api/youtube', youtubeRoutes);

// ---------------------------------------------------------
// Front-end Page Routes
// ---------------------------------------------------------
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname, '../search.html'));
});

app.get('/player', (req, res) => {
    res.sendFile(path.join(__dirname, '../player.html'));
});

// THIS EXACT BLOCK MUST EXIST:
app.get('/documentation', (req, res) => {
    res.sendFile(path.join(__dirname, '../documentation.html'));
});

// The 404 Fallback that you are currently seeing
app.use((req, res) => {
    res.status(404).send('Page not found on FocusTube');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 FocusTube server is running on port ${PORT}`);
});