const ENV_API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

const API_BASE_URL = ENV_API_BASE_URL || "/api";

export default API_BASE_URL;
