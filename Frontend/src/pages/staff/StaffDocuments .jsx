// src/pages/staff/StaffDocuments.jsx - UPDATED WITH LIGHT THEME
import React, { useState, useEffect } from 'react';
import { FileText, Upload, Download, Eye, Trash2, Search, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const StaffDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const casesRes = await api.get('/cases');
      const allDocuments = [];
      
      for (const caseItem of casesRes.data.data) {
        const caseDetails = await api.get(`/cases/${caseItem._id}`);
        if (caseDetails.data.data.documents) {
          caseDetails.data.data.documents.forEach(doc => {
            allDocuments.push({
              ...doc,
              case: caseItem
            });
          });
        }
      }
      
      setDocuments(allDocuments);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.case_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.case.case_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (docId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        // API call to delete document
        alert('Document deleted successfully');
        fetchDocuments();
      } catch (error) {
        console.error('Error deleting document:', error);
        alert('Failed to delete document');
      }
    }
  };

  return (
    <div className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#E9E8E6' }}>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: '#1f2937' }}>Documents</h1>
        <p className="mt-2" style={{ color: '#6b7280' }}>Manage all case documents</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl p-6 text-white shadow-md transform hover:-translate-y-1 transition" style={{ background: 'linear-gradient(135deg, #867969 0%, #a89983 100%)' }}>
          <FileText className="h-8 w-8 mb-3" />
          <p className="text-sm opacity-90">Total Documents</p>
          <p className="text-3xl font-bold">{documents.length}</p>
        </div>
        <div className="rounded-xl p-6 text-white shadow-md transform hover:-translate-y-1 transition" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
          <Upload className="h-8 w-8 mb-3" />
          <p className="text-sm opacity-90">Uploaded This Month</p>
          <p className="text-3xl font-bold">
            {documents.filter(d => {
              const docDate = new Date(d.date);
              const now = new Date();
              return docDate.getMonth() === now.getMonth() && docDate.getFullYear() === now.getFullYear();
            }).length}
          </p>
        </div>
        <div className="rounded-xl p-6 text-white shadow-md transform hover:-translate-y-1 transition" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
          <FileText className="h-8 w-8 mb-3" />
          <p className="text-sm opacity-90">Cases with Documents</p>
          <p className="text-3xl font-bold">
            {new Set(documents.map(d => d.case._id)).size}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: '#f5f1ed' }}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: '#9ca3af' }} />
          <input
            type="text"
            placeholder="Search documents..."
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
      </div>

      {/* Documents Table */}
      <div className="rounded-lg shadow-md overflow-hidden" style={{ backgroundColor: '#f5f1ed' }}>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderBottomColor: '#867969' }}></div>
            <p style={{ color: '#6b7280' }}>Loading documents...</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full" style={{ backgroundColor: 'rgba(134, 121, 105, 0.1)' }}>
                <AlertCircle className="h-16 w-16" style={{ color: '#9ca3af' }} />
              </div>
            </div>
            <p style={{ color: '#9ca3af' }} className="font-medium">No documents found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead style={{ backgroundColor: 'rgba(134, 121, 105, 0.08)' }}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase" style={{ color: '#867969' }}>Document</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase" style={{ color: '#867969' }}>Case</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase" style={{ color: '#867969' }}>Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase" style={{ color: '#867969' }}>Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase" style={{ color: '#867969' }}>Actions</th>
                </tr>
              </thead>
              <tbody style={{ borderColor: 'rgba(134, 121, 105, 0.2)' }}>
                {filteredDocuments.map((doc) => (
                  <tr
                    key={doc._id}
                    className="border-b hover:opacity-75 transition"
                    style={{
                      borderColor: 'rgba(134, 121, 105, 0.2)',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-2" style={{ color: '#867969' }} />
                        <span className="font-medium" style={{ color: '#1f2937' }}>{doc.case_title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: '#6b7280' }}>
                      {doc.case.case_title}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: '#6b7280' }}>
                      {doc.description}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: '#6b7280' }}>
                      {new Date(doc.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-3">
                        <button
                          className="transition hover:opacity-70"
                          style={{ color: '#867969' }}
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="transition hover:opacity-70"
                          style={{ color: '#10b981' }}
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc._id)}
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

export default StaffDocuments;
