// src/api.js
import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

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
