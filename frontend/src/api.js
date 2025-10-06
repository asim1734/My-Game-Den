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

// --- Collection Fetchers ---
export const getCollectionIds = async () => {
    // Your Axios interceptor will handle the auth token.
    const { data } = await axios.get(`${API_BASE_URL}/users/collection`);
    return data;
};

export const fetchGamesByIds = async (ids) => {
    if (!ids || ids.length === 0) return [];
    const { data } = await axios.post(`${API_BASE_URL}/games/by-ids`, { ids });
    return data;
};

// --- Collection Mutators ---
export const addToCollection = async (gameId) => {
    const { data } = await axios.post(`${API_BASE_URL}/users/collection`, {
        gameId,
    });
    return data;
};

export const removeFromCollection = async (gameId) => {
    const { data } = await axios.delete(
        `${API_BASE_URL}/users/collection/${gameId}`
    );
    return data;
};
