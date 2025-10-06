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
