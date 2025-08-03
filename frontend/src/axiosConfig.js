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
