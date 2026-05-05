import apiClient from "./apiClient";

export async function getCategories() {
  const res = await apiClient.get("/categories");
  return res.data;
}
