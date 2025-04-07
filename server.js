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
        championData = response.data.data;
        
        // Transform data to match v0 structure
        const transformedData = Object.entries(championData).map(([id, data]) => ({
            id,
            key: data.key,
            name: data.name,
            title: data.title,
            blurb: data.blurb,
            info: data.info,
            tags: data.tags,
            image: {
                full: data.image.full,
                sprite: data.image.sprite,
                group: data.image.group,
                x: data.image.x,
                y: data.image.y,
                w: data.image.w,
                h: data.image.h
            }
        }));
        
        res.json(transformedData);
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
        const champion = response.data.data[championId];
        
        // Transform data to match v0 structure
        const transformedData = {
            id: champion.id,
            key: champion.key,
            name: champion.name,
            title: champion.title,
            lore: champion.lore,
            blurb: champion.blurb,
            info: champion.info,
            tags: champion.tags,
            image: {
                full: champion.image.full,
                sprite: champion.image.sprite,
                group: champion.image.group,
                x: champion.image.x,
                y: champion.image.y,
                w: champion.image.w,
                h: champion.image.h
            },
            stats: champion.stats,
            spells: champion.spells.map(spell => ({
                id: spell.id,
                name: spell.name,
                description: spell.description,
                tooltip: spell.tooltip,
                cooldown: spell.cooldown,
                cost: spell.cost,
                image: {
                    full: spell.image.full,
                    sprite: spell.image.sprite,
                    group: spell.image.group,
                    x: spell.image.x,
                    y: spell.image.y,
                    w: spell.image.w,
                    h: spell.image.h
                }
            })),
            passive: {
                name: champion.passive.name,
                description: champion.passive.description,
                image: {
                    full: champion.passive.image.full,
                    sprite: champion.passive.image.sprite,
                    group: champion.passive.image.group,
                    x: champion.passive.image.x,
                    y: champion.passive.image.y,
                    w: champion.passive.w,
                    h: champion.passive.h
                }
            }
        };
        
        res.json(transformedData);
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