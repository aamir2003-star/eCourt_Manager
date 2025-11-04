// src/pages/staff/Dashboard.jsx - UPDATED WITH LIGHT THEME
import { Briefcase, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useCase } from '../../context/CaseContext';
import CaseCard from '../../components/CaseCard';

const StaffDashboard = () => {
  const { cases, loading } = useCase();

  const stats = {
    totalCases: cases.length,
    activeCases: cases.filter(c => c.status === 'active').length,
    pendingCases: cases.filter(c => c.status === 'pending').length,
    closedCases: cases.filter(c => c.status === 'closed').length
  };

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div 
      className="rounded-lg shadow-md p-6 border-l-4 hover:shadow-lg transition transform hover:-translate-y-1"
      style={{ 
        backgroundColor: '#f5f1ed',
        borderColor: color
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm" style={{ color: '#6b7280' }}>{label}</p>
          <p className="text-2xl font-bold mt-2" style={{ color: '#1f2937' }}>{value}</p>
        </div>
        <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
          <Icon className="h-6 w-6" style={{ color }} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#E9E8E6' }}>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: '#1f2937' }}>Staff Dashboard</h1>
        <p className="mt-2" style={{ color: '#6b7280' }}>Manage your cases and schedules</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Briefcase}
          label="Total Cases"
          value={stats.totalCases}
          color="#867969"
        />
        <StatCard
          icon={Clock}
          label="Active Cases"
          value={stats.activeCases}
          color="#10b981"
        />
        <StatCard
          icon={Calendar}
          label="Pending Cases"
          value={stats.pendingCases}
          color="#f59e0b"
        />
        <StatCard
          icon={CheckCircle}
          label="Closed Cases"
          value={stats.closedCases}
          color="#6b7280"
        />
      </div>

      {/* My Cases Section */}
      <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: '#f5f1ed' }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: '#1f2937' }}>My Cases</h2>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderBottomColor: '#867969' }}></div>
            <p style={{ color: '#6b7280' }}>Loading cases...</p>
          </div>
        ) : cases.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full" style={{ backgroundColor: 'rgba(134, 121, 105, 0.1)' }}>
                <AlertCircle className="h-12 w-12" style={{ color: '#9ca3af' }} />
              </div>
            </div>
            <p style={{ color: '#9ca3af' }} className="font-medium">No cases assigned yet</p>
            <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>Cases will appear here once they are assigned to you</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cases.slice(0, 6).map((caseItem) => (
              <CaseCard key={caseItem._id} caseData={caseItem} role="staff" />
            ))}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {cases.length > 0 && (
        <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: '#f5f1ed', borderLeftWidth: '4px', borderLeftColor: '#867969' }}>
          <h3 className="font-semibold mb-4" style={{ color: '#1f2937' }}>Case Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm" style={{ color: '#6b7280' }}>Total Workload</p>
              <p className="text-lg font-bold mt-1" style={{ color: '#867969' }}>
                {stats.totalCases}
              </p>
            </div>
            <div>
              <p className="text-sm" style={{ color: '#6b7280' }}>Active Rate</p>
              <p className="text-lg font-bold mt-1" style={{ color: '#10b981' }}>
                {stats.totalCases > 0 ? Math.round((stats.activeCases / stats.totalCases) * 100) : 0}%
              </p>
            </div>
            <div>
              <p className="text-sm" style={{ color: '#6b7280' }}>Resolution Rate</p>
              <p className="text-lg font-bold mt-1" style={{ color: '#6b7280' }}>
                {stats.totalCases > 0 ? Math.round((stats.closedCases / stats.totalCases) * 100) : 0}%
              </p>
            </div>
            <div>
              <p className="text-sm" style={{ color: '#6b7280' }}>Pending Count</p>
              <p className="text-lg font-bold mt-1" style={{ color: '#f59e0b' }}>
                {stats.pendingCases}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
