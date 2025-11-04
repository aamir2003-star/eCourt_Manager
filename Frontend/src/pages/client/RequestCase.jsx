// src/pages/client/RequestCase.jsx - UPDATED WITH LIGHT THEME
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Send, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../../services/api';

const RequestCase = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [lawyers, setLawyers] = useState([]);
  const [formData, setFormData] = useState({
    case_title: '',
    case_type: '',
    description: '',
    preferred_lawyer: '',
    urgency: 'medium'
  });
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetchLawyers();
  }, []);

  const fetchLawyers = async () => {
    try {
      const response = await api.get('/users?role=staff');
      setLawyers(response.data.data);
    } catch (error) {
      console.error('Error fetching lawyers:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setDocuments(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          data.append(key, formData[key]);
        }
      });

      documents.forEach(file => {
        data.append('documents', file);
      });

      await api.post('/case-requests', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/client/case-requests');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen p-6 flex items-center" style={{ backgroundColor: '#E9E8E6' }}>
        <div className="max-w-2xl mx-auto w-full">
          <div className="rounded-lg shadow-lg p-8 text-center" style={{ 
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: '1px',
            borderColor: 'rgba(16, 185, 129, 0.3)'
          }}>
            <CheckCircle className="h-16 w-16 mx-auto mb-4" style={{ color: '#10b981' }} />
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#1f2937' }}>Request Submitted!</h2>
            <p style={{ color: '#6b7280' }}>Your case request has been submitted successfully.</p>
            <p className="text-sm mt-2" style={{ color: '#9ca3af' }}>Our team will review it and assign a lawyer soon.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#E9E8E6' }}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: '#1f2937' }}>Request New Case</h1>
          <p className="mt-2" style={{ color: '#6b7280' }}>Submit your case details and our team will review it</p>
        </div>

        {/* Form Card */}
        <div className="rounded-xl shadow-lg p-8" style={{ backgroundColor: '#f5f1ed' }}>
          {/* Error Alert */}
          {error && (
            <div 
              className="mb-6 rounded-lg p-4 flex items-start"
              style={{ 
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                borderWidth: '1px',
                borderColor: 'rgba(239, 68, 68, 0.3)'
              }}
            >
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
              <span className="text-sm" style={{ color: '#dc2626' }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Case Title */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1f2937' }}>
                Case Title *
              </label>
              <input
                type="text"
                name="case_title"
                value={formData.case_title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg outline-none"
                style={{
                  backgroundColor: '#ffffff',
                  borderWidth: '1px',
                  borderColor: 'rgba(134, 121, 105, 0.2)',
                  color: '#1f2937'
                }}
                placeholder="Brief title for your case"
              />
            </div>

            {/* Case Type & Urgency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1f2937' }}>
                  Case Type *
                </label>
                <select
                  name="case_type"
                  value={formData.case_type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg outline-none"
                  style={{
                    backgroundColor: '#ffffff',
                    borderWidth: '1px',
                    borderColor: 'rgba(134, 121, 105, 0.2)',
                    color: '#1f2937'
                  }}
                >
                  <option value="">Select type</option>
                  <option value="Civil">Civil</option>
                  <option value="Criminal">Criminal</option>
                  <option value="Family">Family</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Property">Property</option>
                  <option value="Labour">Labour</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1f2937' }}>
                  Urgency *
                </label>
                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg outline-none"
                  style={{
                    backgroundColor: '#ffffff',
                    borderWidth: '1px',
                    borderColor: 'rgba(134, 121, 105, 0.2)',
                    color: '#1f2937'
                  }}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* Preferred Lawyer */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1f2937' }}>
                Preferred Lawyer (Optional)
              </label>
              <select
                name="preferred_lawyer"
                value={formData.preferred_lawyer}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg outline-none"
                style={{
                  backgroundColor: '#ffffff',
                  borderWidth: '1px',
                  borderColor: 'rgba(134, 121, 105, 0.2)',
                  color: '#1f2937'
                }}
              >
                <option value="">No preference</option>
                {lawyers.map((lawyer) => (
                  <option key={lawyer._id} value={lawyer._id}>
                    {lawyer.f_name} {lawyer.l_name} {lawyer.qualification ? `- ${lawyer.qualification}` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Case Description */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1f2937' }}>
                Case Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="6"
                className="w-full px-4 py-3 rounded-lg outline-none resize-none"
                style={{
                  backgroundColor: '#ffffff',
                  borderWidth: '1px',
                  borderColor: 'rgba(134, 121, 105, 0.2)',
                  color: '#1f2937'
                }}
                placeholder="Provide detailed information about your case..."
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1f2937' }}>
                Upload Documents (Optional)
              </label>
              <div 
                className="rounded-lg p-6 text-center transition cursor-pointer"
                style={{
                  borderWidth: '2px',
                  borderStyle: 'dashed',
                  borderColor: 'rgba(134, 121, 105, 0.3)',
                  backgroundColor: 'rgba(134, 121, 105, 0.05)'
                }}
              >
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer block">
                  <Upload className="mx-auto h-12 w-12" style={{ color: '#9ca3af' }} />
                  <p className="mt-2 text-sm" style={{ color: '#6b7280' }}>
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs" style={{ color: '#9ca3af' }}>
                    PDF, DOC, DOCX, JPG, PNG (Max 5 files, 10MB each)
                  </p>
                </label>
              </div>

              {/* Selected Files */}
              {documents.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium" style={{ color: '#1f2937' }}>Selected files:</p>
                  <ul className="mt-2 space-y-1">
                    {documents.map((file, idx) => (
                      <li key={idx} className="text-sm flex items-center" style={{ color: '#6b7280' }}>
                        <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: '#867969' }}></span>
                        {file.name} ({(file.size / 1024).toFixed(2)} KB)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 text-white py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center space-x-2 font-medium"
                style={{
                  background: 'linear-gradient(135deg, #867969 0%, #a89983 100%)'
                }}
              >
                <Send className="h-5 w-5" />
                <span>{loading ? 'Submitting...' : 'Submit Request'}</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/client/dashboard')}
                className="px-6 py-3 rounded-lg transition"
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
      </div>
    </div>
  );
};

export default RequestCase;
