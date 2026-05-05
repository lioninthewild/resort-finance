import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

const COLORS = [
  "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
  "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"
];

export default function ChartCategory({ data }) {
  if (!data || (!data.income?.length && !data.expense?.length)) {
    return <p className="empty-state">No category data available</p>;
  }

  const allCategories = [...(data.income || []), ...(data.expense || [])];
  const labels = allCategories.map(c => c.name);
  const values = allCategories.map(c => parseFloat(c.total) || 0);

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: COLORS.slice(0, labels.length),
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
  };

  return (
    <div>
      <Doughnut data={chartData} options={options} />
    </div>
  );
}