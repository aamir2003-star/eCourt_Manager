// src/pages/staff/HearingSchedule.jsx - UPDATED WITH LIGHT THEME
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertCircle, CheckCircle, Plus } from 'lucide-react';
import api from '../../services/api';

const HearingSchedule = () => {
  const [hearings, setHearings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHearing, setSelectedHearing] = useState(null);

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
      
      // Sort by date
      allHearings.sort((a, b) => new Date(a.hearing_date) - new Date(b.hearing_date));
      setHearings(allHearings);
    } catch (error) {
      console.error('Error fetching hearings:', error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingHearings = hearings.filter(h => new Date(h.hearing_date) >= new Date());
  const pastHearings = hearings.filter(h => new Date(h.hearing_date) < new Date());

  const isToday = (date) => {
    const today = new Date();
    const hearingDate = new Date(date);
    return today.toDateString() === hearingDate.toDateString();
  };

  const isTomorrow = (date) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const hearingDate = new Date(date);
    return tomorrow.toDateString() === hearingDate.toDateString();
  };

  const getDateLabel = (date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return new Date(date).toLocaleDateString();
  };

  const getHearingColor = (date) => {
    if (isToday(date)) {
      return { bg: 'rgba(239, 68, 68, 0.08)', border: '#ef4444' };
    }
    if (isTomorrow(date)) {
      return { bg: 'rgba(249, 115, 22, 0.08)', border: '#f97316' };
    }
    return { bg: 'rgba(134, 121, 105, 0.08)', border: '#867969' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64" style={{ backgroundColor: '#E9E8E6' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderBottomColor: '#867969' }}></div>
          <p style={{ color: '#6b7280' }}>Loading hearings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#E9E8E6' }}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#1f2937' }}>Hearing Schedule</h1>
          <p className="mt-2" style={{ color: '#6b7280' }}>View all your upcoming and past hearings</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl p-6 text-white shadow-md transform hover:-translate-y-1 transition" style={{ background: 'linear-gradient(135deg, #867969 0%, #a89983 100%)' }}>
          <Calendar className="h-8 w-8 mb-3" />
          <p className="text-sm opacity-90">Total Hearings</p>
          <p className="text-3xl font-bold">{hearings.length}</p>
        </div>
        <div className="rounded-xl p-6 text-white shadow-md transform hover:-translate-y-1 transition" style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' }}>
          <Clock className="h-8 w-8 mb-3" />
          <p className="text-sm opacity-90">Upcoming</p>
          <p className="text-3xl font-bold">{upcomingHearings.length}</p>
        </div>
        <div className="rounded-xl p-6 text-white shadow-md transform hover:-translate-y-1 transition" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
          <CheckCircle className="h-8 w-8 mb-3" />
          <p className="text-sm opacity-90">Completed</p>
          <p className="text-3xl font-bold">{pastHearings.length}</p>
        </div>
      </div>

      {/* Upcoming Hearings */}
      <div className="rounded-xl shadow-md p-6" style={{ backgroundColor: '#f5f1ed' }}>
        <h2 className="text-xl font-semibold mb-4 flex items-center" style={{ color: '#1f2937' }}>
          <AlertCircle className="h-5 w-5 mr-2" style={{ color: '#f97316' }} />
          Upcoming Hearings
        </h2>
        {upcomingHearings.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full" style={{ backgroundColor: 'rgba(134, 121, 105, 0.1)' }}>
                <Calendar className="h-16 w-16" style={{ color: '#9ca3af' }} />
              </div>
            </div>
            <p style={{ color: '#9ca3af' }} className="font-medium">No upcoming hearings scheduled</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingHearings.map((hearing) => {
              const colors = getHearingColor(hearing.hearing_date);
              return (
                <div
                  key={hearing._id}
                  className="rounded-lg p-4 transition hover:shadow-md"
                  style={{
                    backgroundColor: colors.bg,
                    borderLeftWidth: '4px',
                    borderLeftColor: colors.border
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2" style={{ color: '#1f2937' }}>
                        {hearing.case.case_title}
                      </h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center" style={{ color: '#6b7280' }}>
                          <Calendar className="h-4 w-4 mr-2" style={{ color: '#867969' }} />
                          <span className="font-medium">{getDateLabel(hearing.hearing_date)}</span>
                          <span className="mx-2">•</span>
                          <span>{new Date(hearing.hearing_date).toLocaleTimeString()}</span>
                        </div>
                        {hearing.remarks && (
                          <p className="ml-6" style={{ color: '#6b7280' }}>{hearing.remarks}</p>
                        )}
                        <p className="ml-6" style={{ color: '#9ca3af' }}>
                          Client: {hearing.case.client?.f_name} {hearing.case.client?.l_name}
                        </p>
                      </div>
                    </div>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: hearing.status === 'scheduled' 
                          ? 'rgba(134, 121, 105, 0.1)' 
                          : hearing.status === 'completed'
                          ? 'rgba(16, 185, 129, 0.1)'
                          : 'rgba(107, 114, 128, 0.1)',
                        color: hearing.status === 'scheduled'
                          ? '#867969'
                          : hearing.status === 'completed'
                          ? '#10b981'
                          : '#6b7280'
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

      {/* Past Hearings */}
      {pastHearings.length > 0 && (
        <div className="rounded-xl shadow-md p-6" style={{ backgroundColor: '#f5f1ed' }}>
          <h2 className="text-xl font-semibold mb-4 flex items-center" style={{ color: '#1f2937' }}>
            <CheckCircle className="h-5 w-5 mr-2" style={{ color: '#10b981' }} />
            Past Hearings
          </h2>
          <div className="space-y-3">
            {pastHearings.slice(0, 10).map((hearing) => (
              <div
                key={hearing._id}
                className="rounded-lg p-4"
                style={{
                  backgroundColor: 'rgba(134, 121, 105, 0.05)',
                  borderWidth: '1px',
                  borderColor: 'rgba(134, 121, 105, 0.2)'
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium mb-1" style={{ color: '#1f2937' }}>
                      {hearing.case.case_title}
                    </h3>
                    <div className="flex items-center text-sm" style={{ color: '#9ca3af' }}>
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(hearing.hearing_date).toLocaleDateString()}
                    </div>
                  </div>
                  <span
                    className="px-2 py-1 rounded text-xs font-medium"
                    style={{
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      color: '#10b981'
                    }}
                  >
                    {hearing.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {pastHearings.length > 10 && (
            <p className="text-center mt-4 text-sm" style={{ color: '#9ca3af' }}>
              Showing 10 of {pastHearings.length} past hearings
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default HearingSchedule;
