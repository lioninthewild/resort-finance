import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import apiClient from "../api/apiClient";

export default function Bill() {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwnerView, setIsOwnerView] = useState(false);

  useEffect(() => {
    async function fetchTransaction() {
      try {
        const res = await apiClient.get(`/transactions`);
        const tx = res.data.find(t => t.id === parseInt(id));
        if (tx) {
          setTransaction(tx);
        } else {
          setError("Transaction not found");
        }
      } catch (err) {
        setError("Failed to load transaction");
      } finally {
        setLoading(false);
      }
    }
    fetchTransaction();
  }, [id]);

  function handlePrint() {
    window.print();
  }

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="error-message">{error}</div>
        <Link to="/transactions" className="back-link">Back to Transactions</Link>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN").format(amount);
  };

  return (
    <div className="bill-page">
      <div className="bill-actions no-print">
        <Link to="/transactions" className="back-link">← Back to Transactions</Link>
        <div className="view-toggle">
          <button 
            className={!isOwnerView ? "active" : ""} 
            onClick={() => setIsOwnerView(false)}
          >
            Customer View
          </button>
          <button 
            className={isOwnerView ? "active" : ""} 
            onClick={() => setIsOwnerView(true)}
          >
            Owner View
          </button>
        </div>
        <button className="print-btn" onClick={handlePrint}>
          🖨️ Print Bill
        </button>
      </div>

      <div className="bill-container">
        <div className="bill-header">
          <h1>Paanighatta Resort</h1>
          <p className="bill-subtitle">Nagarkot, Kavrepalanchok</p>
        </div>

        <div className="bill-details">
          <div className="bill-row">
            <span>Date:</span>
            <span>{formatDate(transaction.date)}</span>
          </div>
          <div className="bill-row">
            <span>Receipt No:</span>
            <span>#{transaction.id.toString().padStart(6, "0")}</span>
          </div>
          
          {isOwnerView && (
            <div className="bill-row">
              <span>Type:</span>
              <span className={transaction.type === "income" ? "income-text" : "expense-text"}>
                {transaction.type === "income" ? "💰 Income" : "💸 Expense"}
              </span>
            </div>
          )}
        </div>

        <div className="bill-divider"></div>

        <div className="bill-items">
          {isOwnerView && (
            <div className="bill-row">
              <span>Category:</span>
              <span>{transaction.category}</span>
            </div>
          )}
          
          <div className="bill-row">
            <span>{isOwnerView ? "Service:" : "Category:"}</span>
            <span>{transaction.category}</span>
          </div>

          <div className="bill-row amount-row">
            <span>Amount:</span>
            <span className="bill-amount">NPR {formatAmount(transaction.amount)}</span>
          </div>

          {isOwnerView && transaction.payment_method && (
            <div className="bill-row">
              <span>Payment Method:</span>
              <span>{transaction.payment_method}</span>
            </div>
          )}
        </div>

        {transaction.description && (
          <>
            <div className="bill-divider"></div>
            <div className="bill-description">
              <strong>Note:</strong> {transaction.description}
            </div>
          </>
        )}

        <div className="bill-footer">
          <p>Thank you for your visit! 🙏</p>
          <p className="bill-generated">Generated on: {new Date().toLocaleString()}</p>
        </div>
      </div>

      <style>{`
        @media print {
          .bill-page { padding: 0; }
          .bill-actions { display: none !important; }
          .bill-container { 
            border: 2px solid #333; 
            box-shadow: none;
          }
        }
        
        .bill-page {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .bill-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 10px;
        }
        
        .back-link {
          color: #0b5fff;
          text-decoration: none;
          font-weight: 500;
        }
        
        .view-toggle {
          display: flex;
          gap: 5px;
        }
        
        .view-toggle button {
          padding: 8px 16px;
          border: 1px solid #ddd;
          background: white;
          cursor: pointer;
          border-radius: 6px;
        }
        
        .view-toggle button.active {
          background: #0b5fff;
          color: white;
          border-color: #0b5fff;
        }
        
        .print-btn {
          padding: 10px 20px;
          background: #0b5fff;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
        }
        
        .bill-container {
          background: white;
          border: 1px solid #ddd;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        
        .bill-header {
          text-align: center;
          margin-bottom: 24px;
        }
        
        .bill-header h1 {
          font-size: 24px;
          color: #0b5fff;
          margin: 0;
        }
        
        .bill-subtitle {
          color: #666;
          margin: 4px 0 0;
          font-size: 14px;
        }
        
        .bill-details {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 16px;
        }
        
        .bill-row {
          display: flex;
          justify-content: space-between;
          width: 100%;
          padding: 8px 0;
        }
        
        .bill-row span:first-child {
          color: #666;
        }
        
        .bill-row span:last-child {
          font-weight: 500;
          color: #333;
        }
        
        .bill-divider {
          border-top: 1px dashed #ddd;
          margin: 16px 0;
        }
        
        .bill-items {
          margin-bottom: 16px;
        }
        
        .amount-row {
          font-size: 20px;
          padding-top: 12px;
        }
        
        .bill-amount {
          font-size: 24px;
          font-weight: 700;
          color: #0b5fff !important;
        }
        
        .bill-description {
          background: #f9f9f9;
          padding: 12px;
          border-radius: 8px;
          font-size: 14px;
          color: #555;
        }
        
        .bill-footer {
          text-align: center;
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid #eee;
        }
        
        .bill-footer p {
          margin: 4px 0;
          color: #666;
        }
        
        .bill-generated {
          font-size: 12px;
          color: #999;
        }
        
        @media (max-width: 480px) {
          .bill-actions {
            flex-direction: column;
            align-items: stretch;
          }
          
          .view-toggle {
            justify-content: center;
          }
          
          .bill-container {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}