import axios from "axios";
import { env } from "../../config/env";

const token = localStorage.getItem("token");

const apiUrl = env.apiUrl + "api/";

export const authenticatedApi = axios.create({
    baseURL: apiUrl,
    headers:{
        Accept: "application/json",
        Authorization: `Bearer ${token}`
    }
});

export const unAuthenticatedApi = axios.create({
    baseURL: apiUrl,
    headers: {
        Accept: "application/json",
    },
});


