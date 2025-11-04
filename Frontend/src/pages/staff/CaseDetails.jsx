// src/pages/staff/CaseDetails.jsx - UPDATED
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Briefcase, Plus, AlertCircle, CheckCircle } from 'lucide-react';
import { useCase } from '../../context/CaseContext';
import CaseCard from '../../components/CaseCard';
import api from '../../services/api';

const CaseDetails = () => {
  const navigate = useNavigate();
  const { cases, loading, refetch } = useCase(); // ✅ Make sure refetch is available
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [acceptingCaseId, setAcceptingCaseId] = useState(null);

  const filteredCases = cases.filter(c => {
    const matchesSearch = c.case_title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // ✅ NEW: Handle accept case
  const handleAcceptCase = async (caseId) => {
    if (window.confirm('Do you want to accept this case?')) {
      try {
        setAcceptingCaseId(caseId);
        await api.put(`/api/cases/${caseId}/accept`);
        alert('Case accepted successfully!');
        // Refresh cases
        if (refetch) {
          refetch();
        }
      } catch (error) {
        console.error('Error accepting case:', error);
        alert('Failed to accept case: ' + (error.response?.data?.message || error.message));
      } finally {
        setAcceptingCaseId(null);
      }
    }
  };

  const getStatBorder = (type) => {
    switch(type) {
      case 'total':
        return '#867969';
      case 'active':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'closed':
        return '#6b7280';
      default:
        return '#867969';
    }
  };

  return (
    <div className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#E9E8E6' }}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#1f2937' }}>My Cases</h1>
          <p className="mt-2" style={{ color: '#6b7280' }}>Cases assigned to you</p>
        </div>
        <button
          onClick={() => navigate('/staff/cases/new')}
          className="text-white px-6 py-3 rounded-lg hover:shadow-lg transition flex items-center space-x-2 shadow-md font-semibold transform hover:-translate-y-1"
          style={{ background: 'linear-gradient(135deg, #867969 0%, #a89983 100%)' }}
        >
          <Plus className="h-5 w-5" />
          <span>New Case</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          className="rounded-lg shadow-md p-4 transform hover:-translate-y-1 transition"
          style={{
            backgroundColor: '#f5f1ed',
            borderLeftWidth: '4px',
            borderLeftColor: getStatBorder('total')
          }}
        >
          <p className="text-sm" style={{ color: '#9ca3af' }}>Total Cases</p>
          <p className="text-2xl font-bold mt-1" style={{ color: '#1f2937' }}>{cases.length}</p>
        </div>
        <div
          className="rounded-lg shadow-md p-4 transform hover:-translate-y-1 transition"
          style={{
            backgroundColor: '#f5f1ed',
            borderLeftWidth: '4px',
            borderLeftColor: getStatBorder('active')
          }}
        >
          <p className="text-sm" style={{ color: '#9ca3af' }}>Active</p>
          <p className="text-2xl font-bold mt-1" style={{ color: '#1f2937' }}>
            {cases.filter(c => c.status === 'active').length}
          </p>
        </div>
        <div
          className="rounded-lg shadow-md p-4 transform hover:-translate-y-1 transition"
          style={{
            backgroundColor: '#f5f1ed',
            borderLeftWidth: '4px',
            borderLeftColor: getStatBorder('pending')
          }}
        >
          <p className="text-sm" style={{ color: '#9ca3af' }}>Pending</p>
          <p className="text-2xl font-bold mt-1" style={{ color: '#1f2937' }}>
            {cases.filter(c => c.status === 'pending').length}
          </p>
        </div>
        <div
          className="rounded-lg shadow-md p-4 transform hover:-translate-y-1 transition"
          style={{
            backgroundColor: '#f5f1ed',
            borderLeftWidth: '4px',
            borderLeftColor: getStatBorder('closed')
          }}
        >
          <p className="text-sm" style={{ color: '#9ca3af' }}>Closed</p>
          <p className="text-2xl font-bold mt-1" style={{ color: '#1f2937' }}>
            {cases.filter(c => c.status === 'closed').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: '#f5f1ed' }}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: '#9ca3af' }} />
            <input
              type="text"
              placeholder="Search cases..."
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-lg outline-none"
            style={{
              backgroundColor: '#ffffff',
              borderWidth: '1px',
              borderColor: 'rgba(134, 121, 105, 0.2)',
              color: '#1f2937'
            }}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
            <option value="on-hold">On Hold</option>
          </select>
        </div>
      </div>

      {/* Cases Grid with Accept Button */}
      <div>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderBottomColor: '#867969' }}></div>
            <p style={{ color: '#6b7280' }}>Loading cases...</p>
          </div>
        ) : filteredCases.length === 0 ? (
          <div className="rounded-lg shadow-md p-12 text-center" style={{ backgroundColor: '#f5f1ed' }}>
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full" style={{ backgroundColor: 'rgba(134, 121, 105, 0.1)' }}>
                <AlertCircle className="h-16 w-16" style={{ color: '#9ca3af' }} />
              </div>
            </div>
            <p className="text-lg" style={{ color: '#9ca3af' }}>No cases assigned yet</p>
            <p className="text-sm mt-2" style={{ color: '#9ca3af' }}>Cases assigned to you will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCases.map((caseItem) => (
              <div
                key={caseItem._id}
                className="rounded-lg shadow-md overflow-hidden"
                style={{ backgroundColor: '#f5f1ed' }}
              >
                {/* Card Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg" style={{ color: '#1f2937' }}>
                      {caseItem.case_title}
                    </h3>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: caseItem.status === 'pending' 
                          ? 'rgba(249, 191, 36, 0.1)'
                          : caseItem.status === 'active'
                          ? 'rgba(16, 185, 129, 0.1)'
                          : 'rgba(107, 114, 128, 0.1)',
                        color: caseItem.status === 'pending'
                          ? '#f59e0b'
                          : caseItem.status === 'active'
                          ? '#10b981'
                          : '#6b7280'
                      }}
                    >
                      {caseItem.status}
                    </span>
                  </div>

                  <p className="text-sm mb-3" style={{ color: '#6b7280' }}>
                    {caseItem.description?.substring(0, 100)}...
                  </p>

                  <div className="space-y-2 mb-4 text-sm" style={{ color: '#9ca3af' }}>
                    <p><strong>Type:</strong> {caseItem.case_type}</p>
                    <p><strong>Client:</strong> {caseItem.client?.f_name} {caseItem.client?.l_name}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    {/* Accept Button - Only show if pending */}
                    {caseItem.status === 'pending' && (
                      <button
                        onClick={() => handleAcceptCase(caseItem._id)}
                        disabled={acceptingCaseId === caseItem._id}
                        className="w-full text-white py-2 rounded-lg transition disabled:opacity-50 font-medium flex items-center justify-center space-x-1"
                        style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>{acceptingCaseId === caseItem._id ? 'Accepting...' : 'Accept Case'}</span>
                      </button>
                    )}

                    {/* View Details Button */}
                    <button
                      onClick={() => navigate(`/staff/cases/${caseItem._id}`)}
                      className="w-full px-4 py-2 rounded-lg transition"
                      style={{
                        backgroundColor: '#ffffff',
                        borderWidth: '1px',
                        borderColor: 'rgba(134, 121, 105, 0.2)',
                        color: '#867969',
                        fontWeight: '500'
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseDetails;
