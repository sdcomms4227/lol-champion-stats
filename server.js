require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Cache for champion data
let championData = null;

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

// Get champion list
app.get('/api/champions', async (req, res) => {
    try {
        const response = await axios.get('https://ddragon.leagueoflegends.com/cdn/13.24.1/data/ko_KR/champion.json');
        championData = response.data.data; // Cache the champion data
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching champions:', error);
        res.status(500).json({ error: 'Failed to fetch champions' });
    }
});

// Get champion details
app.get('/api/champions/:championId', async (req, res) => {
    try {
        const { championId } = req.params;
        const response = await axios.get(`https://ddragon.leagueoflegends.com/cdn/13.24.1/data/ko_KR/champion/${championId}.json`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching champion details:', error);
        res.status(500).json({ error: 'Failed to fetch champion details' });
    }
});

// Handle 404
app.use((req, res) => {
    res.status(404).send('Not Found');
});

// Handle errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app; 