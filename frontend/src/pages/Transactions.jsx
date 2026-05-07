import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formErrors, setFormErrors] = useState({});
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

  function validateField(name, value) {
    const today = new Date().toISOString().split("T")[0];
    
    switch (name) {
      case "amount":
        if (!value) return "Amount is required";
        if (parseFloat(value) <= 0) return "Amount must be greater than 0";
        return null;
      case "date":
        if (!value) return "Date is required";
        if (value > today) return "Date cannot be in the future";
        return null;
      case "category_id":
        if (!value) return "Please select a category";
        return null;
      default:
        return null;
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear success message on input change
    if (success) setSuccess(null);
    
    // Validate single field on change
    const error = validateField(name, value);
    setFormErrors((prev) => ({ ...prev, [name]: error }));
  }

  function validateForm() {
    const errors = {};
    const today = new Date().toISOString().split("T")[0];
    
    if (!formData.date) errors.date = "Date is required";
    else if (formData.date > today) errors.date = "Date cannot be in the future";
    
    if (!formData.amount) errors.amount = "Amount is required";
    else if (parseFloat(formData.amount) <= 0) errors.amount = "Amount must be greater than 0";
    
    if (!formData.category_id) errors.category_id = "Please select a category";
    
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    // Validate all fields
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      const payload = new FormData();
      payload.append("date", formData.date);
      payload.append("amount", formData.amount);
      payload.append("type", formData.type);
      payload.append("category_id", formData.category_id);
      if (formData.payment_method) payload.append("payment_method", formData.payment_method);
      if (formData.description) payload.append("description", formData.description);

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
      setFormErrors({});
      setSuccess("Transaction added successfully!");
    } catch (err) {
      console.error("Add transaction error:", err);
      setError(err.response?.data?.error || "Failed to add transaction");
    } finally {
      setSubmitting(false);
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
      <h2 style={{ fontSize: "28px", marginBottom: "20px" }}>Transactions</h2>

      {error && (
        <div className="error-message" onClick={() => setError(null)}>
          {error}
        </div>
      )}

      {success && (
        <div className="success-message" onClick={() => setSuccess(null)}>
          {success}
        </div>
      )}

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
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
                max={new Date().toISOString().split("T")[0]}
              />
              {formErrors.date && <span className="field-error">{formErrors.date}</span>}
            </label>

            <label>
              Amount
              <input
                type="number"
                name="amount"
                step="0.01"
                min="0.01"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0.00"
              />
              {formErrors.amount && <span className="field-error">{formErrors.amount}</span>}
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
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {formErrors.category_id && <span className="field-error">{formErrors.category_id}</span>}
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

            <button type="submit" disabled={submitting}>
              {submitting ? "Adding..." : "Add Transaction"}
            </button>
          </form>

          <div className="tx-table-container">
            <h3>Recent Transactions</h3>

            {transactions.length === 0 ? (
              <p className="empty-state">No transactions yet</p>
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
                        NPR {parseFloat(t.amount).toLocaleString()}
                      </td>
                      <td>
                        <Link to={`/bill/${t.id}`} className="view-bill-link">
                          View Bill
                        </Link>
                      </td>
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