import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }) {
  // Placeholder for authentication check
  // Will be fully implemented when Epic 14 (Security) is done
  const isAuthenticated = true; // TODO: Implement real auth check

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}