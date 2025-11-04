// src/pages/admin/ManageStaff.jsx - UPDATED WITH LIGHT THEME
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, Mail, Phone, AlertCircle } from 'lucide-react';

const ManageStaff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await api.get('/users?role=staff');
      setStaff(response.data.data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#E9E8E6' }}>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: '#1f2937' }}>Manage Staff</h1>
        <p className="mt-2" style={{ color: '#6b7280' }}>View and manage lawyers and staff members</p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4" style={{ borderBottomColor: '#867969' }}></div>
            <p style={{ color: '#6b7280' }}>Loading staff members...</p>
          </div>
        </div>
      ) : staff.length === 0 ? (
        <div className="text-center py-12 rounded-lg" style={{ backgroundColor: '#f5f1ed' }}>
          <AlertCircle className="h-16 w-16 mx-auto mb-4" style={{ color: '#d1d5db' }} />
          <p style={{ color: '#9ca3af' }}>No staff members found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map((member) => (
            <div 
              key={member._id} 
              className="rounded-lg shadow-md p-6 hover:shadow-lg transition transform hover:-translate-y-1"
              style={{ backgroundColor: '#f5f1ed' }}
            >
              {/* Header */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="rounded-full p-3" style={{ backgroundColor: 'rgba(134, 121, 105, 0.15)' }}>
                  <Users className="h-6 w-6" style={{ color: '#867969' }} />
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: '#1f2937' }}>
                    {member.f_name} {member.l_name}
                  </h3>
                  <p className="text-sm" style={{ color: '#6b7280' }}>{member.qualification}</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center" style={{ color: '#6b7280' }}>
                  <Mail className="h-4 w-4 mr-2" style={{ color: '#867969' }} />
                  {member.email}
                </div>
                <div className="flex items-center" style={{ color: '#6b7280' }}>
                  <Phone className="h-4 w-4 mr-2" style={{ color: '#867969' }} />
                  {member.contact}
                </div>
                {member.experience && (
                  <div style={{ color: '#6b7280' }}>
                    Experience: <span className="font-medium">{member.experience}</span>
                  </div>
                )}
              </div>

              {/* Status Badge */}
              <div className="pt-4" style={{ borderTopWidth: '1px', borderTopColor: 'rgba(134, 121, 105, 0.2)' }}>
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: member.isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: member.isActive ? '#10b981' : '#ef4444'
                  }}
                >
                  {member.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageStaff;
