import React, { useEffect, useState } from "react";
import ChartCategory from "../components/ChartCategory";
import ChartTrend from "../components/ChartTrend";

export default function Dashboard() {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    net: 0,
    categoryBreakdown: [],
  });

  // This will run when backend is ready
  async function loadSummaryFromBackend() {
    try {
      // TODO: replace with real backend summary endpoint
      // For now using dummy fallback
      const backendAvailable = false;

      if (backendAvailable) {
        // const res = await getSummary();
        // setSummary(res);
      } else {
        // fallback dummy summary
        setSummary({
          totalIncome: 50000,
          totalExpense: 25000,
          net: 25000,
          categoryBreakdown: [
            { name: "Room", total: 30000 },
            { name: "Food & Beverage", total: 15000 },
            { name: "Utilities", total: 5000 },
          ],
        });
      }
    } catch (err) {
      console.error("Dashboard error:", err);
    }
  }

  useEffect(() => {
    loadSummaryFromBackend();
  }, []);

  return (
    <div>
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <img
          src="/logo.jpg"
          alt="logo"
          style={{ height: "50px", borderRadius: "6px" }}
        />
        <h2 style={{ fontSize: "28px" }}>Dashboard</h2>
      </div>

      {/* Summary Cards */}
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Total Income</h3>
          <p>NPR {summary.totalIncome}</p>
        </div>

        <div className="dashboard-card">
          <h3>Total Expense</h3>
          <p>NPR {summary.totalExpense}</p>
        </div>

        <div className="dashboard-card">
          <h3>Net Profit</h3>
          <p>NPR {summary.net}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="dashboard-section">
        <h3>Category Breakdown</h3>
        <div style={{ maxWidth: "400px", marginTop: "20px" }}>
          <ChartCategory />
        </div>
      </div>

      <div className="dashboard-section" style={{ marginTop: "20px" }}>
        <h3>Monthly Income vs Expense</h3>
        <div style={{ maxWidth: "600px", marginTop: "20px" }}>
          <ChartTrend />
        </div>
      </div>
    </div>
  );
}
