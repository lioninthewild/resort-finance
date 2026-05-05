import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

export default function ChartCategory() {
  // temporary dummy data
  const data = {
    labels: ["Room", "Food & Beverage", "Utilities", "Salaries"],
    datasets: [
      {
        data: [40000, 25000, 8000, 15000],
        backgroundColor: ["#1f77b4", "#ff7f0e", "#7f7f7f", "#d62728"],
      },
    ],
  };

  return (
    <div>
      <Doughnut data={data} />
    </div>
  );
}
