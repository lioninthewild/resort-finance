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

export default function ChartTrend() {
  // temporary dummy data
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr"],
    datasets: [
      {
        label: "Income",
        data: [50000, 60000, 55000, 65000],
        borderColor: "#2ca02c",
        tension: 0.3,
      },
      {
        label: "Expense",
        data: [30000, 35000, 32000, 40000],
        borderColor: "#d62728",
        tension: 0.3,
      },
    ],
  };

  return (
    <div>
      <Line data={data} />
    </div>
  );
}
