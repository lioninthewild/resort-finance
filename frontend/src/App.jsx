import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Login from "./pages/Login";
import Notifications from "./pages/Notifications";
import { verifyToken } from "./api/auth";

function ProtectedRoute({ children, isAuthenticated }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function LogoutButton() {
  const navigate = useNavigate();
  
  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }
  
  return (
    <button onClick={handleLogout} style={{ background: 'transparent', border: 'none' }}>
      Logout
    </button>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const result = await verifyToken();
          setIsAuthenticated(result.valid);
        } catch (err) {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setCheckingAuth(false);
    }
    
    checkAuth();
  }, []);

  if (checkingAuth) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div>
        {/* Show navbar only if authenticated */}
        {isAuthenticated && (
          <header className="navbar">
            <h1>Paanighatta Resort</h1>

            <div className="nav-links">
              <Link to="/">Dashboard</Link>
              <Link to="/transactions">Transactions</Link>
              <Link to="/notifications">Notifications</Link>
              <LogoutButton />
            </div>
          </header>
        )}

        {/* CONTENT */}
        <div className="app-container">
          <Routes>
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/" replace /> : <Login />
            } />
            
            <Route path="/" element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/transactions" element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Transactions />
              </ProtectedRoute>
            } />
            
            <Route path="/notifications" element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Notifications />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* FOOTER */}
        {isAuthenticated && (
          <footer className="footer">Currency: NPR</footer>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;