// src/pages/admin/ManageUsers.jsx - UPDATED WITH LIGHT THEME
import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Search, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${userId}`);
        setUsers(users.filter(u => u._id !== userId));
        alert('User deleted successfully');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${user.f_name} ${user.l_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return { bg: 'rgba(139, 92, 246, 0.15)', text: '#8b5cf6' };
      case 'staff':
        return { bg: 'rgba(134, 121, 105, 0.15)', text: '#867969' };
      case 'client':
        return { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981' };
      default:
        return { bg: 'rgba(107, 114, 128, 0.15)', text: '#6b7280' };
    }
  };

  return (
    <div className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#E9E8E6' }}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#1f2937' }}>Manage Users</h1>
          <p className="mt-2" style={{ color: '#6b7280' }}>View and manage all system users</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: '#f5f1ed' }}>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: '#9ca3af' }} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg outline-none"
              style={{
                backgroundColor: '#ffffff',
                borderWidth: '1px',
                borderColor: 'rgba(134, 121, 105, 0.2)',
                color: '#1f2937'
              }}
            />
          </div>
          
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 rounded-lg outline-none"
            style={{
              backgroundColor: '#ffffff',
              borderWidth: '1px',
              borderColor: 'rgba(134, 121, 105, 0.2)',
              color: '#1f2937'
            }}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
            <option value="client">Client</option>
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderBottomColor: '#867969' }}></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 mx-auto mb-4" style={{ color: '#d1d5db' }} />
            <p style={{ color: '#9ca3af' }}>No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead style={{ backgroundColor: 'rgba(134, 121, 105, 0.1)' }}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase" style={{ color: '#6b7280' }}>Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase" style={{ color: '#6b7280' }}>Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase" style={{ color: '#6b7280' }}>Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase" style={{ color: '#6b7280' }}>Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase" style={{ color: '#6b7280' }}>Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase" style={{ color: '#6b7280' }}>Actions</th>
                </tr>
              </thead>
              <tbody style={{ borderTopWidth: '1px', borderTopColor: 'rgba(134, 121, 105, 0.2)' }}>
                {filteredUsers.map((user) => {
                  const roleBadge = getRoleBadgeColor(user.role);
                  const statusBadge = user.isActive 
                    ? { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981' }
                    : { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444' };
                  
                  return (
                    <tr key={user._id} style={{ borderBottomWidth: '1px', borderBottomColor: 'rgba(134, 121, 105, 0.15)' }}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium" style={{ color: '#1f2937' }}>
                          {user.f_name} {user.l_name}
                        </div>
                        <div className="text-sm" style={{ color: '#6b7280' }}>{user.username}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#6b7280' }}>
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{ backgroundColor: roleBadge.bg, color: roleBadge.text }}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#6b7280' }}>
                        {user.contact}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{ backgroundColor: statusBadge.bg, color: statusBadge.text }}
                        >
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <button className="transition-colors" style={{ color: '#867969' }}>
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="transition-colors"
                            style={{ color: '#ef4444' }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
