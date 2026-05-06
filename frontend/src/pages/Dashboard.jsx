import React, { useEffect, useState } from "react";
import ChartCategory from "../components/ChartCategory";
import ChartTrend from "../components/ChartTrend";
import { getSummary, getMonthlySummary, getCategoryBreakdown } from "../api/summary";

export default function Dashboard() {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    net: 0,
    categoryBreakdown: [],
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState({ income: [], expense: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadData() {
    try {
      const [summaryRes, monthlyRes, categoryRes] = await Promise.all([
        getSummary(),
        getMonthlySummary(),
        getCategoryBreakdown(),
      ]);
      setSummary({
        totalIncome: summaryRes.totalIncome || 0,
        totalExpense: summaryRes.totalExpense || 0,
        net: summaryRes.net || 0,
        categoryBreakdown: summaryRes.categoryBreakdown || [],
      });
      setMonthlyData(monthlyRes || []);
      setCategoryData(categoryRes || { income: [], expense: [] });
    } catch (err) {
      console.error("Dashboard error:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div>
        <h2 style={{ fontSize: "28px", marginBottom: "20px" }}>Dashboard</h2>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 style={{ fontSize: "28px", marginBottom: "20px" }}>Dashboard</h2>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: "28px", marginBottom: "20px" }}>Dashboard</h2>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Total Income</h3>
          <p className="income-text">NPR {summary.totalIncome.toLocaleString()}</p>
        </div>

        <div className="dashboard-card">
          <h3>Total Expense</h3>
          <p className="expense-text">NPR {summary.totalExpense.toLocaleString()}</p>
        </div>

        <div className="dashboard-card">
          <h3>Net Profit</h3>
          <p className={summary.net >= 0 ? "income-text" : "expense-text"}>
            NPR {summary.net.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="dashboard-section">
        <h3>Category Breakdown</h3>
        <div style={{ maxWidth: "400px", marginTop: "20px" }}>
          <ChartCategory data={categoryData} />
        </div>
      </div>

      <div className="dashboard-section" style={{ marginTop: "20px" }}>
        <h3>Monthly Income vs Expense</h3>
        <div style={{ maxWidth: "600px", marginTop: "20px" }}>
          <ChartTrend data={monthlyData} />
        </div>
      </div>
    </div>
  );
}