// src/pages/Register.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Scale, AlertCircle, Eye, EyeOff, UserPlus, Sparkles } from 'lucide-react';
import api from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    role: 'client',
    f_name: '',
    l_name: '',
    email: '',
    contact: '',
    address: '',
    gender: '',
    dob: '',
    state: '',
    city: ''
  });
  
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStates();
  }, []);

  useEffect(() => {
    if (formData.state) {
      fetchCities(formData.state);
    }
  }, [formData.state]);

  const fetchStates = async () => {
    try {
      const response = await api.get('/locations/states');
      setStates(response.data.data);
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  const fetchCities = async (stateId) => {
    try {
      const response = await api.get(`/locations/cities?state=${stateId}`);
      setCities(response.data.data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      
      const cleanData = Object.fromEntries(
        Object.entries(registerData).filter(([_, value]) => value !== '')
      );

      await register(cleanData);
      
      if (formData.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (formData.role === 'staff') {
        navigate('/staff/dashboard');
      } else {
        navigate('/client/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden py-12 px-4" style={{ backgroundColor: '#29292B' }}>
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{ backgroundColor: 'rgba(201, 199, 186, 0.1)' }}></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000" style={{ backgroundColor: 'rgba(201, 199, 186, 0.08)' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-2xl animate-bounce-slow" style={{ backgroundColor: 'rgba(201, 199, 186, 0.05)' }}></div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-down">
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <div className="absolute inset-0 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity animate-pulse" style={{ backgroundColor: '#C9C7BA' }}></div>
              <div className="relative p-4 rounded-2xl shadow-2xl transform group-hover:scale-110 transition-all duration-300" style={{ background: 'linear-gradient(135deg, #C9C7BA 0%, #b3b1a0 100%)' }}>
                <Scale className="h-12 w-12" style={{ color: '#29292B' }} />
                <Sparkles className="absolute -top-2 -right-2 h-6 w-6 animate-spin-slow" style={{ color: '#C9C7BA' }} />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2 tracking-tight" style={{ color: '#C9C7BA' }}>
            Create Account
          </h1>
          <p className="text-lg" style={{ color: 'rgba(201, 199, 186, 0.7)' }}>
            Register for eCourt Manager
          </p>
        </div>

        {/* Registration Card */}
        <div className="backdrop-blur-xl rounded-3xl shadow-2xl p-8 animate-fade-in-up" style={{ backgroundColor: 'rgba(201, 199, 186, 0.08)', borderWidth: '1px', borderColor: 'rgba(201, 199, 186, 0.2)' }}>
          {/* Error Alert */}
          {error && (
            <div className="mb-6 backdrop-blur-sm rounded-xl p-4 flex items-start gap-3 animate-shake" style={{ backgroundColor: 'rgba(220, 38, 38, 0.2)', borderWidth: '1px', borderColor: 'rgba(220, 38, 38, 0.3)' }}>
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
              <span className="text-sm" style={{ color: '#fca5a5' }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Account Type */}
            <div>
              <label className="block text-sm font-semibold mb-2 ml-1" style={{ color: '#C9C7BA' }}>
                Account Type
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300"
                style={{ 
                  backgroundColor: '#29292B',
                  borderWidth: '2px',
                  borderColor: 'rgba(201, 199, 186, 0.2)',
                  color: '#C9C7BA'
                }}
              >
                <option value="client">Client</option>
                <option value="staff">Lawyer</option>
              </select>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 ml-1" style={{ color: '#C9C7BA' }}>
                  First Name *
                </label>
                <input
                  type="text"
                  name="f_name"
                  value={formData.f_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300"
                  style={{ 
                    backgroundColor: '#29292B',
                    borderWidth: '2px',
                    borderColor: 'rgba(201, 199, 186, 0.2)',
                    color: '#C9C7BA'
                  }}
                  placeholder="Enter first name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 ml-1" style={{ color: '#C9C7BA' }}>
                  Last Name *
                </label>
                <input
                  type="text"
                  name="l_name"
                  value={formData.l_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300"
                  style={{ 
                    backgroundColor: '#29292B',
                    borderWidth: '2px',
                    borderColor: 'rgba(201, 199, 186, 0.2)',
                    color: '#C9C7BA'
                  }}
                  placeholder="Enter last name"
                />
              </div>
            </div>

            {/* Username & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 ml-1" style={{ color: '#C9C7BA' }}>
                  Username *
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300"
                  style={{ 
                    backgroundColor: '#29292B',
                    borderWidth: '2px',
                    borderColor: 'rgba(201, 199, 186, 0.2)',
                    color: '#C9C7BA'
                  }}
                  placeholder="Choose a username"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 ml-1" style={{ color: '#C9C7BA' }}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300"
                  style={{ 
                    backgroundColor: '#29292B',
                    borderWidth: '2px',
                    borderColor: 'rgba(201, 199, 186, 0.2)',
                    color: '#C9C7BA'
                  }}
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 ml-1" style={{ color: '#C9C7BA' }}>
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pr-12 rounded-xl outline-none transition-all duration-300"
                    style={{ 
                      backgroundColor: '#29292B',
                      borderWidth: '2px',
                      borderColor: 'rgba(201, 199, 186, 0.2)',
                      color: '#C9C7BA'
                    }}
                    placeholder="Min. 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    style={{ color: 'rgba(201, 199, 186, 0.6)' }}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 ml-1" style={{ color: '#C9C7BA' }}>
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pr-12 rounded-xl outline-none transition-all duration-300"
                    style={{ 
                      backgroundColor: '#29292B',
                      borderWidth: '2px',
                      borderColor: 'rgba(201, 199, 186, 0.2)',
                      color: '#C9C7BA'
                    }}
                    placeholder="Re-enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    style={{ color: 'rgba(201, 199, 186, 0.6)' }}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Contact & Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 ml-1" style={{ color: '#C9C7BA' }}>
                  Contact Number *
                </label>
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300"
                  style={{ 
                    backgroundColor: '#29292B',
                    borderWidth: '2px',
                    borderColor: 'rgba(201, 199, 186, 0.2)',
                    color: '#C9C7BA'
                  }}
                  placeholder="10-digit number"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 ml-1" style={{ color: '#C9C7BA' }}>
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300"
                  style={{ 
                    backgroundColor: '#29292B',
                    borderWidth: '2px',
                    borderColor: 'rgba(201, 199, 186, 0.2)',
                    color: '#C9C7BA'
                  }}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold mb-2 ml-1" style={{ color: '#C9C7BA' }}>
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300 resize-none"
                style={{ 
                  backgroundColor: '#29292B',
                  borderWidth: '2px',
                  borderColor: 'rgba(201, 199, 186, 0.2)',
                  color: '#C9C7BA'
                }}
                placeholder="Enter your address (optional)"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-8"
              style={{ background: 'linear-gradient(135deg, #C9C7BA 0%, #b3b1a0 100%)', color: '#29292B' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 rounded-full animate-spin" style={{ borderWidth: '3px', borderColor: 'rgba(41, 41, 43, 0.3)', borderTopColor: '#29292B' }}></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Register
                    <UserPlus className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: 'rgba(201, 199, 186, 0.6)' }}>
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-semibold transition-colors"
                style={{ color: '#C9C7BA' }}
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Animations CSS */}
      <style jsx>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.6s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out 0.2s both;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .delay-1000 {
          animation-delay: 1s;
        }

        input::placeholder,
        textarea::placeholder {
          color: rgba(201, 199, 186, 0.4);
        }

        select option {
          background-color: #29292B;
          color: #C9C7BA;
        }
      `}</style>
    </div>
  );
};

export default Register;
