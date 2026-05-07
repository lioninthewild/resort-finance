import React, { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadNotifications() {
    try {
      const res = await apiClient.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(id) {
    try {
      await apiClient.patch(`/notifications/${id}/read`);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
  }

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
      <h2 style={{ fontSize: "28px", marginBottom: "20px" }}>Notifications</h2>

      {error && <div className="error-message">{error}</div>}

      {notifications.length === 0 ? (
        <div className="empty-state">No notifications</div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`notification-item ${notification.read ? 'read' : 'unread'}`}
              onClick={() => !notification.read && markAsRead(notification.id)}
            >
              <div className="notification-header">
                <span className={`notification-type ${notification.type}`}>
                  {notification.type === 'transaction_added' ? '➕ Added' : '🗑️ Deleted'}
                </span>
                <span className="notification-date">
                  {formatDate(notification.created_at)}
                </span>
              </div>
              <p className="notification-message">{notification.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}