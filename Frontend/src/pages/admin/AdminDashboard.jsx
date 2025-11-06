// src/pages/admin/AdminDashboard.jsx - UPDATED WITH DARKER CARDS
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Briefcase, Calendar, TrendingUp, 
  Clock, CheckCircle, AlertCircle, ArrowRight,
  UserCheck, FileText, Activity, ClipboardList, MessageSquare,
} from 'lucide-react';
import api from '../../services/api';

import CasesByMonthChart from '../../components/charts/CasesByMonthChart';
import CaseStatusPieChart from '../../components/charts/CaseStatusPieChart';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCases: 0,
    activeCases: 0,
    pendingRequests: 0,
    totalStaff: 0,
    totalClients: 0
  });
  const [recentCases, setRecentCases] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [usersRes, casesRes, requestsRes, statsRes] = await Promise.all([
        api.get('/users'),
        api.get('/cases'),
        api.get('/case-requests'),
        api.get('/api/stats/admin')
      ]);

      const users = usersRes.data.data;
      const cases = casesRes.data.data;
      const requests = requestsRes.data.data;
      const chartStats = statsRes.data.data;

      setStats({
        totalUsers: users.length,
        totalCases: cases.length,
        activeCases: cases.filter(c => c.status === 'active').length,
        pendingRequests: requests.filter(r => r.status === 'pending').length,
        totalStaff: users.filter(u => u.role === 'staff').length,
        totalClients: users.filter(u => u.role === 'client').length
      });

      setRecentCases(cases.slice(0, 5));
      setRecentRequests(requests.slice(0, 5));
      setChartData(chartStats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color, subtitle, onClick, trend }) => (
    <div
      onClick={onClick}
      className="rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4 transform hover:-translate-y-1"
      style={{
        backgroundColor: '#f5f1ed',
        borderLeftColor: color,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(134, 121, 105, 0.2)' }}>
          <Icon className="h-6 w-6" style={{ color: '#867969' }} />
        </div>
        {trend && (
          <div className="flex items-center text-sm" style={{ color: '#867969' }}>
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>{trend}</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-sm mb-1" style={{ color: '#6b7280' }}>{label}</p>
        <p className="text-3xl font-bold" style={{ color: '#1f2937' }}>{value}</p>
        {subtitle && <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>{subtitle}</p>}
      </div>
    </div>
  );

  const QuickAction = ({ icon: Icon, label, description, onClick, color, badge }) => (
    <button
      onClick={onClick}
      className="rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 text-left w-full group border relative"
      style={{
        backgroundColor: '#f5f1ed',
        borderColor: 'rgba(134, 121, 105, 0.3)',
      }}
    >
      {badge && (
        <span className="absolute top-4 right-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          {badge}
        </span>
      )}
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ backgroundColor: '#E9E8E6' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto mb-4" style={{ borderBottomColor: '#867969' }}></div>
          <p style={{ color: '#6b7280' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#f0ebe7' }}>
      {/* Header */}
      <div className="rounded-xl shadow-2xl p-8 text-white" style={{ background: 'linear-gradient(135deg, #867969 0%, #a89983 100%)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="opacity-90">System overview and management</p>
          </div>
          <div className="rounded-lg p-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
            <Activity className="h-12 w-12" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats.totalUsers}
          subtitle={`${stats.totalStaff} staff, ${stats.totalClients} clients`}
          color="#867969"
          onClick={() => navigate('/admin/users')}
          trend="+12%"
        />
        <StatCard
          icon={Briefcase}
          label="Total Cases"
          value={stats.totalCases}
          subtitle="All registered cases"
          color="#10b981"
          onClick={() => navigate('/admin/cases')}
          trend="+8%"
        />
        <StatCard
          icon={CheckCircle}
          label="Active Cases"
          value={stats.activeCases}
          subtitle="Currently in progress"
          color="#8b5cf6"
          onClick={() => navigate('/admin/cases')}
        />
        <StatCard
          icon={Clock}
          label="Pending Requests"
          value={stats.pendingRequests}
          subtitle="Awaiting review"
          color="#f97316"
          onClick={() => navigate('/admin/case-requests')}
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center" style={{ color: '#1f2937' }}>
          <Activity className="h-5 w-5 mr-2" style={{ color: '#867969' }} />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickAction
            icon={ClipboardList}
            label="Review Requests"
            description="Approve case requests"
            onClick={() => navigate('/admin/case-requests')}
            color="linear-gradient(135deg, #f97316 0%, #ea580c 100%)"
            badge={stats.pendingRequests > 0 ? stats.pendingRequests : null}
          />
          <QuickAction
            icon={UserCheck}
            label="Manage Users"
            description="Add or edit users"
            onClick={() => navigate('/admin/users')}
            color="linear-gradient(135deg, #867969 0%, #a89983 100%)"
          />
          <QuickAction
            icon={FileText}
            label="View Reports"
            description="System analytics"
            onClick={() => navigate('/admin/reports')}
            color="linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)"
          />
          <QuickAction
            icon={MessageSquare}
            label="Inquiries"
            description="Public inquiries"
            onClick={() => navigate('/admin/inquiries')}
            color="linear-gradient(135deg, #10b981 0%, #34d399 100%)"
          />
        </div>
      </div>

      {/* Analytics Section */}
      {chartData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl shadow-lg p-6" style={{ backgroundColor: '#f5f1ed' }}>
            <h2 className="text-xl font-semibold mb-4 flex items-center" style={{ color: '#1f2937' }}>
              <BarChart3 className="h-5 w-5 mr-2" style={{ color: '#867969' }} />
              Cases By Month
            </h2>
            <CasesByMonthChart data={chartData.casesByMonth} />
          </div>
          <div className="rounded-xl shadow-lg p-6" style={{ backgroundColor: '#f5f1ed' }}>
            <h2 className="text-xl font-semibold mb-4 flex items-center" style={{ color: '#1f2937' }}>
              <PieChart className="h-5 w-5 mr-2" style={{ color: '#867969' }} />
              Case Status Distribution
            </h2>
            <CaseStatusPieChart data={chartData.caseStatusDistribution} />
          </div>
        </div>
      )}

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Cases */}
        <div className="rounded-xl shadow-lg p-6" style={{ backgroundColor: '#f5f1ed' }}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center" style={{ color: '#1f2937' }}>
              <Briefcase className="h-5 w-5 mr-2" style={{ color: '#867969' }} />
              Recent Cases
            </h2>
            <button
              onClick={() => navigate('/admin/cases')}
              className="text-sm font-medium flex items-center transition-colors"
              style={{ color: '#867969' }}
            >
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          <div className="space-y-3">
            {recentCases.length === 0 ? (
              <p className="text-center py-8" style={{ color: '#9ca3af' }}>No cases yet</p>
            ) : (
              recentCases.map((caseItem) => (
                <div
                  key={caseItem._id}
                  onClick={() => navigate(`/admin/cases/${caseItem._id}`)}
                  className="p-4 border rounded-lg hover:shadow-md transition cursor-pointer"
                  style={{
                    borderColor: 'rgba(134, 121, 105, 0.25)',
                    backgroundColor: 'rgba(134, 121, 105, 0.08)',
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
                      className={`px-3 py-1 rounded-full text-xs font-medium`}
                      style={{
                        backgroundColor: 
                          caseItem.status === 'active' ? 'rgba(16, 185, 129, 0.2)' :
                          caseItem.status === 'pending' ? 'rgba(251, 191, 36, 0.2)' :
                          'rgba(107, 114, 128, 0.2)',
                        color:
                          caseItem.status === 'active' ? '#10b981' :
                          caseItem.status === 'pending' ? '#f59e0b' :
                          '#6b7280'
                      }}
                    >
                      {caseItem.status}
                    </span>
                  </div>
                  <div className="mt-2 text-xs" style={{ color: '#9ca3af' }}>
                    {caseItem.client && `Client: ${caseItem.client.f_name} ${caseItem.client.l_name}`}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pending Case Requests */}
        <div className="rounded-xl shadow-lg p-6" style={{ backgroundColor: '#f5f1ed' }}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center" style={{ color: '#1f2937' }}>
              <AlertCircle className="h-5 w-5 mr-2" style={{ color: '#f97316' }} />
              Pending Requests
            </h2>
            <button
              onClick={() => navigate('/admin/case-requests')}
              className="text-sm font-medium flex items-center transition-colors"
              style={{ color: '#867969' }}
            >
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          <div className="space-y-3">
            {recentRequests.filter(r => r.status === 'pending').length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 mx-auto mb-2" style={{ color: '#10b981' }} />
                <p style={{ color: '#9ca3af' }}>All caught up!</p>
              </div>
            ) : (
              recentRequests.filter(r => r.status === 'pending').map((request) => (
                <div
                  key={request._id}
                  onClick={() => navigate('/admin/case-requests')}
                  className="p-4 border rounded-lg hover:shadow-md transition cursor-pointer"
                  style={{
                    backgroundColor: 'rgba(251, 146, 60, 0.15)',
                    borderColor: 'rgba(251, 146, 60, 0.35)',
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold" style={{ color: '#1f2937' }}>{request.case_title}</h3>
                    <span
                      className="px-2 py-1 rounded text-xs font-medium"
                      style={{
                        backgroundColor:
                          request.urgency === 'high' ? 'rgba(239, 68, 68, 0.2)' :
                          request.urgency === 'medium' ? 'rgba(251, 191, 36, 0.2)' :
                          'rgba(16, 185, 129, 0.2)',
                        color:
                          request.urgency === 'high' ? '#ef4444' :
                          request.urgency === 'medium' ? '#f59e0b' :
                          '#10b981'
                      }}
                    >
                      {request.urgency}
                    </span>
                  </div>
                  <p className="text-sm mb-2" style={{ color: '#6b7280' }}>{request.case_type}</p>
                  <div className="text-xs" style={{ color: '#9ca3af' }}>
                    {request.client && `Requested by: ${request.client.f_name} ${request.client.l_name}`}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
