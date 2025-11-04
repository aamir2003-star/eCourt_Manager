// src/components/CaseAssignmentModal.jsx - NEW
import React, { useState, useEffect } from 'react';
import { X, Users, Lock } from 'lucide-react';
import api from '../services/api';
import { useSocket } from '../context/SocketContext';

const CaseAssignmentModal = ({ caseData, isOpen, onClose, onAssignmentComplete }) => {
  const { socket } = useSocket();
  const [staff, setStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(
    caseData?.assigned_staff?.map(s => s._id) || []
  );
  const [primaryLawyer, setPrimaryLawyer] = useState(caseData?.primary_lawyer?._id || '');
  const [classification, setClassification] = useState(caseData?.classification || 'public');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchStaff();
    }
  }, [isOpen]);

  const fetchStaff = async () => {
    try {
      const response = await api.get('/api/users?role=staff');
      setStaff(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch staff:', error);
    }
  };

  const handleStaffToggle = (staffId) => {
    setSelectedStaff(prev =>
      prev.includes(staffId)
        ? prev.filter(id => id !== staffId)
        : [...prev, staffId]
    );
  };

  const handleAssign = async () => {
    if (!primaryLawyer) {
      alert('Please select a primary lawyer');
      return;
    }

    try {
      setLoading(true);

      // Update case with new assignments
      await api.put(`/api/cases/${caseData._id}`, {
        assigned_staff: selectedStaff,
        primary_lawyer: primaryLawyer,
        classification: classification
      });

      // Emit Socket.io event for real-time update
      if (socket) {
        socket.emit('staff_assigned_to_case', {
          caseId: caseData._id,
          case_title: caseData.case_title,
          staffIds: selectedStaff,
          primaryLawyer: primaryLawyer
        });
      }

      onAssignmentComplete?.();
      onClose();
    } catch (error) {
      console.error('Assignment failed:', error);
      alert('Failed to assign staff. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div
        className="rounded-lg shadow-xl max-w-2xl w-full"
        style={{ backgroundColor: '#f5f1ed' }}
      >
        {/* Header */}
        <div
          className="p-6 flex items-center justify-between"
          style={{ borderBottom: '1px solid rgba(134, 121, 105, 0.2)' }}
        >
          <h2 className="text-2xl font-bold" style={{ color: '#1f2937' }}>
            Assign Staff to Case
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-300 rounded transition"
          >
            <X className="h-6 w-6" style={{ color: '#6b7280' }} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
          {/* Case Info */}
          <div>
            <p className="text-sm" style={{ color: '#6b7280' }}>Case</p>
            <p className="text-lg font-semibold" style={{ color: '#1f2937' }}>
              {caseData.case_title}
            </p>
          </div>

          {/* Classification */}
          <div>
            <label className="block text-sm font-semibold mb-3" style={{ color: '#1f2937' }}>
              <Lock className="inline h-4 w-4 mr-2" style={{ color: '#867969' }} />
              Case Classification
            </label>
            <div className="space-y-2">
              {['public', 'confidential', 'classified'].map(level => (
                <label key={level} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="classification"
                    value={level}
                    checked={classification === level}
                    onChange={(e) => setClassification(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="capitalize" style={{ color: '#1f2937' }}>
                    {level}
                    {level === 'public' && ' - Anyone can view'}
                    {level === 'confidential' && ' - Only assigned staff'}
                    {level === 'classified' && ' - Admin approval required'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Primary Lawyer */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#1f2937' }}>
              Primary Lawyer *
            </label>
            <select
              value={primaryLawyer}
              onChange={(e) => setPrimaryLawyer(e.target.value)}
              className="w-full px-4 py-2 rounded-lg outline-none"
              style={{
                backgroundColor: '#ffffff',
                borderWidth: '1px',
                borderColor: 'rgba(134, 121, 105, 0.2)',
                color: '#1f2937'
              }}
            >
              <option value="">Select Primary Lawyer</option>
              {staff.map(member => (
                <option key={member._id} value={member._id}>
                  {member.f_name} {member.l_name} - {member.qualification || 'No qualification'}
                </option>
              ))}
            </select>
          </div>

          {/* Staff Assignment */}
          <div>
            <label className="block text-sm font-semibold mb-3" style={{ color: '#1f2937' }}>
              <Users className="inline h-4 w-4 mr-2" style={{ color: '#867969' }} />
              Assign Additional Staff
            </label>
            <div className="space-y-2">
              {staff.map(member => (
                <div
                  key={member._id}
                  className="p-3 rounded-lg cursor-pointer transition"
                  style={{
                    backgroundColor: selectedStaff.includes(member._id)
                      ? 'rgba(134, 121, 105, 0.1)'
                      : 'rgba(134, 121, 105, 0.05)',
                    borderWidth: selectedStaff.includes(member._id) ? '2px' : '1px',
                    borderColor: selectedStaff.includes(member._id)
                      ? '#867969'
                      : 'rgba(134, 121, 105, 0.2)'
                  }}
                  onClick={() => handleStaffToggle(member._id)}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedStaff.includes(member._id)}
                      onChange={() => handleStaffToggle(member._id)}
                      className="w-4 h-4"
                    />
                    <div className="flex-1">
                      <p className="font-medium" style={{ color: '#1f2937' }}>
                        {member.f_name} {member.l_name}
                      </p>
                      <p className="text-sm" style={{ color: '#9ca3af' }}>
                        {member.qualification || 'No qualification'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm mt-2" style={{ color: '#6b7280' }}>
              Selected: {selectedStaff.length} staff member(s)
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          className="p-6 flex gap-4 justify-end"
          style={{ borderTop: '1px solid rgba(134, 121, 105, 0.2)' }}
        >
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2 rounded-lg transition"
            style={{
              backgroundColor: '#ffffff',
              borderWidth: '1px',
              borderColor: 'rgba(134, 121, 105, 0.2)',
              color: '#1f2937'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={loading}
            className="px-6 py-2 text-white rounded-lg transition font-medium"
            style={{
              background: loading
                ? 'rgba(134, 121, 105, 0.5)'
                : 'linear-gradient(135deg, #867969 0%, #a89983 100%)'
            }}
          >
            {loading ? 'Assigning...' : 'Assign Staff'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaseAssignmentModal;
