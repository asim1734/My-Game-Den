const axios = require("axios");

const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID;
const IGDB_BEARER_TOKEN = process.env.IGDB_BEARER_TOKEN;
const IGDB_API_URL = "https://api.igdb.com/v4";

// --- Reusable Helper Functions ---

const mapGameData = (rawGame) => {
    // This helper maps a single raw game object to our desired frontend format
    const coverUrl = rawGame.cover
        ? `https:${rawGame.cover.url.replace(
              /\/t_[a-zA-Z0-9_]+\//,
              "/t_cover_big/"
          )}`
        : null;
    const screenshots = rawGame.screenshots
        ? rawGame.screenshots.map(
              (ss) =>
                  `https:${ss.url.replace(
                      /\/t_[a-zA-Z0-9_]+\//,
                      "/t_screenshot_big/"
                  )}`
          )
        : [];

    return {
        igdbId: rawGame.id,
        title: rawGame.name,
        coverUrl,
        screenshots,
        summary: rawGame.summary,
        genres: rawGame.genres ? rawGame.genres.map((g) => g.name) : [],
        platforms: rawGame.platforms
            ? rawGame.platforms.map((p) => p.name)
            : [],
        releaseDate: rawGame.first_release_date
            ? new Date(rawGame.first_release_date * 1000).toISOString()
            : null,
        rating: rawGame.total_rating,
        videos: rawGame.videos ? rawGame.videos.map((v) => v.video_id) : [],
        websites: rawGame.websites || [],
    };
};

const fetchFromIGDB = async (
    endpoint,
    igdbQueryString,
    queryName = "Query"
) => {
    try {
        const response = await axios.post(
            `${IGDB_API_URL}/${endpoint}`,
            igdbQueryString,
            {
                headers: {
                    "Client-ID": IGDB_CLIENT_ID,
                    Authorization: `Bearer ${IGDB_BEARER_TOKEN}`,
                    Accept: "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error(
            `--- IGDB Request Failed: ${queryName} ---`,
            error.response ? error.response.data : error.message
        );
        throw new Error(`Failed to fetch data for ${queryName}.`);
    }
};

// --- Exported Controller Functions ---

exports.getTopGames = async (req, res) => {
    try {
        const queryString = `
            fields name, cover.url, genres.name, platforms.name, first_release_date, total_rating, total_rating_count;
            where total_rating_count > 2000;
            sort total_rating desc;
            limit 25;
        `;
        const rawGames = await fetchFromIGDB("games", queryString, "Top Games");
        res.status(200).json(rawGames.filter((g) => g.cover).map(mapGameData));
    } catch (error) {
        res.status(500).json({ message: "Error fetching top games." });
    }
};

exports.getNewReleases = async (req, res) => {
    try {
        const nowTimestamp = Math.floor(Date.now() / 1000);
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        const ninetyDaysAgoTimestamp = Math.floor(
            ninetyDaysAgo.getTime() / 1000
        );
        const queryString = `fields name, cover.url, genres.name, platforms.name, first_release_date, total_rating, total_rating_count; where platforms = (6,48,49,167,130,9) & first_release_date > ${ninetyDaysAgoTimestamp} & first_release_date <= ${nowTimestamp}; sort first_release_date desc; limit 25;`;
        const rawGames = await fetchFromIGDB(
            "games",
            queryString,
            "New Releases"
        );
        res.status(200).json(rawGames.filter((g) => g.cover).map(mapGameData));
    } catch (error) {
        res.status(500).json({ message: "Error fetching new releases." });
    }
};

exports.getUpcomingGames = async (req, res) => {
    try {
        const nowTimestamp = Math.floor(Date.now() / 1000);
        const queryString = `fields name, cover.url, genres.name, platforms.name, first_release_date, hypes; where platforms = (6,48,49,167,130,9) & first_release_date > ${nowTimestamp}; sort hypes desc; limit 25;`;
        const rawGames = await fetchFromIGDB(
            "games",
            queryString,
            "Upcoming Games"
        );
        res.status(200).json(rawGames.filter((g) => g.cover).map(mapGameData));
    } catch (error) {
        res.status(500).json({ message: "Error fetching upcoming games." });
    }
};

exports.getGamesByIds = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || ids.length === 0) {
            return res.json([]);
        }
        const idString = ids.join(",");
        const queryString = `fields name, cover.url, genres.name, platforms.name, first_release_date, total_rating; where id = (${idString}); limit ${ids.length};`;
        const rawGames = await fetchFromIGDB(
            "games",
            queryString,
            "Games By IDs"
        );
        res.status(200).json(rawGames.map(mapGameData));
    } catch (error) {
        res.status(500).json({ message: "Error fetching games by IDs." });
    }
};

exports.getGameById = async (req, res) => {
    try {
        const { id } = req.params;
        const queryString = `fields name, cover.url, genres.name, platforms.name, first_release_date, total_rating, summary, videos.video_id, screenshots.url, websites.*, involved_companies.company.name, player_perspectives.name, game_modes.name; where id = ${id};`;

        const rawGames = await fetchFromIGDB(
            "games",
            queryString,
            "Single Game"
        );

        if (rawGames.length === 0) {
            return res.status(404).json({ message: "Game not found." });
        }

        // Expanded mapping for the new data
        const game = rawGames[0];
        const detailedGame = {
            ...mapGameData(game), // Uses your existing simple mapper
            summary: game.summary,
            screenshots: game.screenshots
                ? game.screenshots.map(
                      (ss) =>
                          `https:${ss.url.replace(
                              /\/t_[a-zA-Z0-9_]+\//,
                              "/t_screenshot_big/"
                          )}`
                  )
                : [],
            videos: game.videos ? game.videos.map((v) => v.video_id) : [],
            websites: game.websites || [],
            developers:
                game.involved_companies
                    ?.filter((c) => c.developer)
                    .map((c) => c.company.name) || [],
            perspectives: game.player_perspectives?.map((p) => p.name) || [],
            gameModes: game.game_modes?.map((m) => m.name) || [],
        };

        res.status(200).json(detailedGame);
    } catch (error) {
        res.status(500).json({ message: "Error fetching game details." });
    }
};

