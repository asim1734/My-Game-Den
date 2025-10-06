const axios = require("axios");

const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID;
const IGDB_BEARER_TOKEN = process.env.IGDB_BEARER_TOKEN;
const IGDB_API_URL = "https://api.igdb.com/v4";

// --- Reusable Helper Functions ---

// Formats a single game object from IGDB into the structure our frontend needs
const mapGameData = (game) => {
    const coverUrl = game.cover
        ? `https:${game.cover.url.replace(
              /\/t_[a-zA-Z0-9_]+\//,
              "/t_cover_big/"
          )}`
        : null;
    return {
        igdbId: game.id,
        title: game.name,
        coverUrl: coverUrl,
        genres: game.genres ? game.genres.map((g) => g.name) : [],
        platforms: game.platforms ? game.platforms.map((p) => p.name) : [],
        releaseDate: game.first_release_date
            ? new Date(game.first_release_date * 1000).toISOString()
            : null,
        rating: game.total_rating,
    };
};

// Generic function to fetch and process games from the IGDB API
const fetchGamesFromIGDB = async (igdbQueryString, queryName = "Query") => {
    console.log(`--- Sending IGDB Query: ${queryName} ---`);
    console.log(igdbQueryString);

    try {
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

        console.log(`--- IGDB Response Successful: ${queryName} ---`);
        return response.data.filter((game) => game.cover).map(mapGameData);
    } catch (error) {
        console.error(`--- IGDB Request Failed: ${queryName} ---`);
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error(
                "Data:",
                JSON.stringify(error.response.data, null, 2)
            );
        } else {
            console.error("General Error Message:", error.message);
        }
        throw new Error(`Failed to fetch games for ${queryName}.`);
    }
};

// --- Specific Game List Functions ---

const getTopGames = () => {
    const queryString = `
        fields name, cover.url, genres.name, platforms.name, first_release_date, total_rating, total_rating_count;
        where category = 0 & platforms = (6,48,49,167,130,9) & total_rating_count > 500 & total_rating > 80;
        sort total_rating_count desc;
        limit 25;
    `;
    return fetchGamesFromIGDB(queryString, "Top Games");
};

const getNewReleases = () => {
    const nowTimestamp = Math.floor(Date.now() / 1000);
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const ninetyDaysAgoTimestamp = Math.floor(ninetyDaysAgo.getTime() / 1000);

    const queryString = `
        fields name, cover.url, genres.name, platforms.name, first_release_date, total_rating, total_rating_count;
        where category = 0 & platforms = (6,48,49,167,130,9) & first_release_date > ${ninetyDaysAgoTimestamp} & first_release_date <= ${nowTimestamp};
        sort first_release_date desc;
        limit 25;
    `;

    return fetchGamesFromIGDB(queryString, "New Releases");
};

const getUpcomingGames = () => {
    const nowTimestamp = Math.floor(Date.now() / 1000);
    const queryString = `fields name, cover.url, genres.name, platforms.name, first_release_date, hypes; where category = 0 & platforms = (6,48,49,167,130,9) & first_release_date > ${nowTimestamp}; sort hypes desc; limit 25;`;
    return fetchGamesFromIGDB(queryString, "Upcoming Games");
};

exports.getTopGamesController = async (req, res) => {
    try {
        const games = await getTopGames();
        res.status(200).json(games);
    } catch (error) {
        res.status(500).json({ message: "Error fetching top games." });
    }
};

exports.getNewReleasesController = async (req, res) => {
    try {
        const games = await getNewReleases();
        res.status(200).json(games);
    } catch (error) {
        res.status(500).json({ message: "Error fetching new releases." });
    }
};

exports.getUpcomingGamesController = async (req, res) => {
    try {
        const games = await getUpcomingGames();
        res.status(200).json(games);
    } catch (error) {
        res.status(500).json({ message: "Error fetching upcoming games." });
    }
};

exports.getGamesByIdsController = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!ids || ids.length === 0) {
            return res.json([]);
        }

        const idString = ids.join(",");

        const queryString = `
            fields name, cover.url, genres.name, platforms.name, first_release_date, total_rating, total_rating_count;
            where id = (${idString});
            limit ${ids.length};
        `;

        const games = await fetchGamesFromIGDB(queryString, "Games By IDs");
        res.status(200).json(games);
    } catch (error) {
        res.status(500).json({ message: "Error fetching games by IDs." });
    }
};
