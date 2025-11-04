// src/pages/client/ClientDashboard.jsx - UPDATED WITH LIGHT THEME
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, Calendar, FileText, MessageSquare, 
  Plus, TrendingUp, Clock, CheckCircle, AlertCircle
} from 'lucide-react';
import { useCase } from '../../context/CaseContext';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';



const ClientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { cases, loading } = useCase();
  const [stats, setStats] = useState({
    totalCases: 0,
    activeCases: 0,
    upcomingHearings: 0,
    pendingRequests: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    calculateStats();
    fetchRecentActivity();
  }, [cases]);

  const calculateStats = async () => {
    try {
      const requestsRes = await api.get('/case-requests');
      const requests = requestsRes.data.data;
      
      setStats({
        totalCases: cases.length,
        activeCases: cases.filter(c => c.status === 'active').length,
        upcomingHearings: 0,
        pendingRequests: requests.filter(r => r.status === 'pending').length
      });
    } catch (error) {
      console.error('Error calculating stats:', error);
    }
  };

  const fetchRecentActivity = () => {
    const activities = [
      {
        id: 1,
        type: 'case',
        title: 'Case Updated',
        message: 'Your case status has been updated to Active',
        time: '2 hours ago',
        icon: Briefcase,
        color: '#867969'
      },
      {
        id: 2,
        type: 'hearing',
        title: 'Hearing Scheduled',
        message: 'Next hearing scheduled for Nov 15, 2024',
        time: '1 day ago',
        icon: Calendar,
        color: '#10b981'
      },
      {
        id: 3,
        type: 'document',
        title: 'Document Added',
        message: 'New evidence document uploaded',
        time: '3 days ago',
        icon: FileText,
        color: '#8b5cf6'
      }
    ];
    setRecentActivity(activities);
  };

  const StatCard = ({ icon: Icon, label, value, color, trend, onClick }) => (
    <div 
      onClick={onClick}
      className="rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4 transform hover:-translate-y-1"
      style={{
        backgroundColor: '#f5f1ed',
        borderLeftColor: color
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-lg" style={{ backgroundColor: `rgba(134, 121, 105, 0.15)` }}>
          <Icon className="h-6 w-6" style={{ color: color }} />
        </div>
        {trend && (
          <div className="flex items-center text-sm" style={{ color: '#10b981' }}>
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>+{trend}%</span>
          </div>
        )}
      </div>
      <p className="text-sm mb-1" style={{ color: '#6b7280' }}>{label}</p>
      <p className="text-3xl font-bold" style={{ color: '#1f2937' }}>{value}</p>
    </div>
  );

  const QuickAction = ({ icon: Icon, label, description, onClick, color }) => (
    <button
      onClick={onClick}
      className="rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 text-left w-full group border transform hover:-translate-y-1"
      style={{
        backgroundColor: '#f5f1ed',
        borderWidth: '1px',
        borderColor: 'rgba(134, 121, 105, 0.2)'
      }}
    >
      <div
        className="p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform text-white"
        style={{ background: color }}
      >
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-semibold mb-1 group-hover:transition-colors" style={{ color: '#1f2937' }}>
        {label}
      </h3>
      <p className="text-sm" style={{ color: '#6b7280' }}>{description}</p>
    </button>
  );

  return (
    <div className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#E9E8E6' }}>
      {/* Header */}
      <div className="rounded-xl shadow-xl p-8 text-white" style={{ background: 'linear-gradient(135deg, #867969 0%, #a89983 100%)' }}>
        <h1 className="text-3xl font-bold mb-2 capitalize">Welcome Back! {user?.username}</h1>
        <p className="opacity-90">Here's what's happening with your cases today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Briefcase}
          label="Total Cases"
          value={stats.totalCases}
          color="#867969"
          trend={12}
          onClick={() => navigate('/client/cases')}
        />
        <StatCard
          icon={CheckCircle}
          label="Active Cases"
          value={stats.activeCases}
          color="#10b981"
          onClick={() => navigate('/client/cases')}
        />
        <StatCard
          icon={Calendar}
          label="Upcoming Hearings"
          value={stats.upcomingHearings}
          color="#f97316"
          onClick={() => navigate('/client/cases')}
        />
        <StatCard
          icon={Clock}
          label="Pending Requests"
          value={stats.pendingRequests}
          color="#8b5cf6"
          onClick={() => navigate('/client/case-requests')}
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4" style={{ color: '#1f2937' }}>Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickAction
            icon={Plus}
            label="Request New Case"
            description="Submit a new case request"
            onClick={() => navigate('/client/request-case')}
            color="linear-gradient(135deg, #867969 0%, #a89983 100%)"
          />
          <QuickAction
            icon={Briefcase}
            label="View Cases"
            description="Check your case status"
            onClick={() => navigate('/client/cases')}
            color="linear-gradient(135deg, #10b981 0%, #34d399 100%)"
          />
          <QuickAction
            icon={Calendar}
            label="Appointments"
            description="Schedule a meeting"
            onClick={() => navigate('/client/appointments')}
            color="linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)"
          />
          <QuickAction
            icon={MessageSquare}
            label="Feedback"
            description="Share your experience"
            onClick={() => navigate('/client/feedback')}
            color="linear-gradient(135deg, #f97316 0%, #fb923c 100%)"
          />
        </div>
      </div>

      {/* Recent Activity & Cases Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <div className="rounded-xl shadow-lg p-6" style={{ backgroundColor: '#f5f1ed' }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: '#1f2937' }}>Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <p className="text-center py-8" style={{ color: '#9ca3af' }}>No recent activity</p>
              ) : (
                recentActivity.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div 
                      key={activity.id} 
                      className="flex items-start space-x-3 p-3 rounded-lg transition"
                      style={{ backgroundColor: 'rgba(134, 121, 105, 0.05)' }}
                    >
                      <div className="p-2 rounded-lg" style={{ backgroundColor: `rgba(134, 121, 105, 0.15)` }}>
                        <Icon className="h-4 w-4" style={{ color: activity.color }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium" style={{ color: '#1f2937' }}>{activity.title}</p>
                        <p className="text-xs mt-1" style={{ color: '#6b7280' }}>{activity.message}</p>
                        <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>{activity.time}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Active Cases */}
        <div className="lg:col-span-2">
          <div className="rounded-xl shadow-lg p-6" style={{ backgroundColor: '#f5f1ed' }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold" style={{ color: '#1f2937' }}>Active Cases</h2>
              <button
                onClick={() => navigate('/client/cases')}
                className="text-sm font-medium transition-colors"
                style={{ color: '#867969' }}
              >
                View All →
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 mx-auto" style={{ borderBottomColor: '#867969' }}></div>
              </div>
            ) : cases.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(134, 121, 105, 0.15)' }}>
                  <Briefcase className="h-8 w-8" style={{ color: '#9ca3af' }} />
                </div>
                <p className="mb-4" style={{ color: '#9ca3af' }}>No cases yet</p>
                <button
                  onClick={() => navigate('/client/request-case')}
                  className="text-white px-6 py-2 rounded-lg hover:shadow-lg transition inline-flex items-center space-x-2 font-semibold"
                  style={{ background: 'linear-gradient(135deg, #867969 0%, #a89983 100%)' }}
                >
                  <Plus className="h-4 w-4" />
                  <span>Request New Case</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {cases.slice(0, 3).map((caseItem) => (
                  <div
                    key={caseItem._id}
                    onClick={() => navigate(`/client/cases/${caseItem._id}`)}
                    className="p-4 rounded-lg hover:shadow-md transition cursor-pointer"
                    style={{
                      borderWidth: '1px',
                      borderColor: 'rgba(134, 121, 105, 0.2)',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1" style={{ color: '#1f2937' }}>
                          {caseItem.case_title}
                        </h3>
                        <p className="text-sm" style={{ color: '#6b7280' }}>{caseItem.case_type}</p>
                      </div>
                      <span
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor:
                            caseItem.status === 'active' ? 'rgba(16, 185, 129, 0.15)' :
                            caseItem.status === 'pending' ? 'rgba(251, 191, 36, 0.15)' :
                            'rgba(107, 114, 128, 0.15)',
                          color:
                            caseItem.status === 'active' ? '#10b981' :
                            caseItem.status === 'pending' ? '#f59e0b' :
                            '#6b7280'
                        }}
                      >
                        {caseItem.status}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center text-sm" style={{ color: '#9ca3af' }}>
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{new Date(caseItem.case_reg_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="rounded-xl shadow-lg p-6" style={{ backgroundColor: 'rgba(134, 121, 105, 0.08)', borderWidth: '1px', borderColor: 'rgba(134, 121, 105, 0.2)' }}>
        <div className="flex items-start space-x-4">
          <div className="p-3 rounded-lg" style={{ backgroundColor: '#ffffff' }}>
            <AlertCircle className="h-6 w-6" style={{ color: '#867969' }} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1" style={{ color: '#1f2937' }}>Need Help?</h3>
            <p className="text-sm mb-3" style={{ color: '#6b7280' }}>
              Our support team is here to assist you with any questions about your cases.
            </p>
            <button className="text-sm font-medium transition-colors" style={{ color: '#867969' }}>
              Contact Support →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