exports.searchGames = async (req, res) => {
    try {
        const { 
            term, 
            sortBy = "total_rating_count", 
            sortOrder = "desc", 
            page = 1 
        } = req.query;

        if (!term) return res.status(400).json({ message: "Search term is required." });

        const whereClauses = [
            `name ~ *"${term}"*`, 
            `game_type = (0, 8, 11)`, 
            `cover != null`,
            `total_rating_count != null` 
        ];

        const whereString = whereClauses.join(" & ");
        const limit = 24;
const offset = (parseInt(page) - 1) * limit;

const queryString = `
    fields name, cover.url, first_release_date, total_rating, total_rating_count, game_type;
    where ${whereString};
    sort ${sortBy} ${sortOrder};
    limit ${limit};
    offset ${offset}; 
`;

        const rawGames = await fetchFromIGDB("games", queryString, `Sorted Search: ${term}`);
        res.status(200).json(rawGames.map(mapGameData));
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ message: "Error searching games." });
    }
};

exports.browseGames = async (req, res) => {
    try {
        // --- Extract Filters & Sorting ---
        const {
            genre,
            platform,
            sortBy = "total_rating_count",
            sortOrder = "desc",
            releaseYearStart,
            releaseYearEnd,
            minRating,
            page = 1,
            limit = 25,
        } = req.query;
        console.log(req.query);
        let whereClauses = ["cover != null"];

        // Genre Filter
        if (genre) {
            const genreMap = {
                Fighting: 4,
                Shooter: 5,
                Music: 7,
                Platform: 8,
                Puzzle: 9,
                Racing: 10,
                RTS: 11, // Real Time Strategy
                RPG: 12, // Role-playing (RPG)
                Simulator: 13,
                Sport: 14,
                Strategy: 15,
                TBS: 16, // Turn-based strategy
                Tactical: 24,
                "Hack and slash": 25,
                Adventure: 31,
                Indie: 32,
                Arcade: 33,
                "Visual Novel": 34,
                "Card & Board Game": 35,
                MOBA: 36,
            };
            const genreIds = genre
                .split(",")
                .map((name) => genreMap[name])
                .filter((id) => id);
            if (genreIds.length > 0) {
                whereClauses.push(`genres = (${genreIds.join(",")})`);
            }
        }

        // Platform Filter
        if (platform) {
            const platformMap = {
                PC: 6,
                PS4: 48,
                PS3: 9,
                "Xbox One": 49,
                "Xbox 360": 12,
                Switch: 130,
                Android: 34,
                iOS: 39,
                Mac: 14,
                Linux: 3,
                Playstation: 7,
                Xbox: 11,
                PS5: 167,
            };
            const platformIds = platform
                .split(",")
                .map((name) => platformMap[name])
                .filter((id) => id);
            if (platformIds.length > 0) {
                whereClauses.push(`platforms = (${platformIds.join(",")})`);
            }
        }

        // Release Date Range Filter (validate inputs)
        const startYear = parseInt(releaseYearStart);
        if (!isNaN(startYear) && startYear > 1970) {
            const startTimestamp = Math.floor(
                new Date(`${startYear}-01-01`).getTime() / 1000
            );
            whereClauses.push(`first_release_date >= ${startTimestamp}`);
        }
        const endYear = parseInt(releaseYearEnd);
        if (!isNaN(endYear) && endYear <= new Date().getFullYear() + 5) {
            const endTimestamp = Math.floor(
                new Date(`${endYear}-12-31`).getTime() / 1000
            );
            whereClauses.push(`first_release_date <= ${endTimestamp}`);
        }

        // Minimum Rating Filter (validate input)
        const ratingNum = parseInt(minRating);
        if (!isNaN(ratingNum) && ratingNum >= 0 && ratingNum <= 100) {
            whereClauses.push(`total_rating >= ${ratingNum}`);
        }

        const whereString = whereClauses.join(" & ");

        // --- Build SORT Clause (with validation) ---
        const allowedSortFields = [
            "name",
            "total_rating",
            "total_rating_count",
            "first_release_date",
            "hypes",
        ];
        const validSortBy = allowedSortFields.includes(sortBy)
            ? sortBy
            : "total_rating_count";
        const validSortOrder = sortOrder === "asc" ? "asc" : "desc";
        const sortString = `${validSortBy} ${validSortOrder}`;

        // --- Build Pagination (ensure numbers) ---
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 25;
        const offset = (pageNum - 1) * limitNum;

        // --- Construct Final Query ---
        const queryString = `
            fields name, cover.url, first_release_date, total_rating, genres.name, platforms.name;
            where ${whereString};
            sort ${sortString};
            limit ${limitNum};
            offset ${offset};
        `; // Ensure semicolon at the end

        console.log(
            "Sending Browse Query:",
            queryString.replace(/\s+/g, " ").trim()
        );

        const rawGames = await fetchFromIGDB(
            "games",
            queryString,
            "Browse Games"
        );

        res.status(200).json(rawGames.map(mapGameData));
    } catch (error) {
        console.error("Error details in browseGames:", error);
        res.status(500).json({ message: "Error browsing games." });
    }
};
