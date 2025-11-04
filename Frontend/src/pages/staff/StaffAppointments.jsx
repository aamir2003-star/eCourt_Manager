// src/pages/staff/StaffAppointments.jsx - UPDATED WITH LIGHT THEME
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const StaffAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments');
      setAppointments(response.data.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/appointments/${id}`, { status });
      fetchAppointments();
      alert(`Appointment ${status} successfully`);
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Failed to update appointment');
    }
  };

  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const confirmedAppointments = appointments.filter(a => a.status === 'confirmed');
  const completedAppointments = appointments.filter(a => a.status === 'completed');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64" style={{ backgroundColor: '#E9E8E6' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderBottomColor: '#867969' }}></div>
          <p style={{ color: '#6b7280' }}>Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#E9E8E6' }}>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: '#1f2937' }}>Appointments</h1>
        <p className="mt-2" style={{ color: '#6b7280' }}>Manage client appointments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          className="rounded-lg shadow-md p-4 transform hover:-translate-y-1 transition"
          style={{
            backgroundColor: '#f5f1ed',
            borderLeftWidth: '4px',
            borderLeftColor: '#867969'
          }}
        >
          <p className="text-sm" style={{ color: '#9ca3af' }}>Total</p>
          <p className="text-2xl font-bold mt-1" style={{ color: '#1f2937' }}>{appointments.length}</p>
        </div>
        <div
          className="rounded-lg shadow-md p-4 transform hover:-translate-y-1 transition"
          style={{
            backgroundColor: '#f5f1ed',
            borderLeftWidth: '4px',
            borderLeftColor: '#f59e0b'
          }}
        >
          <p className="text-sm" style={{ color: '#9ca3af' }}>Pending</p>
          <p className="text-2xl font-bold mt-1" style={{ color: '#1f2937' }}>{pendingAppointments.length}</p>
        </div>
        <div
          className="rounded-lg shadow-md p-4 transform hover:-translate-y-1 transition"
          style={{
            backgroundColor: '#f5f1ed',
            borderLeftWidth: '4px',
            borderLeftColor: '#10b981'
          }}
        >
          <p className="text-sm" style={{ color: '#9ca3af' }}>Confirmed</p>
          <p className="text-2xl font-bold mt-1" style={{ color: '#1f2937' }}>{confirmedAppointments.length}</p>
        </div>
        <div
          className="rounded-lg shadow-md p-4 transform hover:-translate-y-1 transition"
          style={{
            backgroundColor: '#f5f1ed',
            borderLeftWidth: '4px',
            borderLeftColor: '#6b7280'
          }}
        >
          <p className="text-sm" style={{ color: '#9ca3af' }}>Completed</p>
          <p className="text-2xl font-bold mt-1" style={{ color: '#1f2937' }}>{completedAppointments.length}</p>
        </div>
      </div>

      {/* Pending Appointments */}
      {pendingAppointments.length > 0 && (
        <div className="rounded-xl shadow-md p-6" style={{ backgroundColor: '#f5f1ed' }}>
          <h2 className="text-xl font-semibold mb-4 flex items-center" style={{ color: '#1f2937' }}>
            <Clock className="h-5 w-5 mr-2" style={{ color: '#f59e0b' }} />
            Pending Approval
          </h2>
          <div className="space-y-4">
            {pendingAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="rounded-lg p-4"
                style={{
                  backgroundColor: 'rgba(249, 191, 36, 0.08)',
                  borderWidth: '1px',
                  borderColor: 'rgba(249, 191, 36, 0.3)'
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="h-4 w-4" style={{ color: '#6b7280' }} />
                      <span className="font-semibold" style={{ color: '#1f2937' }}>
                        {appointment.client?.f_name} {appointment.client?.l_name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm" style={{ color: '#6b7280' }}>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" style={{ color: '#867969' }} />
                        {new Date(appointment.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" style={{ color: '#867969' }} />
                        {appointment.time}
                      </div>
                    </div>
                    {appointment.description && (
                      <p className="text-sm mt-2" style={{ color: '#6b7280' }}>{appointment.description}</p>
                    )}
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleStatusChange(appointment._id, 'confirmed')}
                      className="text-white px-4 py-2 rounded-lg hover:shadow-md transition flex items-center space-x-1 font-medium"
                      style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Confirm</span>
                    </button>
                    <button
                      onClick={() => handleStatusChange(appointment._id, 'cancelled')}
                      className="text-white px-4 py-2 rounded-lg hover:shadow-md transition flex items-center space-x-1 font-medium"
                      style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmed Appointments */}
      {confirmedAppointments.length > 0 && (
        <div className="rounded-xl shadow-md p-6" style={{ backgroundColor: '#f5f1ed' }}>
          <h2 className="text-xl font-semibold mb-4 flex items-center" style={{ color: '#1f2937' }}>
            <CheckCircle className="h-5 w-5 mr-2" style={{ color: '#10b981' }} />
            Confirmed Appointments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {confirmedAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="rounded-lg p-4"
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.08)',
                  borderWidth: '1px',
                  borderColor: 'rgba(16, 185, 129, 0.3)'
                }}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <User className="h-4 w-4" style={{ color: '#6b7280' }} />
                  <span className="font-semibold" style={{ color: '#1f2937' }}>
                    {appointment.client?.f_name} {appointment.client?.l_name}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm" style={{ color: '#6b7280' }}>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" style={{ color: '#867969' }} />
                    {new Date(appointment.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" style={{ color: '#867969' }} />
                    {appointment.time}
                  </div>
                </div>
                {appointment.description && (
                  <p className="text-sm mt-2" style={{ color: '#6b7280' }}>{appointment.description}</p>
                )}
                <button
                  onClick={() => handleStatusChange(appointment._id, 'completed')}
                  className="mt-3 w-full text-white px-4 py-2 rounded-lg hover:shadow-md transition text-sm font-medium"
                  style={{ background: 'linear-gradient(135deg, #867969 0%, #a89983 100%)' }}
                >
                  Mark as Completed
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Appointments */}
      {completedAppointments.length > 0 && (
        <div className="rounded-xl shadow-md p-6" style={{ backgroundColor: '#f5f1ed' }}>
          <h2 className="text-xl font-semibold mb-4 flex items-center" style={{ color: '#1f2937' }}>
            <CheckCircle className="h-5 w-5 mr-2" style={{ color: '#10b981' }} />
            Completed Appointments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="rounded-lg p-4"
                style={{
                  backgroundColor: 'rgba(107, 114, 128, 0.05)',
                  borderWidth: '1px',
                  borderColor: 'rgba(134, 121, 105, 0.2)'
                }}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <User className="h-4 w-4" style={{ color: '#6b7280' }} />
                  <span className="font-semibold" style={{ color: '#1f2937' }}>
                    {appointment.client?.f_name} {appointment.client?.l_name}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm" style={{ color: '#9ca3af' }}>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" style={{ color: '#867969' }} />
                    {new Date(appointment.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" style={{ color: '#867969' }} />
                    {appointment.time}
                  </div>
                </div>
                {appointment.description && (
                  <p className="text-sm mt-2" style={{ color: '#9ca3af' }}>{appointment.description}</p>
                )}
                <span
                  className="inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    color: '#10b981'
                  }}
                >
                  ✓ Completed
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {appointments.length === 0 && (
        <div className="rounded-xl shadow-md p-12 text-center" style={{ backgroundColor: '#f5f1ed' }}>
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full" style={{ backgroundColor: 'rgba(134, 121, 105, 0.1)' }}>
              <AlertCircle className="h-16 w-16" style={{ color: '#9ca3af' }} />
            </div>
          </div>
          <p className="text-lg" style={{ color: '#9ca3af' }}>No appointments yet</p>
          <p className="text-sm mt-2" style={{ color: '#9ca3af' }}>Appointments will appear here when created</p>
        </div>
      )}
    </div>
  );
};

export default StaffAppointments;
