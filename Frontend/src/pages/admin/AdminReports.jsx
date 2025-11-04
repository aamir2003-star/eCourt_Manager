// src/pages/admin/Reports.jsx - UPDATED WITH LIGHT THEME
import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar } from 'lucide-react';
import api from '../../services/api';

const AdminReports = () => {
  const [reportData, setReportData] = useState({
    totalCases: 0,
    activeCases: 0,
    closedCases: 0,
    totalUsers: 0,
    casesByType: {}
  });

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
      const casesByType = {};
      
      cases.forEach(c => {
        casesByType[c.case_type] = (casesByType[c.case_type] || 0) + 1;
      });

      setReportData({
        totalCases: cases.length,
        activeCases: cases.filter(c => c.status === 'active').length,
        closedCases: cases.filter(c => c.status === 'closed').length,
        totalUsers: usersRes.data.count,
        casesByType
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
    }
  };

  const ReportCard = ({ icon: Icon, label, value, color }) => (
    <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: '#f5f1ed' }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm" style={{ color: '#6b7280' }}>{label}</p>
          <p className="text-2xl font-bold mt-1" style={{ color: '#1f2937' }}>{value}</p>
        </div>
        <Icon className="h-8 w-8" style={{ color: color }} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#E9E8E6' }}>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: '#1f2937' }}>Reports</h1>
        <p className="mt-2" style={{ color: '#6b7280' }}>System analytics and reports</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ReportCard
          icon={FileText}
          label="Total Cases"
          value={reportData.totalCases}
          color="#867969"
        />
        <ReportCard
          icon={Calendar}
          label="Active Cases"
          value={reportData.activeCases}
          color="#10b981"
        />
        <ReportCard
          icon={FileText}
          label="Closed Cases"
          value={reportData.closedCases}
          color="#6b7280"
        />
        <ReportCard
          icon={FileText}
          label="Total Users"
          value={reportData.totalUsers}
          color="#8b5cf6"
        />
      </div>

      {/* Cases by Type */}
      <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: '#f5f1ed' }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: '#1f2937' }}>Cases by Type</h2>
        <div className="space-y-3">
          {Object.entries(reportData.casesByType).length === 0 ? (
            <p className="text-center py-8" style={{ color: '#9ca3af' }}>No data available</p>
          ) : (
            Object.entries(reportData.casesByType).map(([type, count]) => (
              <div 
                key={type} 
                className="flex items-center justify-between p-4 rounded-lg transition-all hover:shadow-md"
                style={{ backgroundColor: 'rgba(134, 121, 105, 0.08)' }}
              >
                <span className="font-medium" style={{ color: '#1f2937' }}>{type}</span>
                <span className="font-semibold px-3 py-1 rounded" style={{ color: '#867969', backgroundColor: 'rgba(134, 121, 105, 0.15)' }}>{count} cases</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
