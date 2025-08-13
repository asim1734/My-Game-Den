const axios = require("axios");

const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID;
const IGDB_BEARER_TOKEN = process.env.IGDB_BEARER_TOKEN;

const IGDB_API_URL = "https://api.igdb.com/v4";

const getPopularGames = async () => {
    try {
        const igdbQueryString = `
            fields name, cover.url, genres.name, platforms.name, first_release_date, aggregated_rating;
            sort aggregated_rating desc; 
            where platforms = (6,48,49,167,130,9) & aggregated_rating > 80;
            limit 20; 
        `;

        const response = await axios.post(
            `${IGDB_API_URL}/games`,
            igdbQueryString,
            {
                headers: {
                    "Client-ID": IGDB_CLIENT_ID,
                    Authorization: `Bearer ${IGDB_BEARER_TOKEN}`,
                    Accept: "application/json",
                },
            }
        );

        const gameData = response.data.map((game) => ({
            igdbId: game.id,
            title: game.name,
            coverUrl: game.cover ? `https:${game.cover.url}` : null,
            genres: game.genres ? game.genres.map((g) => g.name) : [],
            platforms: game.platforms ? game.platforms.map((p) => p.name) : [],
            releaseDate: game.first_release_date
                ? new Date(game.first_release_date * 1000).toISOString()
                : null,
            rating: game.aggregated_rating,
        }));

        return gameData;
    } catch (error) {
        console.error(
            "Error fetching popular games from IGDB:",
            error.response ? error.response.data : error.message
        );
        throw new Error("Failed to fetch popular games.");
    }
};

exports.getDefaultGames = async (req, res) => {
    try {
        const popularGames = await getPopularGames();

        const defaultGames = {
            popularGames,
        };

        res.status(200).json(defaultGames);
    } catch (error) {
        res.status(500).json({ message: "Error fetching default games." });
    }
};
