import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

export default function ChartTrend({ data }) {
  if (!data || data.length === 0) {
    return <p className="empty-state">No monthly data available</p>;
  }

  const labels = data.map(d => d.month);
  const incomeData = data.map(d => parseFloat(d.income) || 0);
  const expenseData = data.map(d => parseFloat(d.expense) || 0);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Income",
        data: incomeData,
        borderColor: "#2ca02c",
        backgroundColor: "#2ca02c",
        tension: 0.3,
      },
      {
        label: "Expense",
        data: expenseData,
        borderColor: "#d62728",
        backgroundColor: "#d62728",
        tension: 0.3,
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
    },
  };

  return (
    <div>
      <Line data={chartData} options={options} />
    </div>
  );
}