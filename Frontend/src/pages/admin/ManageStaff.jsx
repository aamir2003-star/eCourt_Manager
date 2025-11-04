// src/pages/admin/ManageStaff.jsx - UPDATED WITH LIGHT THEME
import React, { useState, useEffect } from 'react';
import { 
  Users, Mail, Phone, Search, Plus, Edit, 
  Trash2, Award, Calendar, UserCheck, AlertCircle
} from 'lucide-react';
import api from '../../services/api';

const ManageStaff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleDelete = async (staffId) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await api.delete(`/users/${staffId}`);
        setStaff(staff.filter(s => s._id !== staffId));
        alert('Staff member deleted successfully');
      } catch (error) {
        console.error('Error deleting staff:', error);
        alert('Failed to delete staff member');
      }
    }
  };

  const handleToggleStatus = async (staffId, currentStatus) => {
    try {
      await api.put(`/users/${staffId}`, { isActive: !currentStatus });
      fetchStaff();
      alert(`Staff member ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const filteredStaff = staff.filter(member =>
    `${member.f_name} ${member.l_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.qualification?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#E9E8E6' }}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#1f2937' }}>Manage Staff</h1>
          <p className="mt-2" style={{ color: '#6b7280' }}>View and manage lawyers and staff members</p>
        </div>
        <button
          onClick={() => window.location.href = '/register'}
          className="text-white px-6 py-3 rounded-lg hover:shadow-lg transition flex items-center space-x-2 font-semibold shadow-md transform hover:-translate-y-1"
          style={{ background: 'linear-gradient(135deg, #867969 0%, #a89983 100%)' }}
        >
          <Plus className="h-5 w-5" />
          <span>Add Staff</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="rounded-xl p-6 text-white shadow-md transform hover:-translate-y-1 transition" style={{ background: 'linear-gradient(135deg, #867969 0%, #a89983 100%)' }}>
          <UserCheck className="h-8 w-8 mb-3" />
          <p className="text-sm opacity-90">Total Staff</p>
          <p className="text-3xl font-bold">{staff.length}</p>
        </div>
        <div className="rounded-xl p-6 text-white shadow-md transform hover:-translate-y-1 transition" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
          <Users className="h-8 w-8 mb-3" />
          <p className="text-sm opacity-90">Active</p>
          <p className="text-3xl font-bold">
            {staff.filter(s => s.isActive).length}
          </p>
        </div>
        <div className="rounded-xl p-6 text-white shadow-md transform hover:-translate-y-1 transition" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
          <Award className="h-8 w-8 mb-3" />
          <p className="text-sm opacity-90">Experienced</p>
          <p className="text-3xl font-bold">
            {staff.filter(s => s.experience).length}
          </p>
        </div>
        <div className="rounded-xl p-6 text-white shadow-md transform hover:-translate-y-1 transition" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
          <Calendar className="h-8 w-8 mb-3" />
          <p className="text-sm opacity-90">Joined This Month</p>
          <p className="text-3xl font-bold">
            {staff.filter(s => {
              const joinDate = new Date(s.date_of_reg);
              const now = new Date();
              return joinDate.getMonth() === now.getMonth() && 
                     joinDate.getFullYear() === now.getFullYear();
            }).length}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: '#f5f1ed' }}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: '#9ca3af' }} />
          <input
            type="text"
            placeholder="Search staff by name, email, or qualification..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg outline-none"
            style={{
              backgroundColor: '#ffffff',
              borderWidth: '1px',
              borderColor: 'rgba(134, 121, 105, 0.2)',
              color: '#1f2937'
            }}
          />
        </div>
      </div>

      {/* Staff Grid */}
      <div>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderBottomColor: '#867969' }}></div>
            <p style={{ color: '#6b7280' }}>Loading staff members...</p>
          </div>
        ) : filteredStaff.length === 0 ? (
          <div className="rounded-xl shadow-lg p-12 text-center" style={{ backgroundColor: '#f5f1ed' }}>
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full" style={{ backgroundColor: 'rgba(134, 121, 105, 0.1)' }}>
                <AlertCircle className="h-16 w-16" style={{ color: '#9ca3af' }} />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: '#1f2937' }}>No staff members found</h3>
            <p className="mb-6" style={{ color: '#9ca3af' }}>
              {searchTerm ? 'Try adjusting your search' : 'Add your first staff member to get started'}
            </p>
            <button
              onClick={() => window.location.href = '/register'}
              className="text-white px-6 py-3 rounded-lg transition inline-flex items-center space-x-2 font-semibold"
              style={{ background: 'linear-gradient(135deg, #867969 0%, #a89983 100%)' }}
            >
              <Plus className="h-5 w-5" />
              <span>Add Staff Member</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStaff.map((member) => (
              <div
                key={member._id}
                className="rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300"
                style={{
                  backgroundColor: '#f5f1ed',
                  borderWidth: '1px',
                  borderColor: 'rgba(134, 121, 105, 0.2)'
                }}
              >
                {/* Header with Photo/Icon */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {member.photo ? (
                      <img
                        src={`http://localhost:5000/${member.photo}`}
                        alt={member.f_name}
                        className="w-14 h-14 rounded-full object-cover"
                        style={{ border: '2px solid #867969' }}
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold" style={{ background: 'linear-gradient(135deg, #867969 0%, #a89983 100%)' }}>
                        {member.f_name[0]}{member.l_name[0]}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-lg" style={{ color: '#1f2937' }}>
                        {member.f_name} {member.l_name}
                      </h3>
                      <span 
                        className="inline-block px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: member.isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          color: member.isActive ? '#10b981' : '#ef4444'
                        }}
                      >
                        {member.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm" style={{ color: '#6b7280' }}>
                    <Mail className="h-4 w-4 mr-2 flex-shrink-0" style={{ color: '#867969' }} />
                    <span className="truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center text-sm" style={{ color: '#6b7280' }}>
                    <Phone className="h-4 w-4 mr-2 flex-shrink-0" style={{ color: '#867969' }} />
                    <span>{member.contact}</span>
                  </div>
                  {member.qualification && (
                    <div className="flex items-center text-sm" style={{ color: '#6b7280' }}>
                      <Award className="h-4 w-4 mr-2 flex-shrink-0" style={{ color: '#867969' }} />
                      <span className="font-medium">{member.qualification}</span>
                    </div>
                  )}
                  {member.experience && (
                    <div className="flex items-center text-sm" style={{ color: '#6b7280' }}>
                      <Calendar className="h-4 w-4 mr-2 flex-shrink-0" style={{ color: '#867969' }} />
                      <span>{member.experience} experience</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4 p-3 rounded-lg" style={{ backgroundColor: 'rgba(134, 121, 105, 0.08)' }}>
                  <div className="text-center">
                    <p className="text-xs" style={{ color: '#9ca3af' }}>Cases</p>
                    <p className="text-lg font-bold" style={{ color: '#1f2937' }}>0</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs" style={{ color: '#9ca3af' }}>Joined</p>
                    <p className="text-lg font-bold" style={{ color: '#1f2937' }}>
                      {new Date(member.date_of_reg).toLocaleDateString('en-US', { 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-3" style={{ borderTopWidth: '1px', borderColor: 'rgba(134, 121, 105, 0.2)' }}>
                  <button
                    onClick={() => handleToggleStatus(member._id, member.isActive)}
                    className="flex-1 px-3 py-2 rounded-lg transition text-sm font-medium"
                    style={{
                      backgroundColor: member.isActive ? 'rgba(249, 115, 22, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                      color: member.isActive ? '#f97316' : '#10b981'
                    }}
                  >
                    {member.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => console.log('Edit', member._id)}
                    className="px-3 py-2 rounded-lg hover:opacity-80 transition"
                    style={{
                      backgroundColor: 'rgba(134, 121, 105, 0.1)',
                      color: '#867969'
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(member._id)}
                    className="px-3 py-2 rounded-lg hover:opacity-80 transition"
                    style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      color: '#ef4444'
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {!loading && filteredStaff.length > 0 && (
        <div className="rounded-xl shadow-md p-6" style={{ backgroundColor: '#f5f1ed' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#1f2937' }}>Staff Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'rgba(134, 121, 105, 0.08)' }}>
              <p className="text-3xl font-bold" style={{ color: '#867969' }}>
                {staff.filter(s => s.qualification?.includes('LLB')).length}
              </p>
              <p className="text-sm mt-1" style={{ color: '#6b7280' }}>With LLB Degree</p>
            </div>
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)' }}>
              <p className="text-3xl font-bold" style={{ color: '#10b981' }}>
                {(staff.reduce((sum, s) => sum + (parseInt(s.experience) || 0), 0) / staff.length).toFixed(1)}
              </p>
              <p className="text-sm mt-1" style={{ color: '#6b7280' }}>Avg. Years Experience</p>
            </div>
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'rgba(249, 115, 22, 0.08)' }}>
              <p className="text-3xl font-bold" style={{ color: '#f97316' }}>
                {((staff.filter(s => s.isActive).length / staff.length) * 100).toFixed(0)}%
              </p>
              <p className="text-sm mt-1" style={{ color: '#6b7280' }}>Active Rate</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStaff;
