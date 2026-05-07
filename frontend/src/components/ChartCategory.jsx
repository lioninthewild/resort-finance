import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

const INCOME_COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#14b8a6", "#f59e0b", "#10b981", "#06b6d4", "#f97316"];
const EXPENSE_COLORS = ["#ef4444", "#f97316", "#eab308", "#84cc16", "#06b6d4", "#a855f7", "#ec4899", "#14b8a6"];

export default function ChartCategory({ data }) {
  const hasIncomeData = data?.income?.length > 0;
  const hasExpenseData = data?.expense?.length > 0;

  const incomeChartData = hasIncomeData ? {
    labels: data.income.map(c => c.name),
    datasets: [{
      data: data.income.map(c => parseFloat(c.total) || 0),
      backgroundColor: INCOME_COLORS.slice(0, data.income.length),
    }],
  } : null;

  const expenseChartData = hasExpenseData ? {
    labels: data.expense.map(c => c.name),
    datasets: [{
      data: data.expense.map(c => parseFloat(c.total) || 0),
      backgroundColor: EXPENSE_COLORS.slice(0, data.expense.length),
    }],
  } : null;

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div className="charts-row">
      <div className="chart-container">
        <h3>Income Breakdown</h3>
        {hasIncomeData ? (
          <Doughnut data={incomeChartData} options={options} />
        ) : (
          <p className="empty-state">No income data</p>
        )}
      </div>
      <div className="chart-container">
        <h3>Expense Breakdown</h3>
        {hasExpenseData ? (
          <Doughnut data={expenseChartData} options={options} />
        ) : (
          <p className="empty-state">No expense data</p>
        )}
      </div>
    </div>
  );
}