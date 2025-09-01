const axios = require("axios");

const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID;
const IGDB_BEARER_TOKEN = process.env.IGDB_BEARER_TOKEN;

const IGDB_API_URL = "https://api.igdb.com/v4";

const getPopularGames = async () => {
    const threeYearsAgo = new Date();
    threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);
    const threeYearsAgoTimestamp = Math.floor(threeYearsAgo.getTime() / 1000);

    const igdbQueryString = `
        fields name, cover.url, genres.name, platforms.name, first_release_date, total_rating, total_rating_count;
        where category = 0 & platforms = (6,48,49,167,130,9) & total_rating_count > 1000 & total_rating > 80;
        sort total_rating desc;
        limit 25;
    `;

    console.log("--- Sending New 'Mixed' IGDB Query ---");
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

        console.log("--- IGDB Response Successful ---");

        const gameData = response.data
            .filter((game) => game.cover)
            .map((game) => {
                const originalCoverUrl = game.cover.url;

                const coverUrl = `https:${originalCoverUrl.replace(
                    /\/t_[a-zA-Z0-9_]+\//,
                    "/t_cover_big/"
                )}`;

                return {
                    igdbId: game.id,
                    title: game.name,
                    coverUrl: coverUrl,
                    genres: game.genres ? game.genres.map((g) => g.name) : [],
                    platforms: game.platforms
                        ? game.platforms.map((p) => p.name)
                        : [],
                    releaseDate: game.first_release_date
                        ? new Date(game.first_release_date * 1000).toISOString()
                        : null,
                    // We'll use total_rating now for display, as it's more holistic
                    rating: game.total_rating,
                };
            });

        return gameData;
    } catch (error) {
        console.error("--- IGDB Request Failed ---");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error(
                "Data:",
                JSON.stringify(error.response.data, null, 2)
            );
        } else {
            console.error("General Error Message:", error.message);
        }
        throw new Error("Failed to fetch top games.");
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
