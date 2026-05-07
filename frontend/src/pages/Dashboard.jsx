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
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);

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
      const sortedData = monthlyRes || [];
      setMonthlyData(sortedData);
      // Start at most recent month (last index)
      setCurrentMonthIndex(sortedData.length > 0 ? sortedData.length - 1 : 0);
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

  function goToPreviousMonth() {
    if (currentMonthIndex > 0) {
      setCurrentMonthIndex(currentMonthIndex - 1);
    }
  }

  function goToNextMonth() {
    if (currentMonthIndex < monthlyData.length - 1) {
      setCurrentMonthIndex(currentMonthIndex + 1);
    }
  }

  const currentMonthData = monthlyData[currentMonthIndex] || null;

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
        <ChartCategory data={categoryData} />
      </div>

      <div className="dashboard-section" style={{ marginTop: "20px" }}>
        <ChartTrend 
          monthData={currentMonthData}
          onPrevious={goToPreviousMonth}
          onNext={goToNextMonth}
          canGoPrevious={currentMonthIndex > 0}
          canGoNext={currentMonthIndex < monthlyData.length - 1}
        />
      </div>
    </div>
  );
}