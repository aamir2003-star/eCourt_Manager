// src/pages/client/MyCaseRequests.jsx - UPDATED WITH LIGHT THEME
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const MyCaseRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5" style={{ color: '#f59e0b' }} />;
      case 'approved':
        return <CheckCircle className="h-5 w-5" style={{ color: '#10b981' }} />;
      case 'rejected':
        return <XCircle className="h-5 w-5" style={{ color: '#ef4444' }} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return { bg: 'rgba(251, 191, 36, 0.15)', text: '#d97706', border: 'rgba(251, 191, 36, 0.3)' };
      case 'approved':
        return { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981', border: 'rgba(16, 185, 129, 0.3)' };
      case 'rejected':
        return { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444', border: 'rgba(239, 68, 68, 0.3)' };
      default:
        return { bg: 'rgba(107, 114, 128, 0.15)', text: '#6b7280', border: 'rgba(107, 114, 128, 0.3)' };
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#E9E8E6' }}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#1f2937' }}>My Case Requests</h1>
          <p className="mt-2" style={{ color: '#6b7280' }}>Track your case registration requests</p>
        </div>
        <button
          onClick={() => navigate('/client/request-case')}
          className="text-white px-6 py-3 rounded-lg hover:shadow-lg transition flex items-center space-x-2 font-medium shadow-md transform hover:-translate-y-1"
          style={{ background: 'linear-gradient(135deg, #867969 0%, #a89983 100%)' }}
        >
          <Plus className="h-5 w-5" />
          <span>New Request</span>
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderBottomColor: '#867969' }}></div>
        </div>
      ) : requests.length === 0 ? (
        <div className="rounded-xl shadow-lg p-12 text-center" style={{ backgroundColor: '#f5f1ed' }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(134, 121, 105, 0.15)' }}>
            <Clock className="h-10 w-10" style={{ color: '#9ca3af' }} />
          </div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: '#1f2937' }}>No Requests Yet</h3>
          <p className="mb-6" style={{ color: '#6b7280' }}>Submit your first case request to get started</p>
          <button
            onClick={() => navigate('/client/request-case')}
            className="text-white px-8 py-3 rounded-lg hover:shadow-lg transition inline-flex items-center space-x-2 font-medium transform hover:-translate-y-1"
            style={{ background: 'linear-gradient(135deg, #867969 0%, #a89983 100%)' }}
          >
            <Plus className="h-5 w-5" />
            <span>Request New Case</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {requests.map((request) => {
            const statusColor = getStatusColor(request.status);
            return (
              <div 
                key={request._id} 
                className="rounded-xl shadow-lg p-6 hover:shadow-xl transition transform hover:-translate-y-1"
                style={{ 
                  backgroundColor: '#f5f1ed',
                  borderWidth: '1px',
                  borderColor: 'rgba(134, 121, 105, 0.2)'
                }}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1" style={{ color: '#1f2937' }}>
                      {request.case_title}
                    </h3>
                    <p className="text-sm" style={{ color: '#6b7280' }}>{request.case_type}</p>
                  </div>
                  <div 
                    className="flex items-center space-x-2 px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: statusColor.bg,
                      color: statusColor.text,
                      borderWidth: '1px',
                      borderColor: statusColor.border
                    }}
                  >
                    {getStatusIcon(request.status)}
                    <span className="text-sm font-medium capitalize">{request.status}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm mb-4 line-clamp-3" style={{ color: '#6b7280' }}>
                  {request.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4" style={{ borderTopWidth: '1px', borderTopColor: 'rgba(134, 121, 105, 0.2)' }}>
                  <div className="flex items-center space-x-4 text-sm" style={{ color: '#9ca3af' }}>
                    <span className="flex items-center">
                      <span 
                        className="w-2 h-2 rounded-full mr-2"
                        style={{ backgroundColor: getUrgencyColor(request.urgency) }}
                      ></span>
                      <span className="capitalize">{request.urgency} priority</span>
                    </span>
                    <span>{new Date(request.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Admin Notes */}
                {request.admin_notes && (
                  <div 
                    className="mt-4 p-3 rounded-lg"
                    style={{ backgroundColor: 'rgba(134, 121, 105, 0.08)' }}
                  >
                    <p className="text-xs font-medium mb-1" style={{ color: '#867969' }}>Admin Notes:</p>
                    <p className="text-sm" style={{ color: '#6b7280' }}>{request.admin_notes}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyCaseRequests;
