// src/pages/Home.jsx - Updated Hero Section
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Scale, Shield, Clock, FileText, Users, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import AnimatedGradientText from '../components/AnimatedGradientText';
import BounceText from '../components/BounceText';


gsap.registerPlugin(useGSAP);

const Home = () => {
  const titleRef = useRef();

  const features = [
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Your case data is protected with enterprise-grade security'
    },
    {
      icon: Clock,
      title: 'Real-time Updates',
      description: 'Get instant notifications about hearings and case progress'
    },
    {
      icon: FileText,
      title: 'Document Management',
      description: 'Easily upload, store, and access all case documents'
    },
    {
      icon: Users,
      title: 'Client Collaboration',
      description: 'Seamless communication between lawyers and clients'
    },
    {
      icon: TrendingUp,
      title: 'Performance Analytics',
      description: 'Track case progress with detailed reports and insights'
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#29292B' }}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{ backgroundColor: 'rgba(201, 199, 186, 0.1)' }}></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000" style={{ backgroundColor: 'rgba(201, 199, 186, 0.08)' }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 backdrop-blur-xl shadow-lg" style={{ backgroundColor: 'rgba(201, 199, 186, 0.08)', borderBottomWidth: '1px', borderColor: 'rgba(201, 199, 186, 0.2)' }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-md opacity-50" style={{ backgroundColor: '#C9C7BA' }}></div>
              <div className="relative p-2 rounded-full" style={{ background: 'linear-gradient(135deg, #C9C7BA 0%, #b3b1a0 100%)' }}>
                <Scale className="h-7 w-7" style={{ color: '#29292B' }} />
              </div>
            </div>
            <span className="text-2xl font-bold" style={{ color: '#C9C7BA' }}>
              eCourt Manager
            </span>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/login"
              className="px-6 py-2 font-medium transition-colors rounded-lg hover:bg-opacity-10"
              style={{ color: '#C9C7BA' }}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #C9C7BA 0%, #b3b1a0 100%)', color: '#29292B' }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="absolute inset-0 rounded-full blur-2xl opacity-50 group-hover:opacity-75 transition-opacity animate-pulse" style={{ backgroundColor: '#C9C7BA' }}></div>
              <div className="relative p-6 rounded-2xl" style={{ background: 'linear-gradient(135deg, #C9C7BA 0%, #b3b1a0 100%)' }}>
                <Scale className="h-16 w-16" style={{ color: '#29292B' }} />
                <Sparkles className="absolute -top-3 -right-3 h-8 w-8 animate-spin-slow" style={{ color: '#C9C7BA' }} />
              </div>
            </div>
          </div>

          {/* Animated Gradient Text */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ color: '#C9C7BA' }}>
  <AnimatedGradientText 
    text="Digital Legal Case Management System"
    className="text-5xl md:text-6xl font-bold"
  />
</h1>
<BounceText
  text="Streamline your legal practice with our comprehensive case management system. Manage cases, clients, documents, and hearings all in one place."
  className="text-xl mb-10 max-w-3xl mx-auto leading-relaxed"
  style={{ color: 'rgba(201, 199, 186, 0.7)' }}
/>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="group px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 inline-flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #C9C7BA 0%, #b3b1a0 100%)', color: '#29292B' }}
            >
              Start Free Trial
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              style={{ 
                backgroundColor: 'transparent',
                borderWidth: '2px',
                borderColor: '#C9C7BA',
                color: '#C9C7BA'
              }}
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="backdrop-blur-xl rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
                style={{ 
                  backgroundColor: 'rgba(201, 199, 186, 0.08)',
                  borderWidth: '1px',
                  borderColor: 'rgba(201, 199, 186, 0.2)'
                }}
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{ backgroundColor: 'rgba(201, 199, 186, 0.15)' }}>
                  <Icon className="h-8 w-8" style={{ color: '#C9C7BA' }} />
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#C9C7BA' }}>
                  {feature.title}
                </h3>
                <p style={{ color: 'rgba(201, 199, 186, 0.7)' }}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            { number: '10K+', label: 'Active Users' },
            { number: '50K+', label: 'Cases Managed' },
            { number: '99.9%', label: 'Uptime' }
          ].map((stat, index) => (
            <div 
              key={index} 
              className="text-center backdrop-blur-xl rounded-2xl p-8"
              style={{ 
                backgroundColor: 'rgba(201, 199, 186, 0.08)',
                borderWidth: '1px',
                borderColor: 'rgba(201, 199, 186, 0.2)'
              }}
            >
              <div className="text-5xl font-bold mb-2" style={{ color: '#C9C7BA' }}>
                {stat.number}
              </div>
              <div className="text-lg" style={{ color: 'rgba(201, 199, 186, 0.7)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #C9C7BA 0%, #b3b1a0 100%)' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 relative z-10" style={{ color: '#29292B' }}>
            Ready to transform your legal practice?
          </h2>
          <p className="text-xl mb-8 relative z-10" style={{ color: 'rgba(41, 41, 43, 0.7)' }}>
            Join thousands of legal professionals using eCourt Manager
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 relative z-10 group"
            style={{ backgroundColor: '#29292B', color: '#C9C7BA' }}
          >
            Get Started Today
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-20 py-8 backdrop-blur-xl" style={{ backgroundColor: 'rgba(201, 199, 186, 0.05)', borderTopWidth: '1px', borderColor: 'rgba(201, 199, 186, 0.2)' }}>
        <div className="max-w-7xl mx-auto px-4 text-center" style={{ color: 'rgba(201, 199, 186, 0.6)' }}>
          <p>&copy; 2024 eCourt Manager. All rights reserved.</p>
        </div>
      </footer>

      {/* Animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-shimmer {
          animation: shimmer 3s infinite;
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .delay-1000 {
          animation-delay: 1s;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
