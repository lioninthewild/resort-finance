import React, { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";

export default function App() {
  const [page, setPage] = useState("dashboard"); // default landing page

  return (
    <div>
      {/* NAVBAR */}
      <header className="navbar">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src="/logo.jpeg" alt="logo" />
          <h1>Paanighatta Resort</h1>
        </div>

        <div className="nav-links">
          <button onClick={() => setPage("dashboard")}>Dashboard</button>
          <button onClick={() => setPage("transactions")}>Transactions</button>
        </div>
      </header>

      {/* CONTENT */}
      <div className="app-container">
        {page === "dashboard" && <Dashboard />}
        {page === "transactions" && <Transactions />}
      </div>

      {/* FOOTER */}
      <footer className="footer">Currency: NPR</footer>
    </div>
  );
}
