// src/pages/staff/CaseDetails.jsx - UPDATED WITH LIGHT THEME
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  FileText, 
  User, 
  MapPin, 
  Edit,
  Upload,
  Plus,
  AlertCircle
} from 'lucide-react';
import { useCase } from '../../context/CaseContext';
import { caseService } from '../../services/caseService';
import DocumentUpload from '../../components/DocumentUpload';

const CaseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchCaseById } = useCase();
  
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [showHearingForm, setShowHearingForm] = useState(false);
  const [hearingData, setHearingData] = useState({
    hearing_date: '',
    remarks: ''
  });

  useEffect(() => {
    loadCaseDetails();
  }, [id]);

  const loadCaseDetails = async () => {
    try {
      const data = await fetchCaseById(id);
      setCaseData(data);
    } catch (error) {
      console.error('Error loading case:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('case_title', caseData.case_title);
    formData.append('description', 'Case document');

    try {
      await caseService.uploadDocument(id, formData);
      setShowDocumentUpload(false);
      loadCaseDetails();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload document');
    }
  };

  const handleScheduleHearing = async (e) => {
    e.preventDefault();
    try {
      await caseService.scheduleHearing(id, hearingData);
      setShowHearingForm(false);
      setHearingData({ hearing_date: '', remarks: '' });
      loadCaseDetails();
      alert('Hearing scheduled successfully');
    } catch (error) {
      console.error('Error scheduling hearing:', error);
      alert('Failed to schedule hearing');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 min-h-screen" style={{ backgroundColor: '#E9E8E6' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderBottomColor: '#867969' }}></div>
          <p style={{ color: '#6b7280' }}>Loading case details...</p>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="text-center py-12 min-h-screen" style={{ backgroundColor: '#E9E8E6' }}>
        <AlertCircle className="h-12 w-12 mx-auto mb-4" style={{ color: '#9ca3af' }} />
        <p style={{ color: '#6b7280' }}>Case not found</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981' };
      case 'pending':
        return { bg: 'rgba(251, 191, 36, 0.15)', text: '#d97706' };
      case 'closed':
        return { bg: 'rgba(107, 114, 128, 0.15)', text: '#6b7280' };
      default:
        return { bg: 'rgba(251, 146, 60, 0.15)', text: '#f97316' };
    }
  };

  const statusColor = getStatusColor(caseData.status);

  return (
    <div className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#E9E8E6' }}>
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 transition-colors"
          style={{ color: '#867969' }}
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back</span>
        </button>
        
        <div className="flex space-x-2">
          <button 
            className="text-white px-4 py-2 rounded-lg flex items-center space-x-2 font-medium transition-all hover:shadow-lg"
            style={{ background: 'linear-gradient(135deg, #867969 0%, #a89983 100%)' }}
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </button>
        </div>
      </div>

      {/* Case Header */}
      <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: '#f5f1ed' }}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#1f2937' }}>{caseData.case_title}</h1>
            <span 
              className="inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium"
              style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
            >
              {caseData.status}
            </span>
          </div>
          <span className="text-lg font-medium" style={{ color: '#867969' }}>{caseData.case_type}</span>
        </div>

        {/* Case Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm" style={{ color: '#6b7280' }}>Description</label>
              <p className="mt-1 font-medium" style={{ color: '#1f2937' }}>{caseData.description}</p>
            </div>

            <div className="flex items-center space-x-2">
              <User className="h-5 w-5" style={{ color: '#9ca3af' }} />
              <div>
                <label className="text-sm" style={{ color: '#6b7280' }}>Client</label>
                <p style={{ color: '#1f2937' }}>
                  {caseData.client?.f_name} {caseData.client?.l_name}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" style={{ color: '#9ca3af' }} />
              <div>
                <label className="text-sm" style={{ color: '#6b7280' }}>Registration Date</label>
                <p style={{ color: '#1f2937' }}>
                  {new Date(caseData.case_reg_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {caseData.police_station && (
              <div>
                <label className="text-sm" style={{ color: '#6b7280' }}>Police Station</label>
                <p className="mt-1 font-medium" style={{ color: '#1f2937' }}>{caseData.police_station}</p>
              </div>
            )}

            {caseData.city && (
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" style={{ color: '#9ca3af' }} />
                <div>
                  <label className="text-sm" style={{ color: '#6b7280' }}>Location</label>
                  <p style={{ color: '#1f2937' }}>{caseData.city.city_name}</p>
                </div>
              </div>
            )}

            <div>
              <label className="text-sm" style={{ color: '#6b7280' }}>Result</label>
              <p className="mt-1 font-medium capitalize" style={{ color: '#1f2937' }}>{caseData.result}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Documents and Hearings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Documents Section */}
        <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: '#f5f1ed' }}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold" style={{ color: '#1f2937' }}>Documents</h2>
            <button
              onClick={() => setShowDocumentUpload(!showDocumentUpload)}
              className="transition-colors flex items-center space-x-1 font-medium"
              style={{ color: '#867969' }}
            >
              <Upload className="h-4 w-4" />
              <span>Upload</span>
            </button>
          </div>

          {showDocumentUpload && (
            <div className="mb-4">
              <DocumentUpload
                onUpload={handleDocumentUpload}
                label="Upload Case Document"
              />
            </div>
          )}

          {caseData.documents && caseData.documents.length > 0 ? (
            <div className="space-y-2">
              {caseData.documents.map((doc) => (
                <div 
                  key={doc._id} 
                  className="flex items-center justify-between p-3 rounded"
                  style={{ backgroundColor: 'rgba(134, 121, 105, 0.08)' }}
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" style={{ color: '#867969' }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#1f2937' }}>{doc.case_title}</p>
                      <p className="text-xs" style={{ color: '#9ca3af' }}>
                        {new Date(doc.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm" style={{ color: '#9ca3af' }}>No documents uploaded</p>
          )}
        </div>

        {/* Hearings Section */}
        <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: '#f5f1ed' }}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold" style={{ color: '#1f2937' }}>Hearings</h2>
            <button
              onClick={() => setShowHearingForm(!showHearingForm)}
              className="transition-colors flex items-center space-x-1 font-medium"
              style={{ color: '#867969' }}
            >
              <Plus className="h-4 w-4" />
              <span>Schedule</span>
            </button>
          </div>

          {showHearingForm && (
            <form onSubmit={handleScheduleHearing} className="mb-4 space-y-3">
              <div>
                <input
                  type="date"
                  value={hearingData.hearing_date}
                  onChange={(e) => setHearingData({...hearingData, hearing_date: e.target.value})}
                  required
                  className="w-full px-3 py-2 rounded-lg outline-none"
                  style={{
                    backgroundColor: '#ffffff',
                    borderWidth: '1px',
                    borderColor: 'rgba(134, 121, 105, 0.2)',
                    color: '#1f2937'
                  }}
                />
              </div>
              <div>
                <textarea
                  placeholder="Remarks"
                  value={hearingData.remarks}
                  onChange={(e) => setHearingData({...hearingData, remarks: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg outline-none resize-none"
                  style={{
                    backgroundColor: '#ffffff',
                    borderWidth: '1px',
                    borderColor: 'rgba(134, 121, 105, 0.2)',
                    color: '#1f2937'
                  }}
                  rows="2"
                />
              </div>
              <button
                type="submit"
                className="w-full text-white py-2 rounded-lg transition-all font-semibold"
                style={{ background: 'linear-gradient(135deg, #867969 0%, #a89983 100%)' }}
              >
                Schedule Hearing
              </button>
            </form>
          )}

          {caseData.hearings && caseData.hearings.length > 0 ? (
            <div className="space-y-2">
              {caseData.hearings.map((hearing) => {
                const hearingStatusColor = hearing.status === 'scheduled' 
                  ? { bg: 'rgba(134, 121, 105, 0.15)', text: '#867969' }
                  : hearing.status === 'completed'
                  ? { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981' }
                  : { bg: 'rgba(107, 114, 128, 0.15)', text: '#6b7280' };

                return (
                  <div 
                    key={hearing._id} 
                    className="p-3 rounded"
                    style={{ backgroundColor: 'rgba(134, 121, 105, 0.08)' }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5" style={{ color: '#867969' }} />
                        <div>
                          <p className="text-sm font-medium" style={{ color: '#1f2937' }}>
                            {new Date(hearing.hearing_date).toLocaleDateString()}
                          </p>
                          <p className="text-xs" style={{ color: '#9ca3af' }}>{hearing.remarks}</p>
                        </div>
                      </div>
                      <span 
                        className="text-xs px-2 py-1 rounded font-medium"
                        style={{ backgroundColor: hearingStatusColor.bg, color: hearingStatusColor.text }}
                      >
                        {hearing.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm" style={{ color: '#9ca3af' }}>No hearings scheduled</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaseDetails;
