// src/pages/admin/AllCases.jsx - UPDATED WITH LIGHT THEME
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, Eye, Edit, Trash2, Briefcase, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const AllCases = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    fetchCases();
  }, []);

  useEffect(() => {
    filterCases();
  }, [searchTerm, statusFilter, typeFilter, cases]);

  const fetchCases = async () => {
    try {
      const response = await api.get('/cases');
      setCases(response.data.data);
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCases = () => {
    let filtered = cases;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(c => c.case_type === typeFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.case_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCases(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this case?')) {
      try {
        await api.delete(`/cases/${id}`);
        fetchCases();
        alert('Case deleted successfully');
      } catch (error) {
        console.error('Error deleting case:', error);
        alert('Failed to delete case');
      }
    }
  };

  const caseTypes = ['Civil', 'Criminal', 'Family', 'Commercial', 'Property', 'Labour', 'Other'];

  const getCategoryCounts = () => {
    const counts = {};
    caseTypes.forEach(type => {
      counts[type] = cases.filter(c => c.case_type === type).length;
    });
    return counts;
  };

  const categoryCounts = getCategoryCounts();

  const getStatusColor = (status) => {
    switch(status) {
      case 'active':
        return { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981' };
      case 'pending':
        return { bg: 'rgba(249, 191, 36, 0.1)', text: '#f59e0b' };
      case 'closed':
        return { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280' };
      case 'on-hold':
        return { bg: 'rgba(249, 115, 22, 0.1)', text: '#f97316' };
      default:
        return { bg: 'rgba(134, 121, 105, 0.1)', text: '#867969' };
    }
  };

  return (
    <div className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#E9E8E6' }}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#1f2937' }}>All Cases</h1>
          <p className="mt-2" style={{ color: '#6b7280' }}>Manage all cases in the system</p>
        </div>
        <button
          onClick={() => navigate('/admin/cases/new')}
          className="text-white px-6 py-3 rounded-lg hover:shadow-lg transition flex items-center space-x-2 shadow-md font-semibold transform hover:-translate-y-1"
          style={{ background: 'linear-gradient(135deg, #867969 0%, #a89983 100%)' }}
        >
          <Plus className="h-5 w-5" />
          <span>Create Case</span>
        </button>
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {caseTypes.map(type => (
          <div
            key={type}
            onClick={() => setTypeFilter(typeFilter === type ? 'all' : type)}
            className="rounded-lg shadow-md p-4 cursor-pointer transition-all transform hover:-translate-y-1 hover:shadow-lg"
            style={{
              backgroundColor: typeFilter === type ? 'rgba(134, 121, 105, 0.15)' : '#f5f1ed',
              borderWidth: typeFilter === type ? '2px' : '1px',
              borderColor: typeFilter === type ? '#867969' : 'rgba(134, 121, 105, 0.2)'
            }}
          >
            <p className="text-xs mb-1" style={{ color: '#9ca3af' }}>{type}</p>
            <p className="text-2xl font-bold" style={{ color: '#1f2937' }}>{categoryCounts[type] || 0}</p>
          </div>
        ))}
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
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 rounded-lg outline-none"
            style={{
              backgroundColor: '#ffffff',
              borderWidth: '1px',
              borderColor: 'rgba(134, 121, 105, 0.2)',
              color: '#1f2937'
            }}
          >
            <option value="all">All Types</option>
            {caseTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

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

      {/* Cases Table */}
      <div className="rounded-lg shadow-md overflow-hidden" style={{ backgroundColor: '#f5f1ed' }}>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderBottomColor: '#867969' }}></div>
            <p style={{ color: '#6b7280' }}>Loading cases...</p>
          </div>
        ) : filteredCases.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full" style={{ backgroundColor: 'rgba(134, 121, 105, 0.1)' }}>
                <AlertCircle className="h-16 w-16" style={{ color: '#9ca3af' }} />
              </div>
            </div>
            <p style={{ color: '#9ca3af' }} className="font-medium">No cases found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead style={{ backgroundColor: 'rgba(134, 121, 105, 0.08)' }}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase" style={{ color: '#867969' }}>Case</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase" style={{ color: '#867969' }}>Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase" style={{ color: '#867969' }}>Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase" style={{ color: '#867969' }}>Lawyer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase" style={{ color: '#867969' }}>Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase" style={{ color: '#867969' }}>Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase" style={{ color: '#867969' }}>Actions</th>
                </tr>
              </thead>
              <tbody style={{ borderColor: 'rgba(134, 121, 105, 0.2)' }}>
                {filteredCases.map((caseItem) => (
                  <tr
                    key={caseItem._id}
                    className="border-b hover:opacity-75 transition"
                    style={{
                      borderColor: 'rgba(134, 121, 105, 0.2)',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium" style={{ color: '#1f2937' }}>{caseItem.case_title}</p>
                        <p className="text-xs line-clamp-1" style={{ color: '#9ca3af' }}>{caseItem.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: 'rgba(134, 121, 105, 0.1)', color: '#867969' }}>
                        {caseItem.case_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: '#6b7280' }}>
                      {caseItem.client?.f_name} {caseItem.client?.l_name}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: '#6b7280' }}>
                      {caseItem.staff?.f_name} {caseItem.staff?.l_name}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: getStatusColor(caseItem.status).bg,
                          color: getStatusColor(caseItem.status).text
                        }}
                      >
                        {caseItem.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: '#6b7280' }}>
                      {new Date(caseItem.case_reg_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => navigate(`/admin/cases/${caseItem._id}`)}
                          className="transition hover:opacity-70"
                          style={{ color: '#867969' }}
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/admin/cases/${caseItem._id}/edit`)}
                          className="transition hover:opacity-70"
                          style={{ color: '#10b981' }}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(caseItem._id)}
                          className="transition hover:opacity-70"
                          style={{ color: '#ef4444' }}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCases;
