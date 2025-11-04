// src/components/Navbar.jsx - UPDATED WITH LIGHT THEME
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Scale, Bell, User, LogOut, Menu, X } from 'lucide-react';
import api from '../services/api';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data.data);
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (user?.role === 'admin') return '/admin/dashboard';
    if (user?.role === 'staff') return '/staff/dashboard';
    if (user?.role === 'client') return '/client/dashboard';
    return '/';
  };

  return (
    <nav className="shadow-md sticky top-0 z-50" style={{ backgroundColor: '#f5f1ed' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={getDashboardLink()} className="flex items-center space-x-3 group">
            <div className="p-2 rounded-lg group-hover:scale-110 transition-transform" style={{ background: 'linear-gradient(135deg, #867969 0%, #a89983 100%)' }}>
              <Scale className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold" style={{ color: '#1f2937' }}>eCourt Manager</span>
              <p className="text-xs" style={{ color: '#6b7280' }}>Legal Case Management</p>
            </div>
          </Link>

          {user && (
            <div className="hidden md:flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-lg transition"
                  style={{ color: '#6b7280' }}
                >
                  <Bell className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 rounded-lg shadow-xl border max-h-96 overflow-y-auto" style={{ backgroundColor: '#ffffff', borderColor: 'rgba(134, 121, 105, 0.2)' }}>
                    <div className="p-4 border-b flex justify-between items-center sticky top-0" style={{ backgroundColor: '#f5f1ed', borderBottomColor: 'rgba(134, 121, 105, 0.2)' }}>
                      <h3 className="font-semibold" style={{ color: '#1f2937' }}>Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs hover:transition-colors"
                          style={{ color: '#867969' }}
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    {notifications.length === 0 ? (
                      <div className="p-8 text-center" style={{ color: '#9ca3af' }}>
                        <Bell className="h-12 w-12 mx-auto mb-2" style={{ color: '#d1d5db' }} />
                        <p>No notifications</p>
                      </div>
                    ) : (
                      <div>
                        {notifications.slice(0, 10).map((notif) => (
                          <div
                            key={notif._id}
                            onClick={() => {
                              markAsRead(notif._id);
                              if (notif.link) navigate(notif.link);
                              setShowNotifications(false);
                            }}
                            className="p-4 border-b cursor-pointer transition"
                            style={{
                              borderBottomColor: 'rgba(134, 121, 105, 0.15)',
                              backgroundColor: !notif.read ? 'rgba(134, 121, 105, 0.08)' : 'transparent'
                            }}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="font-medium text-sm" style={{ color: '#1f2937' }}>
                                  {notif.title}
                                </p>
                                <p className="text-xs mt-1" style={{ color: '#6b7280' }}>
                                  {notif.message}
                                </p>
                                <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>
                                  {new Date(notif.created_at).toLocaleString()}
                                </p>
                              </div>
                              {!notif.read && (
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#867969' }}></span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-3 px-4 py-2 rounded-lg" style={{ backgroundColor: 'rgba(134, 121, 105, 0.1)' }}>
                <div className="p-2 rounded-full" style={{ background: 'linear-gradient(135deg, #867969 0%, #a89983 100%)' }}>
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium" style={{ color: '#1f2937' }}>
                    {user.f_name} {user.l_name}
                  </p>
                  <p className="text-xs capitalize" style={{ color: '#6b7280' }}>{user.role}</p>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg transition"
                style={{ color: '#6b7280' }}
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          {user && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg"
              style={{ color: '#6b7280' }}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && user && (
          <div className="md:hidden py-4" style={{ borderTopColor: 'rgba(134, 121, 105, 0.2)', borderTopWidth: '1px' }}>
            <div className="flex flex-col space-y-2">
              <div className="px-4 py-2 rounded-lg" style={{ backgroundColor: 'rgba(134, 121, 105, 0.1)' }}>
                <p className="text-sm font-medium" style={{ color: '#1f2937' }}>{user.f_name} {user.l_name}</p>
                <p className="text-xs capitalize" style={{ color: '#6b7280' }}>{user.role}</p>
              </div>
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg transition"
                style={{ color: '#1f2937' }}
              >
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg transition"
                style={{ color: '#ef4444' }}
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
