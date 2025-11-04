// src/pages/admin/ManageCaseRequests.jsx - UPDATED WITH LIGHT THEME
import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, CheckCircle, XCircle, Eye, 
  Clock, User, FileText, Calendar, AlertCircle
} from 'lucide-react';
import api from '../../services/api';

const ManageCaseRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState('');
const [lawyers, setLawyers] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchLawyers = async () => {
  try {
    const response = await api.get('/users?role=staff');
    setLawyers(response.data.data);
  } catch (error) {
    console.error('Error fetching lawyers:', error);
  }
};



  useEffect(() => {
  fetchLawyers();
}, []);

  useEffect(() => {
    filterRequests();
  }, [searchTerm, statusFilter, requests]);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/case-requests');
      setRequests(response.data.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = requests;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.case_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.case_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.client?.f_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRequests(filtered);
  };

  // Update handleAction function
const handleAction = async (requestId, status) => {
  if (status === 'approved' && !selectedLawyer) {
    alert('Please assign a lawyer to this case');
    return;
  }

  setActionLoading(true);
  try {
    await api.put(`/case-requests/${requestId}`, {
      status,
      admin_notes: adminNotes,
      assign_to_staff: status === 'approved' ? selectedLawyer : null
    });

    fetchRequests();
    setShowModal(false);
    setSelectedRequest(null);
    setAdminNotes('');
    setSelectedLawyer('');
    alert(`Request ${status} successfully!`);
  } catch (error) {
    console.error('Error updating request:', error);
    alert('Failed to update request');
  } finally {
    setActionLoading(false);
  }
};
  const openModal = (request) => {
    setSelectedRequest(request);
    setAdminNotes(request.admin_notes || '');
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return { bg: 'rgba(251, 191, 36, 0.15)', text: '#d97706' };
      case 'approved':
        return { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981' };
      case 'rejected':
        return { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444' };
      default:
        return { bg: 'rgba(107, 114, 128, 0.15)', text: '#6b7280' };
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high':
        return { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444' };
      case 'medium':
        return { bg: 'rgba(251, 191, 36, 0.15)', text: '#d97706' };
      case 'low':
        return { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981' };
      default:
        return { bg: 'rgba(107, 114, 128, 0.15)', text: '#6b7280' };
    }
  };

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length
  };

  return (
    <div className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#E9E8E6' }}>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: '#1f2937' }}>Manage Case Requests</h1>
        <p className="mt-2" style={{ color: '#6b7280' }}>Review and approve client case requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-lg shadow-md p-4" style={{ backgroundColor: '#f5f1ed', borderLeftWidth: '4px', borderLeftColor: '#867969' }}>
          <p className="text-sm" style={{ color: '#6b7280' }}>Total Requests</p>
          <p className="text-2xl font-bold mt-1" style={{ color: '#1f2937' }}>{stats.total}</p>
        </div>
        <div className="rounded-lg shadow-md p-4" style={{ backgroundColor: '#f5f1ed', borderLeftWidth: '4px', borderLeftColor: '#d97706' }}>
          <p className="text-sm" style={{ color: '#6b7280' }}>Pending</p>
          <p className="text-2xl font-bold mt-1" style={{ color: '#1f2937' }}>{stats.pending}</p>
        </div>
        <div className="rounded-lg shadow-md p-4" style={{ backgroundColor: '#f5f1ed', borderLeftWidth: '4px', borderLeftColor: '#10b981' }}>
          <p className="text-sm" style={{ color: '#6b7280' }}>Approved</p>
          <p className="text-2xl font-bold mt-1" style={{ color: '#1f2937' }}>{stats.approved}</p>
        </div>
        <div className="rounded-lg shadow-md p-4" style={{ backgroundColor: '#f5f1ed', borderLeftWidth: '4px', borderLeftColor: '#ef4444' }}>
          <p className="text-sm" style={{ color: '#6b7280' }}>Rejected</p>
          <p className="text-2xl font-bold mt-1" style={{ color: '#1f2937' }}>{stats.rejected}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: '#f5f1ed' }}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: '#9ca3af' }} />
            <input
              type="text"
              placeholder="Search by title, type, or client..."
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
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="rounded-lg shadow-md" style={{ backgroundColor: '#f5f1ed' }}>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderBottomColor: '#867969' }}></div>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 mx-auto mb-4" style={{ color: '#d1d5db' }} />
            <p style={{ color: '#9ca3af' }}>No requests found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead style={{ backgroundColor: 'rgba(134, 121, 105, 0.1)', borderBottomWidth: '1px', borderBottomColor: 'rgba(134, 121, 105, 0.2)' }}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#6b7280' }}>
                    Case Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#6b7280' }}>
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#6b7280' }}>
                    Urgency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#6b7280' }}>
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#6b7280' }}>
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#6b7280' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => {
                  const statusColor = getStatusColor(request.status);
                  const urgencyColor = getUrgencyColor(request.urgency);
                  return (
                    <tr key={request._id} style={{ borderBottomWidth: '1px', borderBottomColor: 'rgba(134, 121, 105, 0.15)' }}>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium" style={{ color: '#1f2937' }}>{request.case_title}</p>
                          <p className="text-sm" style={{ color: '#6b7280' }}>{request.case_type}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2" style={{ color: '#9ca3af' }} />
                          <div>
                            <p className="text-sm font-medium" style={{ color: '#1f2937' }}>
                              {request.client?.f_name} {request.client?.l_name}
                            </p>
                            <p className="text-xs" style={{ color: '#9ca3af' }}>{request.client?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: urgencyColor.bg, color: urgencyColor.text }}>
                          {request.urgency}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: statusColor.bg, color: statusColor.text }}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm" style={{ color: '#6b7280' }}>
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(request.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => openModal(request)}
                          className="flex items-center space-x-1 transition-colors"
                          style={{ color: '#867969' }}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="text-sm">Review</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#f5f1ed' }}>
            <div className="p-6" style={{ borderBottomWidth: '1px', borderBottomColor: 'rgba(134, 121, 105, 0.2)' }}>
              <h2 className="text-2xl font-bold" style={{ color: '#1f2937' }}>Review Case Request</h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Case Details */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center" style={{ color: '#1f2937' }}>
                  <FileText className="h-5 w-5 mr-2" style={{ color: '#867969' }} />
                  Case Information
                </h3>
                <div className="rounded-lg p-4 space-y-3" style={{ backgroundColor: 'rgba(134, 121, 105, 0.08)' }}>
                  <div>
                    <p className="text-sm" style={{ color: '#6b7280' }}>Title</p>
                    <p className="font-medium" style={{ color: '#1f2937' }}>{selectedRequest.case_title}</p>
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: '#6b7280' }}>Type</p>
                    <p className="font-medium" style={{ color: '#1f2937' }}>{selectedRequest.case_type}</p>
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: '#6b7280' }}>Description</p>
                    <p style={{ color: '#1f2937' }}>{selectedRequest.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm" style={{ color: '#6b7280' }}>Urgency</p>
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: getUrgencyColor(selectedRequest.urgency).bg, color: getUrgencyColor(selectedRequest.urgency).text }}>
                        {selectedRequest.urgency}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: '#6b7280' }}>Status</p>
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: getStatusColor(selectedRequest.status).bg, color: getStatusColor(selectedRequest.status).text }}>
                        {selectedRequest.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Client Details */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center" style={{ color: '#1f2937' }}>
                  <User className="h-5 w-5 mr-2" style={{ color: '#867969' }} />
                  Client Information
                </h3>
                <div className="rounded-lg p-4 space-y-2" style={{ backgroundColor: 'rgba(134, 121, 105, 0.08)' }}>
                  <p><span style={{ color: '#6b7280' }}>Name:</span> <span className="font-medium" style={{ color: '#1f2937' }}>{selectedRequest.client?.f_name} {selectedRequest.client?.l_name}</span></p>
                  <p><span style={{ color: '#6b7280' }}>Email:</span> <span className="font-medium" style={{ color: '#1f2937' }}>{selectedRequest.client?.email}</span></p>
                  <p><span style={{ color: '#6b7280' }}>Contact:</span> <span className="font-medium" style={{ color: '#1f2937' }}>{selectedRequest.client?.contact}</span></p>
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1f2937' }}>
                  Admin Notes
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg outline-none"
                  style={{
                    backgroundColor: '#ffffff',
                    borderWidth: '1px',
                    borderColor: 'rgba(134, 121, 105, 0.2)',
                    color: '#1f2937'
                  }}
                  placeholder="Add notes for this request..."
                />
              </div>
              {selectedRequest?.status === 'pending' && (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Assign to Lawyer *
    </label>
    <select
      value={selectedLawyer}
      onChange={(e) => setSelectedLawyer(e.target.value)}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      required
    >
      <option value="">Select a lawyer</option>
      {lawyers.map((lawyer) => (
        <option key={lawyer._id} value={lawyer._id}>
          {lawyer.f_name} {lawyer.l_name} 
          {lawyer.qualification && ` - ${lawyer.qualification}`}
        </option>
      ))}
    </select>
  </div>
)}

              {/* Actions */}
              {selectedRequest.status === 'pending' && (
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleAction(selectedRequest._id, 'approved')}
                    disabled={actionLoading}
                    className="flex-1 text-white py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center space-x-2"
                    style={{ backgroundColor: '#10b981' }}
                  >
                    <CheckCircle className="h-5 w-5" />
                    <span>{actionLoading ? 'Processing...' : 'Approve'}</span>
                  </button>
                  <button
                    onClick={() => handleAction(selectedRequest._id, 'rejected')}
                    disabled={actionLoading}
                    className="flex-1 text-white py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center space-x-2"
                    style={{ backgroundColor: '#ef4444' }}
                  >
                    <XCircle className="h-5 w-5" />
                    <span>{actionLoading ? 'Processing...' : 'Reject'}</span>
                  </button>
                </div>
              )}

              <button
                onClick={() => setShowModal(false)}
                className="w-full py-3 rounded-lg transition"
                style={{
                  backgroundColor: '#ffffff',
                  borderWidth: '1px',
                  borderColor: 'rgba(134, 121, 105, 0.2)',
                  color: '#1f2937'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCaseRequests;
