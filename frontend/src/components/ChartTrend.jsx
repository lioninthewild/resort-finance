import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function ChartTrend({ monthData, onPrevious, onNext, canGoPrevious, canGoNext }) {
  const labels = monthData ? [monthData.month] : [];
  const incomeData = monthData ? [parseFloat(monthData.income) || 0] : [];
  const expenseData = monthData ? [parseFloat(monthData.expense) || 0] : [];

  const chartData = {
    labels,
    datasets: [
      {
        label: "Income",
        data: incomeData,
        backgroundColor: "#2ca02c",
      },
      {
        label: "Expense",
        data: expenseData,
        backgroundColor: "#d62728",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
      x: {
        barThickness: 20,
        categoryPercentage: 0.5,
        barPercentage: 0.8,
      },
    },
  };

  return (
    <div className="monthly-chart">
      <h3>Monthly Income vs Expense</h3>
      
      {monthData ? (
        <Bar data={chartData} options={options} />
      ) : (
        <p className="empty-state">No monthly data available</p>
      )}

      <div className="month-navigation">
        <button 
          onClick={onPrevious} 
          disabled={!canGoPrevious}
          className="nav-button"
        >
          ◀ Previous
        </button>
        <span className="current-month">{monthData?.month || ""}</span>
        <button 
          onClick={onNext} 
          disabled={!canGoNext}
          className="nav-button"
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}