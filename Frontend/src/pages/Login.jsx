// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Scale, AlertCircle, Eye, EyeOff, Lock, User as UserIcon, Sparkles } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { username, password } = formData;

    try {
      const result = await login({ username, password });
      
      if (result.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (result.user.role === 'staff') {
        navigate('/staff/dashboard');
      } else if (result.user.role === 'client') {
        navigate('/client/dashboard');
      }
    } catch (err) {
      console.error('❌ Login failed:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#29292B' }}>
      {/* Animated Background Shapes using #C9C7BA */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{ backgroundColor: 'rgba(201, 199, 186, 0.1)' }}></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000" style={{ backgroundColor: 'rgba(201, 199, 186, 0.08)' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-2xl animate-bounce-slow" style={{ backgroundColor: 'rgba(201, 199, 186, 0.05)' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo & Title Section */}
          <div className="text-center mb-8 animate-fade-in-down">
            <div className="flex justify-center mb-6">
              <div className="relative group">
                <Link to="/">
                {/* Outer glow ring */}
                <div className="absolute inset-0 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity animate-pulse" style={{ backgroundColor: '#C9C7BA' }}></div>
                
                {/* Icon container */}
                <div className="relative p-4 rounded-2xl shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" style={{ background: 'linear-gradient(135deg, #C9C7BA 0%, #b3b1a0 100%)' }}>
                  <Scale className="h-14 w-14" style={{ color: '#29292B' }} />
                  <Sparkles className="absolute -top-2 -right-2 h-6 w-6 animate-spin-slow" style={{ color: '#C9C7BA' }} />
                </div>
                </Link>
              </div>
                
                
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight" style={{ color: '#C9C7BA' }}>
              eCourt Manager
            </h1>
            <p className="text-lg flex items-center justify-center gap-2" style={{ color: 'rgba(201, 199, 186, 0.7)' }}>
              <Lock className="h-4 w-4" />
              Secure Legal Case Management
            </p>
          </div>

          {/* Login Card */}
          <div className="backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 animate-fade-in-up" style={{ backgroundColor: 'rgba(201, 199, 186, 0.08)', borderWidth: '1px', borderColor: 'rgba(201, 199, 186, 0.2)' }}>
            {/* Welcome Text */}
            <div className="mb-8 gap-3 flex flex-col items-center ">
              <h2 className="text-2xl font-bold mb-1" style={{ color: '#C9C7BA' }}>
                Welcome Back! 
              </h2>
              <p className="text-sm" style={{ color: 'rgba(201, 199, 186, 0.6)' }}>
                Sign in to continue to your account
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 backdrop-blur-sm rounded-xl p-4 flex items-start gap-3 animate-shake" style={{ backgroundColor: 'rgba(220, 38, 38, 0.2)', borderWidth: '1px', borderColor: 'rgba(220, 38, 38, 0.3)' }}>
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
                <span className="text-sm" style={{ color: '#fca5a5' }}>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div className="relative group">
                <label className="block text-sm font-semibold mb-2 ml-1" style={{ color: '#C9C7BA' }}>
                  Username
                </label>
                <div className="relative">
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300`} style={{ color: focusedField === 'username' ? '#C9C7BA' : 'rgba(201, 199, 186, 0.4)' }}>
                    <UserIcon className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField('')}
                    required
                    className="w-full pl-12 pr-4 py-3.5 backdrop-blur-sm rounded-xl transition-all duration-300 outline-none"
                    style={{ 
                      backgroundColor: '#29292B',
                      borderWidth: '2px',
                      borderColor: focusedField === 'username' ? '#C9C7BA' : 'rgba(201, 199, 186, 0.2)',
                      color: '#C9C7BA'
                    }}
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="relative group">
                <label className="block text-sm font-semibold mb-2 ml-1" style={{ color: '#C9C7BA' }}>
                  Password
                </label>
                <div className="relative">
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300`} style={{ color: focusedField === 'password' ? '#C9C7BA' : 'rgba(201, 199, 186, 0.4)' }}>
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    required
                    className="w-full pl-12 pr-12 py-3.5 backdrop-blur-sm rounded-xl transition-all duration-300 outline-none"
                    style={{ 
                      backgroundColor: '#29292B',
                      borderWidth: '2px',
                      borderColor: focusedField === 'password' ? '#C9C7BA' : 'rgba(201, 199, 186, 0.2)',
                      color: '#C9C7BA'
                    }}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: 'rgba(201, 199, 186, 0.6)' }}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full relative group overflow-hidden py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-8"
                style={{ background: 'linear-gradient(135deg, #C9C7BA 0%, #b3b1a0 100%)', color: '#29292B' }}
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 rounded-full animate-spin" style={{ borderWidth: '3px', borderColor: 'rgba(41, 41, 43, 0.3)', borderTopColor: '#29292B' }}></div>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <Scale className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full" style={{ borderTopWidth: '1px', borderColor: 'rgba(201, 199, 186, 0.2)' }}>
                  
                </div>
              </div>
              <div className="relative flex justify-center text-sm">
                <h1 className="px-4 backdrop-blur-sm" style={{ backgroundColor: 'rgba(201, 199, 186, 0.08)', color: 'rgba(201, 199, 186, 0.6)' }}>
                  New to eCourt?
                </h1>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <Link 
                to="/register" 
                className="inline-flex items-center gap-2 hover:gap-3 transition-all duration-300 font-semibold group"
                style={{ color: '#C9C7BA' }}
              >
                Create an account
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>

          {/* Back to Home Link */}
          <div className="mt-8 text-center animate-fade-in">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 transition-colors group"
              style={{ color: 'rgba(201, 199, 186, 0.6)' }}
            >
              <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
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

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
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

        .animate-fade-in {
          animation: fade-in 0.6s ease-out 0.4s both;
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

        input::placeholder {
          color: rgba(201, 199, 186, 0.4);
        }
      `}</style>
    </div>
  );
};

export default Login;
