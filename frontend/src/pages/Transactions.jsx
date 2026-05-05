import React, { useEffect, useState } from "react";
// import {
//   getCategories,
//   getTransactions,
//   addTransaction,
//   deleteTransaction,
// } from "../api/transactions"; // not used yet
// Note: these imports are placeholders until backend is ready

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);

  async function loadFromBackend() {
    try {
      const backendAvailable = false;

      if (backendAvailable) {
        /*
        const cats = await getCategories();
        const txs = await getTransactions();
        setCategories(cats);
        setTransactions(txs);
        */
      } else {
        setCategories([
          "Room",
          "Food & Beverage",
          "Salaries",
          "Maintenance",
          "TroutFish",
          "localChicken",
          "Utilities",
        ]);

        setTransactions([
          {
            id: 1,
            date: "2025-01-01",
            category: "Room",
            type: "income",
            amount: 5000,
            receipt: true,
          },
          {
            id: 2,
            date: "2025-01-02",
            category: "Salaries",
            type: "expense",
            amount: 12000,
            receipt: false,
          },
        ]);
      }
    } catch (err) {
      console.error("Transactions error:", err);
    }
  }

  useEffect(() => {
    loadFromBackend();
  }, []);

  return (
    <div>
      {/* Header */}
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
        <h2 style={{ fontSize: "28px" }}>Transactions</h2>
      </div>

      <div className="transactions-container">
        {/* Add Transaction Form */}
        <form className="tx-form">
          <h3>Add Transaction</h3>

          <label>
            Date
            <input type="date" />
          </label>

          <label>
            Amount
            <input type="number" step="0.01" />
          </label>

          <label>
            Type
            <select>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>

          <label>
            Category
            <select>
              {categories.map((c, i) => (
                <option key={i}>{c}</option>
              ))}
            </select>
          </label>

          <label>
            Payment Method
            <input type="text" placeholder="Cash, card, bank..." />
          </label>

          <label>
            Description
            <textarea rows="3"></textarea>
          </label>

          <label>
            Receipt Image
            <input type="file" accept="image/*" />
          </label>

          <button type="button">Add</button>
        </form>

        {/* Table */}
        <div className="tx-table-container">
          <h3>Recent Transactions</h3>

          <table className="tx-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Receipt</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td>{t.date}</td>
                  <td>{t.category}</td>
                  <td
                    className={t.type === "income" ? "tx-income" : "tx-expense"}
                  >
                    {t.type}
                  </td>
                  <td
                    className={t.type === "income" ? "tx-income" : "tx-expense"}
                  >
                    NPR {t.amount}
                  </td>
                  <td>{t.receipt ? <button>View</button> : "—"}</td>
                  <td>
                    <button className="tx-delete-button">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
