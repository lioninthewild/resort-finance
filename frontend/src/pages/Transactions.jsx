import React, { useEffect, useState } from "react";
import {
  getCategories,
  getTransactions,
  addTransaction,
  deleteTransaction,
} from "../api/transactions";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    amount: "",
    type: "income",
    category_id: "",
    payment_method: "",
    description: "",
  });

  async function loadFromBackend() {
    try {
      const [cats, txs] = await Promise.all([
        getCategories(),
        getTransactions(),
      ]);
      setCategories(cats);
      setTransactions(txs);
      if (cats.length > 0) {
        setFormData((prev) => ({ ...prev, category_id: cats[0].id }));
      }
    } catch (err) {
      console.error("Transactions error:", err);
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFromBackend();
  }, []);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append("date", formData.date);
      payload.append("amount", formData.amount);
      payload.append("type", formData.type);
      payload.append("category_id", formData.category_id);
      payload.append("payment_method", formData.payment_method);
      payload.append("description", formData.description);

      await addTransaction(payload);
      await loadFromBackend();
      setFormData({
        date: new Date().toISOString().split("T")[0],
        amount: "",
        type: "income",
        category_id: categories[0]?.id || "",
        payment_method: "",
        description: "",
      });
    } catch (err) {
      console.error("Add transaction error:", err);
      setError("Failed to add transaction");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this transaction?")) return;
    try {
      await deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete transaction");
    }
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <img
          src="/logo.jpeg"
          alt="logo"
          style={{ height: "50px", borderRadius: "6px" }}
        />
        <h2 style={{ fontSize: "28px" }}>Transactions</h2>
      </div>

      {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="transactions-container">
          <form className="tx-form" onSubmit={handleSubmit}>
            <h3>Add Transaction</h3>

            <label>
              Date
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </label>

            <label>
              Amount
              <input
                type="number"
                name="amount"
                step="0.01"
                value={formData.amount}
                onChange={handleInputChange}
                required
              />
            </label>

            <label>
              Type
              <select name="type" value={formData.type} onChange={handleInputChange}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </label>

            <label>
              Category
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                required
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Payment Method
              <input
                type="text"
                name="payment_method"
                placeholder="Cash, card, bank..."
                value={formData.payment_method}
                onChange={handleInputChange}
              />
            </label>

            <label>
              Description
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleInputChange}
              ></textarea>
            </label>

            <button type="submit">Add</button>
          </form>

          <div className="tx-table-container">
            <h3>Recent Transactions</h3>

            {transactions.length === 0 ? (
              <p>No transactions yet</p>
            ) : (
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
                      <td>{t.receipt_image ? <button>View</button> : "—"}</td>
                      <td>
                        <button
                          className="tx-delete-button"
                          onClick={() => handleDelete(t.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}