import axios from "axios";

export const apiClient = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
});

apiClient.interceptors.response.use((response) => {
    return response.data;
}, (error) => {
    return {
        data: null,
        message: error?.response?.data?.error ?? error.message,
        status: error?.response?.status ?? error.status
    };
});