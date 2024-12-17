// src/services/apiService.ts
import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";

// Define the types for the request payloads
interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface LoginData {
  username: string;
  password: string;
}

interface PlaylistData {
  playlistName: string;
  description: string;
  singerName: string;
  userId: string
}

interface ApiResponse<T> {
  token(arg0: string, token: any): unknown;
  data: T;
  message: string;
  status: string;
}

// Base URL for the API
// const API_BASE_URL = "http://localhost:5000/api";
const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;
console.log("Secret Key:", API_BASE_URL);

// Create an Axios instance with the base URL and default headers
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to get the JWT token from localStorage
const getToken = (): string | null => {
  return localStorage.getItem("token"); // Replace with your token retrieval logic if needed
};

// Add a request interceptor to include the token in the Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle API responses (optional, useful for logging or error handling)
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // You can handle specific errors like 401 (unauthorized) here
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized! Please log in again.");
    }
    return Promise.reject(error);
  }
);

// API methods for login and register
export const register = async (registerData: { name: string; email: string; password: string; }): Promise<ApiResponse<any>> => {
  try {
    const response: AxiosResponse<ApiResponse<any>> = await apiClient.post("/auth/register", registerData);
    return response.data; // Return the API response data
  } catch (error: any) {
    throw error; // Throw error to be handled by the caller
  }
};

export const login = async (loginData: { email: string; password: string; }): Promise<ApiResponse<any>> => {
  try {
    const response: AxiosResponse<ApiResponse<any>> = await apiClient.post("/auth/login", loginData);
    return response.data; // Return the API response data
  } catch (error: any) {
    throw error; // Throw error to be handled by the caller
  }
};


export const createPlaylist = async (playlistData: PlaylistData): Promise<ApiResponse<any>> => {
  try {
    const response: AxiosResponse<ApiResponse<any>> = await apiClient.post("/playlists/addPlaylist", playlistData);
    return response.data; // Return the API response data
  } catch (error: any) {
    throw error; // Throw error to be handled by the caller
  }
};

export const getPlaylistsByUserId = async (userId: string): Promise<ApiResponse<any>> => {
  try {
    const response: AxiosResponse<ApiResponse<any>> = await apiClient.get(`/playlists/getUserPlaylists?userId=${userId}`);
    return response.data; // Return the API response data
  } catch (error: any) {
    throw error; // Throw error to be handled by the caller
  }
};

export const deletePlaylistById = async (playlistId: string, userId: string): Promise<ApiResponse<any>> => {
  try {
    const response: AxiosResponse<ApiResponse<any>> = await apiClient.delete(`/playlists/deletePlaylist/${playlistId}?userId=${userId}`);

    return response.data; // Return the API response data
  } catch (error: any) {
    throw error; // Throw error to be handled by the caller
  }
};


export const getSearchResults = async (query: string, userId: string) => {
  try {
    const response: AxiosResponse<any> = await apiClient.get(`/playlists/search`, {
      params: { query, userId }, // Send the query and userId as parameters
    });

    return response.data; // Return the response data
  } catch (error: any) {
    throw error; // Throw error to be handled by the caller
  }
};