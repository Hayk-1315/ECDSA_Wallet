import axios from "axios";

const server = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3042/api",
});

export default server;
