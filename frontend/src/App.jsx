import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Login from "./pages/Login";
import Notifications from "./pages/Notifications";
import { verifyToken } from "./api/auth";

function ProtectedRoute({ children, isAuthenticated, isChecking }) {
  // While checking auth, show loading
  if (isChecking) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Checking authentication...</p>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  // Authenticated, show the protected content
  return children;
}

function LogoutButton() {
  const navigate = useNavigate();
  
  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  }
  
  return (
    <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: 'white' }}>
      Logout
    </button>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        setIsChecking(false);
        return;
      }
      
      try {
        const result = await verifyToken();
        setIsAuthenticated(result.valid === true);
      } catch (err) {
        console.error("Auth check failed:", err);
        setIsAuthenticated(false);
      }
      setIsChecking(false);
    }
    
    checkAuth();
  }, []);

  return (
    <BrowserRouter>
      <div>
        {/* Show navbar only if authenticated */}
        {isAuthenticated && !isChecking && (
          <header className="navbar">
            <h1>Paanighatta Resort</h1>

            <div className="nav-links">
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/transactions">Transactions</Link>
              <Link to="/notifications">Notifications</Link>
              <LogoutButton />
            </div>
          </header>
        )}

        {/* CONTENT */}
        <div className="app-container">
          <Routes>
            {/* Root path - show login if not authenticated */}
            <Route path="/" element={
              isChecking 
                ? <div className="loading-spinner"><div className="spinner"></div></div>
                : isAuthenticated 
                  ? <Navigate to="/dashboard" replace /> 
                  : <Login />
            } />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute isAuthenticated={isAuthenticated} isChecking={isChecking}>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/transactions" element={
              <ProtectedRoute isAuthenticated={isAuthenticated} isChecking={isChecking}>
                <Transactions />
              </ProtectedRoute>
            } />
            
            <Route path="/notifications" element={
              <ProtectedRoute isAuthenticated={isAuthenticated} isChecking={isChecking}>
                <Notifications />
              </ProtectedRoute>
            } />
            
            {/* Login page redirect if already authenticated */}
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />
            } />
            
            {/* Catch all - redirect to root */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* FOOTER */}
        {isAuthenticated && !isChecking && (
          <footer className="footer">Currency: NPR</footer>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;