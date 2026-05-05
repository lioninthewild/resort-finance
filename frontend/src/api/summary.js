import apiClient from "./apiClient";

export async function getSummary() {
  const res = await apiClient.get("/summary");
  return res.data;
}

export async function getMonthlySummary() {
  const res = await apiClient.get("/summary/monthly");
  return res.data;
}

export async function getCategoryBreakdown() {
  const res = await apiClient.get("/summary/by-category");
  return res.data;
}

export async function getSummaryByDateRange(startDate, endDate) {
  const res = await apiClient.get(`/summary/date-range?start_date=${startDate}&end_date=${endDate}`);
  return res.data;
}