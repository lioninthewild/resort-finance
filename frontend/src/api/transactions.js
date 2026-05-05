import apiClient from "./apiClient";

export async function getTransactions() {
  const res = await apiClient.get("/transactions");
  return res.data;
}

export async function addTransaction(formData) {
  const res = await apiClient.post("/transactions", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function deleteTransaction(id) {
  const res = await apiClient.delete(`/transactions/${id}`);
  return res.data;
}
