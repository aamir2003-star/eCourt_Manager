// src/pages/admin/AdminReports.jsx - UPDATED WITH LIGHT THEME
import React, { useState, useEffect } from 'react';
import { 
  BarChart, FileText, TrendingUp, Users, 
  Download, Calendar, PieChart, Activity 
} from 'lucide-react';
import api from '../../services/api';

const AdminReports = () => {
  const [stats, setStats] = useState({
    totalCases: 0,
    activeCases: 0,
    closedCases: 0,
    pendingCases: 0,
    totalUsers: 0,
    totalStaff: 0,
    totalClients: 0,
    casesByType: {},
    casesByStatus: {},
    monthlyStats: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const [casesRes, usersRes] = await Promise.all([
        api.get('/cases'),
        api.get('/users')
      ]);

      const cases = casesRes.data.data;
      const users = usersRes.data.data;

      // Cases by type
      const casesByType = {};
      cases.forEach(c => {
        casesByType[c.case_type] = (casesByType[c.case_type] || 0) + 1;
      });

      // Cases by status
      const casesByStatus = {
        pending: cases.filter(c => c.status === 'pending').length,
        active: cases.filter(c => c.status === 'active').length,
        closed: cases.filter(c => c.status === 'closed').length,
        'on-hold': cases.filter(c => c.status === 'on-hold').length
      };

      // Monthly stats (last 6 months)
      const monthlyStats = getMonthlyStats(cases);

      setStats({
        totalCases: cases.length,
        activeCases: cases.filter(c => c.status === 'active').length,
        closedCases: cases.filter(c => c.status === 'closed').length,
        pendingCases: cases.filter(c => c.status === 'pending').length,
        totalUsers: users.length,
        totalStaff: users.filter(u => u.role === 'staff').length,
        totalClients: users.filter(u => u.role === 'client').length,
        casesByType,
        casesByStatus,
        monthlyStats
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMonthlyStats = (cases) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const stats = [];

    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const monthCases = cases.filter(c => {
        const caseMonth = new Date(c.case_reg_date).getMonth();
        return caseMonth === monthIndex;
      });

      stats.push({
        month: months[monthIndex],
        cases: monthCases.length,
        active: monthCases.filter(c => c.status === 'active').length,
        closed: monthCases.filter(c => c.status === 'closed').length
      });
    }

    return stats;
  };

  const exportReport = () => {
    const data = JSON.stringify(stats, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ecourt-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64" style={{ backgroundColor: '#E9E8E6' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderBottomColor: '#867969' }}></div>
          <p style={{ color: '#6b7280' }}>Loading report data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#E9E8E6' }}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#1f2937' }}>System Reports</h1>
          <p className="mt-2" style={{ color: '#6b7280' }}>Comprehensive analytics and insights</p>
        </div>
        <button
          onClick={exportReport}
          className="text-white px-6 py-3 rounded-lg hover:shadow-lg transition flex items-center space-x-2 shadow-md font-semibold transform hover:-translate-y-1"
          style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
        >
          <Download className="h-5 w-5" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-xl p-6 text-white shadow-md transform hover:-translate-y-1 transition" style={{ background: 'linear-gradient(135deg, #867969 0%, #a89983 100%)' }}>
          <FileText className="h-8 w-8 mb-3" />
          <p className="text-sm opacity-90">Total Cases</p>
          <p className="text-3xl font-bold">{stats.totalCases}</p>
        </div>
        <div className="rounded-xl p-6 text-white shadow-md transform hover:-translate-y-1 transition" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
          <Activity className="h-8 w-8 mb-3" />
          <p className="text-sm opacity-90">Active Cases</p>
          <p className="text-3xl font-bold">{stats.activeCases}</p>
        </div>
        <div className="rounded-xl p-6 text-white shadow-md transform hover:-translate-y-1 transition" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
          <Users className="h-8 w-8 mb-3" />
          <p className="text-sm opacity-90">Total Users</p>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="rounded-xl p-6 text-white shadow-md transform hover:-translate-y-1 transition" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
          <TrendingUp className="h-8 w-8 mb-3" />
          <p className="text-sm opacity-90">Success Rate</p>
          <p className="text-3xl font-bold">
            {stats.totalCases > 0 ? Math.round((stats.closedCases / stats.totalCases) * 100) : 0}%
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cases by Type */}
        <div className="rounded-xl shadow-md p-6" style={{ backgroundColor: '#f5f1ed' }}>
          <h2 className="text-xl font-semibold mb-4 flex items-center" style={{ color: '#1f2937' }}>
            <PieChart className="h-5 w-5 mr-2" style={{ color: '#867969' }} />
            Cases by Type
          </h2>
          <div className="space-y-3">
            {Object.entries(stats.casesByType).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#867969' }}></div>
                  <span className="font-medium" style={{ color: '#1f2937' }}>{type}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 rounded-full h-2" style={{ backgroundColor: 'rgba(134, 121, 105, 0.1)' }}>
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${(count / stats.totalCases) * 100}%`,
                        backgroundColor: '#867969'
                      }}
                    ></div>
                  </div>
                  <span className="font-semibold w-12 text-right" style={{ color: '#6b7280' }}>{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cases by Status */}
        <div className="rounded-xl shadow-md p-6" style={{ backgroundColor: '#f5f1ed' }}>
          <h2 className="text-xl font-semibold mb-4 flex items-center" style={{ color: '#1f2937' }}>
            <BarChart className="h-5 w-5 mr-2" style={{ color: '#10b981' }} />
            Cases by Status
          </h2>
          <div className="space-y-4">
            {Object.entries(stats.casesByStatus).map(([status, count]) => {
              const getStatusBar = (status) => {
                switch(status) {
                  case 'active':
                    return '#10b981';
                  case 'pending':
                    return '#f59e0b';
                  case 'closed':
                    return '#6b7280';
                  case 'on-hold':
                    return '#f97316';
                  default:
                    return '#867969';
                }
              };

              return (
                <div key={status} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize font-medium" style={{ color: '#1f2937' }}>{status}</span>
                    <span className="font-semibold" style={{ color: '#6b7280' }}>{count}</span>
                  </div>
                  <div className="w-full rounded-full h-3" style={{ backgroundColor: 'rgba(134, 121, 105, 0.1)' }}>
                    <div
                      className="h-3 rounded-full"
                      style={{
                        width: `${(count / stats.totalCases) * 100}%`,
                        backgroundColor: getStatusBar(status)
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="rounded-xl shadow-md p-6" style={{ backgroundColor: '#f5f1ed' }}>
        <h2 className="text-xl font-semibold mb-6 flex items-center" style={{ color: '#1f2937' }}>
          <Calendar className="h-5 w-5 mr-2" style={{ color: '#8b5cf6' }} />
          Monthly Case Trend (Last 6 Months)
        </h2>
        <div className="space-y-4">
          {stats.monthlyStats.map((month, idx) => (
            <div key={idx} className="flex items-center space-x-4">
              <div className="w-16 text-sm font-medium" style={{ color: '#1f2937' }}>{month.month}</div>
              <div className="flex-1 flex items-center space-x-2">
                <div className="flex-1 rounded-full h-8 relative overflow-hidden" style={{ backgroundColor: 'rgba(134, 121, 105, 0.1)' }}>
                  <div
                    className="h-full rounded-full flex items-center justify-end pr-2"
                    style={{
                      width: `${(month.active / Math.max(...stats.monthlyStats.map(m => m.cases))) * 100}%`,
                      backgroundColor: '#10b981'
                    }}
                  >
                    {month.active > 0 && (
                      <span className="text-xs text-white font-semibold">{month.active}</span>
                    )}
                  </div>
                </div>
                <div className="flex-1 rounded-full h-8 relative overflow-hidden" style={{ backgroundColor: 'rgba(134, 121, 105, 0.1)' }}>
                  <div
                    className="h-full rounded-full flex items-center justify-end pr-2"
                    style={{
                      width: `${(month.closed / Math.max(...stats.monthlyStats.map(m => m.cases))) * 100}%`,
                      backgroundColor: '#6b7280'
                    }}
                  >
                    {month.closed > 0 && (
                      <span className="text-xs text-white font-semibold">{month.closed}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="w-20 text-right">
                <span className="text-sm font-semibold" style={{ color: '#1f2937' }}>{month.cases} total</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#10b981' }}></div>
            <span style={{ color: '#6b7280' }}>Active</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#6b7280' }}></div>
            <span style={{ color: '#6b7280' }}>Closed</span>
          </div>
        </div>
      </div>

      {/* User Statistics */}
      <div className="rounded-xl shadow-md p-6" style={{ backgroundColor: '#f5f1ed' }}>
        <h2 className="text-xl font-semibold mb-4 flex items-center" style={{ color: '#1f2937' }}>
          <Users className="h-5 w-5 mr-2" style={{ color: '#8b5cf6' }} />
          User Distribution
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 rounded-lg" style={{ backgroundColor: 'rgba(134, 121, 105, 0.08)' }}>
            <p className="text-4xl font-bold" style={{ color: '#867969' }}>{stats.totalStaff}</p>
            <p className="mt-2" style={{ color: '#6b7280' }}>Staff Members</p>
          </div>
          <div className="text-center p-6 rounded-lg" style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)' }}>
            <p className="text-4xl font-bold" style={{ color: '#10b981' }}>{stats.totalClients}</p>
            <p className="mt-2" style={{ color: '#6b7280' }}>Clients</p>
          </div>
          <div className="text-center p-6 rounded-lg" style={{ backgroundColor: 'rgba(139, 92, 246, 0.08)' }}>
            <p className="text-4xl font-bold" style={{ color: '#8b5cf6' }}>
              {stats.totalClients > 0 ? (stats.totalCases / stats.totalClients).toFixed(1) : 0}
            </p>
            <p className="mt-2" style={{ color: '#6b7280' }}>Cases per Client</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
