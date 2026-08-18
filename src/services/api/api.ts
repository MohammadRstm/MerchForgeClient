import axios from "axios";
import { env } from "../../config/env";

const apiUrl = env.apiUrl + "api/";

export const authenticatedApi = axios.create({
    baseURL: apiUrl,
    headers:{
        Accept: "application/json",
    }
});

export const unAuthenticatedApi = axios.create({
    baseURL: apiUrl,
    headers: {
        Accept: "application/json",
    },
});


