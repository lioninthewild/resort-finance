import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTransactions } from "../api/transactions";

export default function Statement() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadTransactions() {
      try {
        const data = await getTransactions();
        setTransactions(data);
      } catch (err) {
        setError("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    }
    loadTransactions();
  }, []);

  function downloadCSV() {
    const headers = ["ID", "Date", "Type", "Category", "Amount", "Payment Method", "Description"];
    const rows = transactions.map(t => [
      t.id,
      t.date,
      t.type,
      t.category,
      t.amount,
      t.payment_method || "",
      t.description || ""
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `resort_statement_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  }

  function formatAmount(amount) {
    return new Intl.NumberFormat("en-IN").format(amount);
  }

  const totalIncome = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const netBalance = totalIncome - totalExpense;

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="statement-header">
        <div>
          <h2 style={{ fontSize: "28px", marginBottom: "8px" }}>Transaction Statement</h2>
          <p style={{ color: "#666", margin: 0 }}>
            {transactions.length} transactions •{" "}
            <span className="income-text">Income: NPR {formatAmount(totalIncome)}</span> •{" "}
            <span className="expense-text">Expense: NPR {formatAmount(totalExpense)}</span> •{" "}
            <span className={netBalance >= 0 ? "income-text" : "expense-text"}>
              Net: NPR {formatAmount(netBalance)}
            </span>
          </p>
        </div>
        <button className="download-btn" onClick={downloadCSV}>
          📥 Download CSV
        </button>
      </div>

      <div className="statement-table-container">
        <table className="statement-table">
          <thead>
            <tr>
              <th>Receipt #</th>
              <th>Date</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Bill</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">No transactions found</td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr key={t.id}>
                  <td>#{t.id.toString().padStart(6, "0")}</td>
                  <td>{formatDate(t.date)}</td>
                  <td>{t.category}</td>
                  <td className={t.type === "income" ? "tx-income" : "tx-expense"}>
                    {t.type}
                  </td>
                  <td className={t.type === "income" ? "tx-income" : "tx-expense"}>
                    NPR {formatAmount(t.amount)}
                  </td>
                  <td>
                    <Link to={`/bill/${t.id}`} className="view-bill-btn">
                      View Bill
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .statement-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 24px;
        }
        
        .download-btn {
          padding: 12px 24px;
          background: #0b5fff;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          white-space: nowrap;
        }
        
        .download-btn:hover {
          background: #0a4de6;
        }
        
        .statement-table-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          overflow-x: auto;
        }
        
        .statement-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .statement-table th,
        .statement-table td {
          padding: 14px 12px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        
        .statement-table th {
          background: #f8f9fa;
          font-weight: 600;
          color: #555;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .statement-table tbody tr:hover {
          background: #fafafa;
        }
        
        .view-bill-btn {
          padding: 6px 12px;
          background: #f0f0f0;
          color: #333;
          text-decoration: none;
          border-radius: 6px;
          font-size: 13px;
          display: inline-block;
        }
        
        .view-bill-btn:hover {
          background: #e0e0e0;
        }
        
        @media (max-width: 768px) {
          .statement-header {
            flex-direction: column;
          }
          
          .download-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}