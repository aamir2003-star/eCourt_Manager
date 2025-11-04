// src/pages/staff/ManageCases.jsx - UPDATED WITH LIGHT THEME
import React, { useState } from 'react';
import { Plus, Search, Filter, AlertCircle } from 'lucide-react';
import { useCase } from '../../context/CaseContext';
import CaseCard from '../../components/CaseCard';
import { useNavigate } from 'react-router-dom';

const ManageCases = () => {
  const { cases, loading } = useCase();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = caseItem.case_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseItem.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || caseItem.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#E9E8E6' }}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#1f2937' }}>Manage Cases</h1>
          <p className="mt-2" style={{ color: '#6b7280' }}>View and manage all your cases</p>
        </div>
        <button
          onClick={() => navigate('/staff/cases/new')}
          className="text-white px-6 py-3 rounded-lg transition flex items-center space-x-2 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1"
          style={{ background: 'linear-gradient(135deg, #867969 0%, #a89983 100%)' }}
        >
          <Plus className="h-5 w-5" />
          <span>New Case</span>
        </button>
      </div>

      {/* Filter Card */}
      <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: '#f5f1ed' }}>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search Input */}
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
          
          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5" style={{ color: '#9ca3af' }} />
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

        {/* Cases Grid or Messages */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderBottomColor: '#867969' }}></div>
            <p style={{ color: '#6b7280' }}>Loading cases...</p>
          </div>
        ) : filteredCases.length === 0 ? (
          <div className="text-center py-16">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full" style={{ backgroundColor: 'rgba(134, 121, 105, 0.1)' }}>
                <AlertCircle className="h-12 w-12" style={{ color: '#9ca3af' }} />
              </div>
            </div>
            <p style={{ color: '#9ca3af' }} className="font-medium">No cases found</p>
            <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>
              {searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Create your first case to get started'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCases.map((caseItem) => (
              <CaseCard key={caseItem._id} caseData={caseItem} role="staff" />
            ))}
          </div>
        )}
      </div>

      {/* Stats Card */}
      {filteredCases.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-lg shadow-md p-4" style={{ backgroundColor: '#f5f1ed' }}>
            <p className="text-sm" style={{ color: '#6b7280' }}>Total Cases</p>
            <p className="text-2xl font-bold mt-1" style={{ color: '#1f2937' }}>
              {filteredCases.length}
            </p>
          </div>

          <div className="rounded-lg shadow-md p-4" style={{ backgroundColor: '#f5f1ed' }}>
            <p className="text-sm" style={{ color: '#6b7280' }}>Active</p>
            <p className="text-2xl font-bold mt-1" style={{ color: '#10b981' }}>
              {filteredCases.filter(c => c.status === 'active').length}
            </p>
          </div>

          <div className="rounded-lg shadow-md p-4" style={{ backgroundColor: '#f5f1ed' }}>
            <p className="text-sm" style={{ color: '#6b7280' }}>Pending</p>
            <p className="text-2xl font-bold mt-1" style={{ color: '#d97706' }}>
              {filteredCases.filter(c => c.status === 'pending').length}
            </p>
          </div>

          <div className="rounded-lg shadow-md p-4" style={{ backgroundColor: '#f5f1ed' }}>
            <p className="text-sm" style={{ color: '#6b7280' }}>Closed</p>
            <p className="text-2xl font-bold mt-1" style={{ color: '#6b7280' }}>
              {filteredCases.filter(c => c.status === 'closed').length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCases;
