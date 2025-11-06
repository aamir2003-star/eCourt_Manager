// src/pages/ContactUs.jsx - BEAUTIFUL CONTACT US FORM
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, Send, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../services/api';

const ContactUs = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: 'general',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await api.post('/inquiries', formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        category: 'general',
        priority: 'medium'
      });
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit inquiry');
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
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#1f2937' }}>Thank You!</h2>
            <p style={{ color: '#6b7280' }}>Your inquiry has been submitted successfully.</p>
            <p className="text-sm mt-2" style={{ color: '#9ca3af' }}>Our team will review it and get back to you soon.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#E9E8E6' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3" style={{ color: '#1f2937' }}>Contact Us</h1>
          <p style={{ color: '#6b7280' }}>Have a question? We'd love to hear from you. Get in touch with our team.</p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="rounded-lg shadow-md p-8" style={{ backgroundColor: '#f5f1ed' }}>
            <Mail className="h-12 w-12 mb-4" style={{ color: '#867969' }} />
            <h3 className="text-xl font-bold mb-2" style={{ color: '#1f2937' }}>Email</h3>
            <p style={{ color: '#6b7280' }}>support@ecourt.com</p>
          </div>
          <div className="rounded-lg shadow-md p-8" style={{ backgroundColor: '#f5f1ed' }}>
            <Phone className="h-12 w-12 mb-4" style={{ color: '#867969' }} />
            <h3 className="text-xl font-bold mb-2" style={{ color: '#1f2937' }}>Phone</h3>
            <p style={{ color: '#6b7280' }}>+1 (555) 123-4567</p>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-xl shadow-lg p-8" style={{ backgroundColor: '#f5f1ed' }}>
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
            {/* Name and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1f2937' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg outline-none"
                  style={{
                    backgroundColor: '#ffffff',
                    borderWidth: '1px',
                    borderColor: 'rgba(134, 121, 105, 0.2)',
                    color: '#1f2937'
                  }}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1f2937' }}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg outline-none"
                  style={{
                    backgroundColor: '#ffffff',
                    borderWidth: '1px',
                    borderColor: 'rgba(134, 121, 105, 0.2)',
                    color: '#1f2937'
                  }}
                  placeholder="john@example.com"
                />
              </div>
            </div>

            {/* Phone and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1f2937' }}>
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg outline-none"
                  style={{
                    backgroundColor: '#ffffff',
                    borderWidth: '1px',
                    borderColor: 'rgba(134, 121, 105, 0.2)',
                    color: '#1f2937'
                  }}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1f2937' }}>
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg outline-none"
                  style={{
                    backgroundColor: '#ffffff',
                    borderWidth: '1px',
                    borderColor: 'rgba(134, 121, 105, 0.2)',
                    color: '#1f2937'
                  }}
                >
                  <option value="general">General Inquiry</option>
                  <option value="bug">Report a Bug</option>
                  <option value="feature">Feature Request</option>
                  <option value="support">Support</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Subject and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1f2937' }}>
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg outline-none"
                  style={{
                    backgroundColor: '#ffffff',
                    borderWidth: '1px',
                    borderColor: 'rgba(134, 121, 105, 0.2)',
                    color: '#1f2937'
                  }}
                  placeholder="Brief subject"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1f2937' }}>
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
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

            {/* Message */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1f2937' }}>
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
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
                placeholder="Your message here..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center space-x-2 font-medium"
              style={{
                background: 'linear-gradient(135deg, #867969 0%, #a89983 100%)'
              }}
            >
              <Send className="h-5 w-5" />
              <span>{loading ? 'Sending...' : 'Send Inquiry'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
