// src/components/NotificationCenter.jsx - NEW
import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, Trash2, MoreVertical } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const NotificationCenter = () => {
  const { socket, isConnected } = useSocket();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, unread
  const dropdownRef = useRef(null);

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  // Listen for real-time notifications
  useEffect(() => {
    if (!socket) return;

    socket.on('new_notification', (data) => {
      console.log('📬 New notification received:', data);
      setNotifications(prev => [data, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    socket.on('case_assigned', (data) => {
      const notification = {
        _id: Math.random(),
        type: 'case_assigned',
        title: 'Case Assigned',
        message: data.message,
        relatedCase: data,
        isRead: false,
        priority: 'high',
        createdAt: new Date()
      };
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    socket.on('case_status_update', (data) => {
      const notification = {
        _id: Math.random(),
        type: 'case_updated',
        title: 'Case Status Updated',
        message: data.message,
        relatedCase: data,
        isRead: false,
        createdAt: new Date()
      };
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    socket.on('new_case_request', (data) => {
      const notification = {
        _id: Math.random(),
        type: 'case_request',
        title: 'New Case Request',
        message: `New case request: ${data.case_title}`,
        relatedCase: data,
        isRead: false,
        priority: 'high',
        createdAt: new Date()
      };
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    socket.on('document_added', (data) => {
      const notification = {
        _id: Math.random(),
        type: 'document_uploaded',
        title: 'Document Uploaded',
        message: data.message,
        relatedCase: data,
        isRead: false,
        createdAt: new Date()
      };
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    socket.on('hearing_scheduled', (data) => {
      const notification = {
        _id: Math.random(),
        type: 'hearing_scheduled',
        title: 'Hearing Scheduled',
        message: data.message,
        relatedCase: data,
        isRead: false,
        priority: 'high',
        createdAt: new Date()
      };
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return () => {
      socket.off('new_notification');
      socket.off('case_assigned');
      socket.off('case_status_update');
      socket.off('new_case_request');
      socket.off('document_added');
      socket.off('hearing_scheduled');
    };
  }, [socket]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/notifications?limit=15');
      setNotifications(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/api/notifications/unread-count');
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/api/notifications/${notificationId}/read`);
      setNotifications(prev =>
        prev.map(notif =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/api/notifications/mark-all-read');
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await api.delete(`/api/notifications/${notificationId}`);
      setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    const iconClass = 'h-4 w-4';
    switch (type) {
      case 'case_assigned':
        return '👤';
      case 'case_updated':
        return '📊';
      case 'case_request':
        return '📝';
      case 'document_uploaded':
        return '📄';
      case 'hearing_scheduled':
        return '📅';
      default:
        return '📬';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return { bg: 'rgba(239, 68, 68, 0.1)', border: '#ef4444' };
      case 'high':
        return { bg: 'rgba(251, 146, 60, 0.1)', border: '#f97316' };
      case 'medium':
        return { bg: 'rgba(251, 191, 36, 0.1)', border: '#fbbf24' };
      default:
        return { bg: 'rgba(107, 114, 128, 0.1)', border: '#d1d5db' };
    }
  };

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.isRead)
    : notifications;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Icon */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 rounded-full hover:bg-gray-200 transition"
        style={{ backgroundColor: showDropdown ? 'rgba(134, 121, 105, 0.1)' : 'transparent' }}
      >
        <Bell className="h-6 w-6" style={{ color: '#867969' }} />
        {unreadCount > 0 && (
          <span
            className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1 -translate-y-1 rounded-full"
            style={{ backgroundColor: '#ef4444' }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {showDropdown && (
        <div
          className="absolute right-0 mt-2 w-96 rounded-lg shadow-xl z-50 overflow-hidden"
          style={{ backgroundColor: '#f5f1ed' }}
        >
          {/* Header */}
          <div
            className="p-4 flex items-center justify-between"
            style={{ backgroundColor: '#f5f1ed', borderBottom: '1px solid rgba(134, 121, 105, 0.2)' }}
          >
            <div>
              <h3 className="font-bold" style={{ color: '#1f2937' }}>Notifications</h3>
              <p className="text-sm" style={{ color: '#6b7280' }}>
                {unreadCount} unread
              </p>
            </div>
            <button
              onClick={() => setShowDropdown(false)}
              className="p-1 hover:bg-gray-300 rounded"
            >
              <X className="h-5 w-5" style={{ color: '#6b7280' }} />
            </button>
          </div>

          {/* Filter Tabs */}
          <div
            className="flex px-4 pt-2 border-b"
            style={{ borderColor: 'rgba(134, 121, 105, 0.2)' }}
          >
            <button
              onClick={() => setFilter('all')}
              className="px-4 py-2 text-sm font-medium border-b-2 transition"
              style={{
                color: filter === 'all' ? '#867969' : '#9ca3af',
                borderColor: filter === 'all' ? '#867969' : 'transparent'
              }}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className="px-4 py-2 text-sm font-medium border-b-2 transition"
              style={{
                color: filter === 'unread' ? '#867969' : '#9ca3af',
                borderColor: filter === 'unread' ? '#867969' : 'transparent'
              }}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{ borderBottomColor: '#867969' }}></div>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="p-8 text-center" style={{ color: '#9ca3af' }}>
                <p>No notifications</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className="p-3 border-b flex items-start gap-3 hover:opacity-75 transition"
                  style={{
                    backgroundColor: notification.isRead ? '#f5f1ed' : 'rgba(134, 121, 105, 0.05)',
                    borderColor: 'rgba(134, 121, 105, 0.1)',
                    borderLeft: `3px solid ${getPriorityColor(notification.priority).border}`
                  }}
                >
                  {/* Icon */}
                  <div className="text-xl mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h4
                      className="font-semibold text-sm"
                      style={{ color: '#1f2937' }}
                    >
                      {notification.title}
                    </h4>
                    <p
                      className="text-sm mt-1"
                      style={{ color: '#6b7280' }}
                    >
                      {notification.message}
                    </p>
                    <p
                      className="text-xs mt-1"
                      style={{ color: '#9ca3af' }}
                    >
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification._id)}
                        className="p-1 hover:bg-gray-300 rounded"
                        title="Mark as read"
                      >
                        <Check className="h-4 w-4" style={{ color: '#10b981' }} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification._id)}
                      className="p-1 hover:bg-gray-300 rounded"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" style={{ color: '#ef4444' }} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {filteredNotifications.length > 0 && (
            <div
              className="p-3 text-center border-t"
              style={{ borderColor: 'rgba(134, 121, 105, 0.2)' }}
            >
              <button
                onClick={markAllAsRead}
                className="text-sm font-medium hover:underline"
                style={{ color: '#867969' }}
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
