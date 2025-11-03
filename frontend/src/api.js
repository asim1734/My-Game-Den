import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

// --- Dashboard Fetchers ---
export const fetchTopGames = async () => {
    const { data } = await axios.get(`${API_BASE_URL}/games/top-games`);
    return data;
};

export const fetchNewReleases = async () => {
    const { data } = await axios.get(`${API_BASE_URL}/games/new-releases`);
    return data;
};

export const fetchUpcomingGames = async () => {
    const { data } = await axios.get(`${API_BASE_URL}/games/upcoming`);
    return data;
};

// --- Generic Game Data Fetcher ---
export const fetchGamesByIds = async (ids) => {
    if (!ids || ids.length === 0) return [];
    const { data } = await axios.post(`${API_BASE_URL}/games/by-ids`, { ids });
    return data;
};

// --- Generic User List Functions ---

export const getAllUserLists = async () => {
    const { data } = await axios.get(`${API_BASE_URL}/users/lists`);
    return data;
};

export const addGameToList = async ({ listName, gameId }) => {
    const { data } = await axios.post(
        `${API_BASE_URL}/users/lists/${listName}`,
        { gameId }
    );
    return data;
};

export const removeGameFromList = async ({ listName, gameId }) => {
    const { data } = await axios.delete(
        `${API_BASE_URL}/users/lists/${listName}/${gameId}`
    );
    return data;
};

export const fetchGameById = async (gameId) => {
    if (!gameId) return null;
    const { data } = await axios.get(`${API_BASE_URL}/games/${gameId}`);
    return data;
};

export const searchGames = async (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === "") {
        return [];
    }
    const { data } = await axios.get(`${API_BASE_URL}/games/search`, {
        params: { term: searchTerm },
    });
    return data;
};

export const browseGames = async (filters) => {
    const params = {
        page: filters.page,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
    };

    if (filters.genre && filters.genre.length > 0) {
        params.genre = filters.genre.join(",");
    }
    if (filters.platform && filters.platform.length > 0) {
        params.platform = filters.platform.join(",");
    }
    if (filters.minRating) {
        params.minRating = filters.minRating;
    }
    if (filters.releaseYearStart) {
        params.releaseYearStart = filters.releaseYearStart;
    }
    if (filters.releaseYearEnd) {
        params.releaseYearEnd = filters.releaseYearEnd;
    }

    const { data } = await axios.get(`${API_BASE_URL}/games/browse`, {
        params,
    });
    return data;
};
