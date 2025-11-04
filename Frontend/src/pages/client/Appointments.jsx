// src/pages/client/Appointments.jsx - UPDATED WITH LIGHT THEME
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    staff: '',
    date: '',
    time: '',
    description: ''
  });
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    fetchAppointments();
    fetchStaff();
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

  const fetchStaff = async () => {
    try {
      const response = await api.get('/users?role=staff');
      setStaff(response.data.data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/appointments', formData);
      setShowForm(false);
      setFormData({ staff: '', date: '', time: '', description: '' });
      fetchAppointments();
      alert('Appointment requested successfully');
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Failed to create appointment');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981' };
      case 'pending':
        return { bg: 'rgba(251, 191, 36, 0.15)', text: '#d97706' };
      case 'completed':
        return { bg: 'rgba(59, 130, 246, 0.15)', text: '#3b82f6' };
      case 'cancelled':
        return { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444' };
      default:
        return { bg: 'rgba(107, 114, 128, 0.15)', text: '#6b7280' };
    }
  };

  return (
    <div className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#E9E8E6' }}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#1f2937' }}>Appointments</h1>
          <p className="mt-2" style={{ color: '#6b7280' }}>Schedule meetings with your lawyer</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all transform hover:-translate-y-1 flex items-center space-x-2 font-semibold"
          style={{ background: 'linear-gradient(135deg, #867969 0%, #a89983 100%)' }}
        >
          <Plus className="h-5 w-5" />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: '#f5f1ed' }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#1f2937' }}>Book New Appointment</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1f2937' }}>
                Select Lawyer
              </label>
              <select
                value={formData.staff}
                onChange={(e) => setFormData({...formData, staff: e.target.value})}
                required
                className="w-full px-4 py-2 rounded-lg outline-none"
                style={{
                  backgroundColor: '#ffffff',
                  borderWidth: '1px',
                  borderColor: 'rgba(134, 121, 105, 0.2)',
                  color: '#1f2937'
                }}
              >
                <option value="">Choose a lawyer</option>
                {staff.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.f_name} {s.l_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1f2937' }}>Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                  className="w-full px-4 py-2 rounded-lg outline-none"
                  style={{
                    backgroundColor: '#ffffff',
                    borderWidth: '1px',
                    borderColor: 'rgba(134, 121, 105, 0.2)',
                    color: '#1f2937'
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1f2937' }}>Time</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  required
                  className="w-full px-4 py-2 rounded-lg outline-none"
                  style={{
                    backgroundColor: '#ffffff',
                    borderWidth: '1px',
                    borderColor: 'rgba(134, 121, 105, 0.2)',
                    color: '#1f2937'
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1f2937' }}>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="3"
                className="w-full px-4 py-2 rounded-lg outline-none resize-none"
                style={{
                  backgroundColor: '#ffffff',
                  borderWidth: '1px',
                  borderColor: 'rgba(134, 121, 105, 0.2)',
                  color: '#1f2937'
                }}
                placeholder="Brief description of the meeting purpose"
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 text-white py-2 rounded-lg hover:shadow-lg transition-all font-semibold"
                style={{ background: 'linear-gradient(135deg, #867969 0%, #a89983 100%)' }}
              >
                Book Appointment
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 py-2 rounded-lg hover:shadow-md transition-all font-semibold"
                style={{
                  backgroundColor: '#ffffff',
                  borderWidth: '1px',
                  borderColor: 'rgba(134, 121, 105, 0.2)',
                  color: '#1f2937'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4" style={{ borderBottomColor: '#867969' }}></div>
            <p style={{ color: '#6b7280' }}>Loading appointments...</p>
          </div>
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-16 rounded-lg" style={{ backgroundColor: '#f5f1ed' }}>
          <AlertCircle className="h-16 w-16 mx-auto mb-4" style={{ color: '#d1d5db' }} />
          <p style={{ color: '#9ca3af' }}>No appointments scheduled yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((appointment) => {
            const statusColor = getStatusColor(appointment.status);
            return (
              <div 
                key={appointment._id} 
                className="rounded-lg shadow-md p-6 hover:shadow-lg transition-all transform hover:-translate-y-1"
                style={{ backgroundColor: '#f5f1ed' }}
              >
                {/* Status Badge */}
                <div className="mb-4">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-medium capitalize"
                    style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
                  >
                    {appointment.status}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div className="flex items-center" style={{ color: '#6b7280' }}>
                    <Calendar className="h-5 w-5 mr-2" style={{ color: '#867969' }} />
                    <span className="font-medium">{new Date(appointment.date).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center" style={{ color: '#6b7280' }}>
                    <Clock className="h-5 w-5 mr-2" style={{ color: '#867969' }} />
                    <span className="font-medium">{appointment.time}</span>
                  </div>

                  {appointment.staff && (
                    <div style={{ color: '#1f2937' }} className="pt-2" style={{ borderTopWidth: '1px', borderTopColor: 'rgba(134, 121, 105, 0.2)' }}>
                      <p className="text-sm" style={{ color: '#6b7280' }}>With</p>
                      <p className="font-semibold">{appointment.staff.f_name} {appointment.staff.l_name}</p>
                    </div>
                  )}

                  {appointment.description && (
                    <p className="text-sm" style={{ color: '#6b7280' }}>{appointment.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Appointments;
