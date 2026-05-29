import express from 'express';
import { searchVideos, getVideoDetails } from '../controllers/youtubeController.js';

const router = express.Router();

// GET /api/youtube/search?query=your_search_term
router.get('/search', searchVideos);
router.get('/video-details', getVideoDetails);
export default router;