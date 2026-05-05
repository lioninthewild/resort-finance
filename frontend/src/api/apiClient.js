import axios from "axios";

// Backend URL (temporary)
const API_BASE = "http://localhost:5000/api";

// For authenticated owner-only endpoints
const OWNER_TOKEN = "dev-owner-token"; // replace later in backend

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    "x-owner-token": OWNER_TOKEN,
  },
});

export default apiClient;
