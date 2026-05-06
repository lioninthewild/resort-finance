import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";

export default function App() {
  return (
    <BrowserRouter>
      <div>
        {/* NAVBAR */}
        <header className="navbar">
          <h1>Paanighatta Resort</h1>

          <div className="nav-links">
            <Link to="/">Dashboard</Link>
            <Link to="/transactions">Transactions</Link>
          </div>
        </header>

        {/* CONTENT */}
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
          </Routes>
        </div>

        {/* FOOTER */}
        <footer className="footer">Currency: NPR</footer>
      </div>
    </BrowserRouter>
  );
}