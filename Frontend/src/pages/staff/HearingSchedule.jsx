// src/pages/staff/HearingSchedule.jsx - UPDATED WITH LIGHT THEME
import React, { useState, useEffect } from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const HearingSchedule = () => {
  const [hearings, setHearings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHearings();
  }, []);

  const fetchHearings = async () => {
    try {
      const casesRes = await api.get('/cases');
      const allHearings = [];
      
      for (const caseItem of casesRes.data.data) {
        const caseDetails = await api.get(`/cases/${caseItem._id}`);
        if (caseDetails.data.data.hearings) {
          caseDetails.data.data.hearings.forEach(hearing => {
            allHearings.push({
              ...hearing,
              case: caseItem
            });
          });
        }
      }
      
      setHearings(allHearings.sort((a, b) => new Date(a.hearing_date) - new Date(b.hearing_date)));
    } catch (error) {
      console.error('Error fetching hearings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return { bg: 'rgba(134, 121, 105, 0.15)', text: '#867969' };
      case 'completed':
        return { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981' };
      case 'postponed':
        return { bg: 'rgba(251, 191, 36, 0.15)', text: '#d97706' };
      case 'cancelled':
        return { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444' };
      default:
        return { bg: 'rgba(107, 114, 128, 0.15)', text: '#6b7280' };
    }
  };

  return (
    <div className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#E9E8E6' }}>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: '#1f2937' }}>Hearing Schedule</h1>
        <p className="mt-2" style={{ color: '#6b7280' }}>View all upcoming and past hearings</p>
      </div>

      {/* Hearings Container */}
      <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: '#f5f1ed' }}>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderBottomColor: '#867969' }}></div>
            <p style={{ color: '#6b7280' }}>Loading hearings...</p>
          </div>
        ) : hearings.length === 0 ? (
          <div className="text-center py-16">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full" style={{ backgroundColor: 'rgba(134, 121, 105, 0.1)' }}>
                <Calendar className="h-12 w-12" style={{ color: '#9ca3af' }} />
              </div>
            </div>
            <p style={{ color: '#9ca3af' }}>No hearings scheduled</p>
          </div>
        ) : (
          <div className="space-y-4">
            {hearings.map((hearing) => {
              const statusColor = getStatusColor(hearing.status);
              return (
                <div 
                  key={hearing._id} 
                  className="rounded-lg p-4 hover:shadow-md transition transform hover:-translate-y-0.5"
                  style={{
                    backgroundColor: '#ffffff',
                    borderWidth: '1px',
                    borderColor: 'rgba(134, 121, 105, 0.2)'
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {/* Case Title */}
                      <h3 className="font-semibold mb-3" style={{ color: '#1f2937' }}>
                        {hearing.case.case_title}
                      </h3>

                      {/* Date */}
                      <div className="flex items-center mb-2">
                        <Calendar className="h-4 w-4 mr-2" style={{ color: '#867969' }} />
                        <span style={{ color: '#6b7280' }}>
                          {new Date(hearing.hearing_date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>

                      {/* Remarks */}
                      {hearing.remarks && (
                        <p className="text-sm" style={{ color: '#6b7280' }}>
                          <span className="font-medium">Remarks:</span> {hearing.remarks}
                        </p>
                      )}

                      {/* Case Type */}
                      <div className="mt-2">
                        <span 
                          className="text-xs px-2 py-1 rounded font-medium"
                          style={{ 
                            backgroundColor: 'rgba(134, 121, 105, 0.1)',
                            color: '#867969'
                          }}
                        >
                          {hearing.case.case_type}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-medium capitalize ml-4 flex-shrink-0"
                      style={{ 
                        backgroundColor: statusColor.bg,
                        color: statusColor.text
                      }}
                    >
                      {hearing.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Stats Card */}
      {hearings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-lg shadow-md p-4" style={{ backgroundColor: '#f5f1ed' }}>
            <p className="text-sm" style={{ color: '#6b7280' }}>Total Hearings</p>
            <p className="text-2xl font-bold mt-1" style={{ color: '#1f2937' }}>
              {hearings.length}
            </p>
          </div>

          <div className="rounded-lg shadow-md p-4" style={{ backgroundColor: '#f5f1ed' }}>
            <p className="text-sm" style={{ color: '#6b7280' }}>Scheduled</p>
            <p className="text-2xl font-bold mt-1" style={{ color: '#867969' }}>
              {hearings.filter(h => h.status === 'scheduled').length}
            </p>
          </div>

          <div className="rounded-lg shadow-md p-4" style={{ backgroundColor: '#f5f1ed' }}>
            <p className="text-sm" style={{ color: '#6b7280' }}>Completed</p>
            <p className="text-2xl font-bold mt-1" style={{ color: '#10b981' }}>
              {hearings.filter(h => h.status === 'completed').length}
            </p>
          </div>

          <div className="rounded-lg shadow-md p-4" style={{ backgroundColor: '#f5f1ed' }}>
            <p className="text-sm" style={{ color: '#6b7280' }}>Pending</p>
            <p className="text-2xl font-bold mt-1" style={{ color: '#d97706' }}>
              {hearings.filter(h => h.status === 'postponed').length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HearingSchedule;
