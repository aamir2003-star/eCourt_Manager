// src/pages/NotFound.jsx - PREMIUM DARK THEME 404 PAGE
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, ArrowLeft, Search, AlertCircle, Briefcase, 
  Zap, HelpCircle, ChevronRight
} from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse position for glow effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const goHome = () => navigate('/');
  const goBack = () => navigate(-1);

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative"
      style={{ backgroundColor: '#0f172a' }}
    >
      {/* Animated Background Gradient */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(96, 165, 250, 0.15) 0%, transparent 50%)`,
          transition: 'background 0.3s ease-out'
        }}
      ></div>

      {/* Animated Grid Background */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(60, 165, 250, 0.05) 25%, rgba(60, 165, 250, 0.05) 26%, transparent 27%, transparent 74%, rgba(60, 165, 250, 0.05) 75%, rgba(60, 165, 250, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(60, 165, 250, 0.05) 25%, rgba(60, 165, 250, 0.05) 26%, transparent 27%, transparent 74%, rgba(60, 165, 250, 0.05) 75%, rgba(60, 165, 250, 0.05) 76%, transparent 77%, transparent)`,
          backgroundSize: '50px 50px'
        }}
      ></div>

      {/* Floating Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-20 blur-3xl animate-pulse"
          style={{ 
            backgroundColor: '#3b82f6',
            animation: 'float 6s ease-in-out infinite'
          }}
        ></div>
        <div 
          className="absolute bottom-20 right-10 w-64 h-64 rounded-full opacity-20 blur-3xl animate-pulse"
          style={{ 
            backgroundColor: '#0ea5e9',
            animation: 'float 8s ease-in-out infinite',
            animationDelay: '1s'
          }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ 
            backgroundColor: '#60a5fa',
            animation: 'pulse 4s ease-in-out infinite'
          }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl w-full relative z-10">
        <div className="text-center space-y-10">
          {/* Animated 404 Number */}
          <div className="relative h-32 flex items-center justify-center">
            <style>{`
              @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-20px); }
              }
              @keyframes glow {
                0%, 100% { text-shadow: 0 0 20px rgba(96, 165, 250, 0.5); }
                50% { text-shadow: 0 0 40px rgba(96, 165, 250, 0.8); }
              }
            `}</style>
            <div 
              className="text-9xl font-black select-none"
              style={{ 
                color: '#60a5fa',
                opacity: 0.8,
                animation: 'glow 3s ease-in-out infinite'
              }}
            >
              404
            </div>
          </div>

          {/* Animated Icon */}
          <div className="flex justify-center">
            <div 
              className="relative"
              style={{
                animation: 'bounce 1s ease-in-out infinite'
              }}
            >
              <div 
                className="absolute inset-0 rounded-full blur-lg opacity-50"
                style={{ backgroundColor: '#3b82f6', animation: 'pulse 2s ease-in-out infinite' }}
              ></div>
              <div 
                className="relative bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full p-6"
              >
                <AlertCircle className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 
              className="text-5xl md:text-6xl font-black tracking-tight"
              style={{ color: '#f8fafc' }}
            >
              Page Not Found
            </h1>
            <p 
              className="text-xl md:text-2xl font-light"
              style={{ color: '#cbd5e1' }}
            >
              Sorry, the page you're looking for has vanished into the digital void.
            </p>
          </div>

          {/* Info Box */}
          <div 
            className="rounded-2xl p-8 backdrop-blur-md border-2 max-w-2xl mx-auto"
            style={{ 
              backgroundColor: 'rgba(30, 41, 59, 0.8)',
              borderColor: 'rgba(96, 165, 250, 0.3)',
              boxShadow: '0 8px 32px rgba(96, 165, 250, 0.1)'
            }}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">
                <Search 
                  className="h-8 w-8"
                  style={{ color: '#60a5fa' }}
                />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold" style={{ color: '#f8fafc' }}>
                  What Happened?
                </h3>
                <ul className="mt-3 space-y-2 text-sm" style={{ color: '#cbd5e1' }}>
                  <li className="flex items-center space-x-2">
                    <ChevronRight className="h-4 w-4" style={{ color: '#60a5fa' }} />
                    <span>The URL might be misspelled or outdated</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <ChevronRight className="h-4 w-4" style={{ color: '#60a5fa' }} />
                    <span>The page has been moved or removed</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <ChevronRight className="h-4 w-4" style={{ color: '#60a5fa' }} />
                    <span>You might not have access to this page</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button
              onClick={goHome}
              className="group flex items-center justify-center space-x-2 px-10 py-4 rounded-xl transition duration-500 transform hover:-translate-y-2 font-bold text-white text-lg relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%)' }}
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #0284c7 100%)' }}
              ></div>
              <Home className="h-5 w-5 relative z-10" />
              <span className="relative z-10">Go Home</span>
            </button>
            <button
              onClick={goBack}
              className="group flex items-center justify-center space-x-2 px-10 py-4 rounded-xl transition duration-500 transform hover:-translate-y-2 font-bold text-lg relative overflow-hidden"
              style={{
                backgroundColor: '#1e293b',
                borderWidth: '2px',
                borderColor: '#3b82f6',
                color: '#60a5fa'
              }}
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity"
                style={{ backgroundColor: '#3b82f6' }}
              ></div>
              <ArrowLeft className="h-5 w-5 relative z-10" />
              <span className="relative z-10">Go Back</span>
            </button>
          </div>

          {/* Quick Navigation */}
          <div className="pt-12">
            <p 
              className="text-sm font-semibold mb-6 uppercase tracking-wider"
              style={{ color: '#94a3b8' }}
            >
              Quick Navigation
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {/* Dashboard */}
              <button
                onClick={() => navigate('/dashboard')}
                className="group relative rounded-xl p-6 transition duration-500 transform hover:-translate-y-2 overflow-hidden"
                style={{
                  backgroundColor: '#1e293b',
                  border: '1px solid rgba(96, 165, 250, 0.2)',
                  boxShadow: 'inset 0 1px 0 rgba(96, 165, 250, 0.1)'
                }}
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), transparent)' }}
                ></div>
                <div className="relative z-10">
                  <div 
                    className="h-12 w-12 rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: 'rgba(96, 165, 250, 0.2)' }}
                  >
                    <Briefcase className="h-6 w-6" style={{ color: '#60a5fa' }} />
                  </div>
                  <p className="text-sm font-bold" style={{ color: '#f8fafc' }}>Dashboard</p>
                  <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>Return to main</p>
                </div>
              </button>

              {/* Cases */}
              <button
                onClick={() => navigate('/cases')}
                className="group relative rounded-xl p-6 transition duration-500 transform hover:-translate-y-2 overflow-hidden"
                style={{
                  backgroundColor: '#1e293b',
                  border: '1px solid rgba(96, 165, 250, 0.2)',
                  boxShadow: 'inset 0 1px 0 rgba(96, 165, 250, 0.1)'
                }}
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), transparent)' }}
                ></div>
                <div className="relative z-10">
                  <div 
                    className="h-12 w-12 rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: 'rgba(96, 165, 250, 0.2)' }}
                  >
                    <Zap className="h-6 w-6" style={{ color: '#60a5fa' }} />
                  </div>
                  <p className="text-sm font-bold" style={{ color: '#f8fafc' }}>Cases</p>
                  <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>View all cases</p>
                </div>
              </button>

              {/* Support */}
              <button
                onClick={() => navigate('/help')}
                className="group relative rounded-xl p-6 transition duration-500 transform hover:-translate-y-2 overflow-hidden"
                style={{
                  backgroundColor: '#1e293b',
                  border: '1px solid rgba(96, 165, 250, 0.2)',
                  boxShadow: 'inset 0 1px 0 rgba(96, 165, 250, 0.1)'
                }}
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), transparent)' }}
                ></div>
                <div className="relative z-10">
                  <div 
                    className="h-12 w-12 rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: 'rgba(96, 165, 250, 0.2)' }}
                  >
                    <HelpCircle className="h-6 w-6" style={{ color: '#60a5fa' }} />
                  </div>
                  <p className="text-sm font-bold" style={{ color: '#f8fafc' }}>Help Center</p>
                  <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>Get support</p>
                </div>
              </button>
            </div>
          </div>

          {/* Error Details */}
          <div 
            className="mt-12 pt-8 border-t rounded-lg p-4"
            style={{ 
              borderColor: 'rgba(96, 165, 250, 0.2)',
              backgroundColor: 'rgba(30, 41, 59, 0.5)'
            }}
          >
            <p 
              className="text-xs font-mono uppercase tracking-widest"
              style={{ color: '#94a3b8' }}
            >
              Error Information
            </p>
            <div className="mt-3 space-y-1 font-mono text-sm" style={{ color: '#cbd5e1' }}>
              <p>Status: <span style={{ color: '#60a5fa' }}>404 Not Found</span></p>
              <p>Path: <span style={{ color: '#60a5fa' }}>{window.location.pathname}</span></p>
              <p>Time: <span style={{ color: '#60a5fa' }}>{new Date().toLocaleString()}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
