import axios from "axios";

axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("x-auth-token");
        if (token) {
            config.headers["x-auth-token"] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("x-auth-token");
            localStorage.removeItem("username");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);
