// src/pages/admin/Inquiries.jsx
import React, { useState, useEffect } from 'react';
import { Mail, Phone, Search, AlertCircle, Check, Clock } from 'lucide-react';
import api from '../../services/api';

const Inquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const response = await api.get('/api/inquiries');
      setInquiries(response.data.data);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/api/inquiries/${id}`, { status });
      fetchInquiries();
    } catch (error) {
      console.error('Error updating inquiry status:', error);
    }
  };

  const filteredInquiries = inquiries.filter(inquiry =>
    inquiry.inquiry_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquiry.email_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquiry.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#E9E8E6' }}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#1f2937' }}>Manage Inquiries</h1>
          <p className="mt-2" style={{ color: '#6b7280' }}>View and manage client inquiries</p>
        </div>
      </div>

      <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: '#f5f1ed' }}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: '#9ca3af' }} />
          <input
            type="text"
            placeholder="Search by name, email, or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg outline-none"
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
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderBottomColor: '#867969' }}></div>
            <p style={{ color: '#6b7280' }}>Loading inquiries...</p>
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="rounded-xl shadow-lg p-12 text-center" style={{ backgroundColor: '#f5f1ed' }}>
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full" style={{ backgroundColor: 'rgba(134, 121, 105, 0.1)' }}>
                <AlertCircle className="h-16 w-16" style={{ color: '#9ca3af' }} />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: '#1f2937' }}>No inquiries found</h3>
            <p className="mb-6" style={{ color: '#9ca3af' }}>
              {searchTerm ? 'Try adjusting your search' : 'There are no inquiries at the moment.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-md" style={{ backgroundColor: '#f5f1ed' }}>
            <table className="min-w-full divide-y" style={{ divideColor: 'rgba(134, 121, 105, 0.2)' }}>
              <thead style={{ backgroundColor: 'rgba(134, 121, 105, 0.08)' }}>
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#6b7280' }}>Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#6b7280' }}>Contact</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#6b7280' }}>Message</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#6b7280' }}>Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#6b7280' }}>Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#6b7280' }}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ divideColor: 'rgba(134, 121, 105, 0.2)' }}>
                {filteredInquiries.map((inquiry) => (
                  <tr key={inquiry._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium" style={{ color: '#1f2937' }}>{inquiry.inquiry_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm" style={{ color: '#6b7280' }}><Mail className="inline h-4 w-4 mr-1" />{inquiry.email_id}</div>
                      <div className="text-sm" style={{ color: '#6b7280' }}><Phone className="inline h-4 w-4 mr-1" />{inquiry.contact}</div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm" style={{ color: '#6b7280' }}>{inquiry.message}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#6b7280' }}>
                      {new Date(inquiry.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          inquiry.status === 'new' ? 'bg-blue-100 text-blue-800' :
                          inquiry.status === 'read' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}
                      >
                        {inquiry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <select
                        onChange={(e) => handleStatusChange(inquiry._id, e.target.value)}
                        value={inquiry.status}
                        className="rounded-lg outline-none"
                        style={{
                          backgroundColor: '#ffffff',
                          borderWidth: '1px',
                          borderColor: 'rgba(134, 121, 105, 0.2)',
                          color: '#1f2937'
                        }}
                      >
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="responded">Responded</option>
                      </select>
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

export default Inquiries;