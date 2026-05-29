export const searchVideos = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({
                error: 'Search query is required'
            });
        }

        const apiKey = process.env.YOUTUBE_API_KEY;
        const maxResults = 10;

        // Search only embeddable videos
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&videoEmbeddable=true&maxResults=${maxResults}&key=${apiKey}`
        );

        const data = await response.json();

        if (!response.ok) {
            console.error(data);

            return res.status(response.status).json({
                error: data.error?.message || 'Failed to fetch from YouTube'
            });
        }

        const cleanResults = data.items.map(item => ({
            videoId: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail:
                item.snippet.thumbnails.high?.url ||
                item.snippet.thumbnails.medium?.url ||
                item.snippet.thumbnails.default?.url,
            channelTitle: item.snippet.channelTitle
        }));

        res.json({
            results: cleanResults
        });

    } catch (error) {
        console.error('YouTube API Error:', error);

        res.status(500).json({
            error: 'Internal server error while searching YouTube'
        });
    }
};

export const getVideoDetails = async (req, res) => {
    const { id } = req.query;
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!id) return res.status(400).json({ error: 'Video ID missing' });

    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${apiKey}`);
        const data = await response.json();

        if (!data.items || data.items.length === 0) {
            return res.status(404).json({ error: 'Video not found' });
        }

        const snippet = data.items[0].snippet;
        
        res.json({
            title: snippet.title,
            channelTitle: snippet.channelTitle,
            // We use the high-quality thumbnail for the channel
            channelThumbnail: snippet.thumbnails.high.url 
        });
    } catch (error) {
        console.error('YouTube API Error:', error);
        res.status(500).json({ error: 'Failed to fetch video details' });
    }
};