import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("x-auth-token");
        if (token) {
            config.headers["x-auth-token"] = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("x-auth-token");
            localStorage.removeItem("username");
            window.dispatchEvent(new Event("force-logout"));
        }
        return Promise.reject(error);
    }
);

// --- Dashboard Fetchers ---
export const fetchTopGames = async () => {
    const { data } = await api.get(`/games/top-games`);
    return data;
};

export const fetchNewReleases = async () => {
    const { data } = await api.get(`/games/new-releases`);
    return data;
};

export const fetchUpcomingGames = async () => {
    const { data } = await api.get(`/games/upcoming`);
    return data;
};

// --- Generic Game Data Fetcher ---
export const fetchGamesByIds = async (ids) => {
    if (!ids || ids.length === 0) return [];
    const { data } = await api.post(`/games/by-ids`, { ids });
    return data;
};

// --- Generic User List Functions ---
export const getAllUserLists = async () => {
    const { data } = await api.get(`/users/lists`);
    return data;
};

// --- List Management ---
export const createList = async (listName) => {
    const { data } = await api.post(`/users/lists`, {
        name: listName,
    });
    return data;
};

export const renameList = async (listName, newName) => {
    const { data } = await api.put(`/users/lists/${listName}`, { newName });
    return data;
};

export const deleteList = async (listName) => {
    const { data } = await api.delete(`/users/lists/${listName}`);
    return data;
};

// --- Game-in-List Management ---
export const addGameToList = async ({ listName, gameId }) => {
    const { data } = await api.post(`/users/lists/${listName}/games`, { gameId });
    return data;
};

export const removeGameFromList = async ({ listName, gameId }) => {
    const { data } = await api.delete(`/users/lists/${listName}/games/${gameId}`);
    return data;
};

// --- Other Game Fetchers ---
export const fetchGameById = async (gameId) => {
    if (!gameId) return null;
    const { data } = await api.get(`/games/${gameId}`);
    return data;
};

export const searchGames = async (searchTerm, filters = {}) => {
    if (!searchTerm || searchTerm.trim() === "") return [];
    
    const params = { 
        term: searchTerm,
        ...filters 
    };

    const { data } = await api.get(`/games/search`, { params });
    return data;
};

export const browseGames = async (filters) => {
    const params = {
        page: filters.page,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
    };

    if (filters.genre?.length > 0) params.genre = filters.genre.join(",");
    if (filters.platform?.length > 0) params.platform = filters.platform.join(",");
    if (filters.minRating) params.minRating = filters.minRating;
    if (filters.releaseYearStart) params.releaseYearStart = filters.releaseYearStart;
    if (filters.releaseYearEnd) params.releaseYearEnd = filters.releaseYearEnd;

    const { data } = await api.get(`/games/browse`, { params });
    return data;
};

export const fetchUserReviewForGame = async (gameId) => {
    const { data } = await api.get(`/reviews/game/${gameId}`);
    return data;
};

export const submitReview = async (reviewData) => {
    const { data } = await api.post(`/reviews`, reviewData);
    return data;
};

export const deleteReview = async (gameId) => {
    const { data } = await api.delete(`/reviews/game/${gameId}`);
    return data;
};

export const getMyReviews = async () => {
    const { data } = await api.get(`/reviews/my-reviews`);
    return data;
};

export const fetchCommunityReviewsForGame = async (gameId) => {
    const { data } = await api.get(`/reviews/community/${gameId}`);
    return data;
};

export default api;