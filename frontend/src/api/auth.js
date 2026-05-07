import apiClient from "./apiClient";

export async function login(password) {
  const res = await apiClient.post("/auth/login", { password });
  return res.data;
}

export async function verifyToken() {
  const res = await apiClient.get("/auth/verify");
  return res.data;
}