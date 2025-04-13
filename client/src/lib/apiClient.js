import axios from "axios";

const HOST = import.meta.env.VITE_SERVER_URL;

export const apiClient = axios.create({
    baseURL : HOST,
})
