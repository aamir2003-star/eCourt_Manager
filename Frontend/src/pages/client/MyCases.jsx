// src/pages/client/MyCases.jsx - UPDATED WITH LIGHT THEME
import React from 'react';
import { useCase } from '../../context/CaseContext';
import CaseCard from '../../components/CaseCard';
import { Briefcase, AlertCircle } from 'lucide-react';

const MyCases = () => {
  const { cases, loading } = useCase();

  return (
    <div className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#E9E8E6' }}>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: '#1f2937' }}>My Cases</h1>
        <p className="mt-2" style={{ color: '#6b7280' }}>View all your legal cases and their progress</p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderBottomColor: '#867969' }}></div>
          <p style={{ color: '#6b7280' }}>Loading your cases...</p>
        </div>
      ) : cases.length === 0 ? (
        <div className="rounded-lg shadow-md p-12 text-center" style={{ backgroundColor: '#f5f1ed' }}>
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full" style={{ backgroundColor: 'rgba(134, 121, 105, 0.1)' }}>
              <Briefcase className="h-12 w-12" style={{ color: '#9ca3af' }} />
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: '#1f2937' }}>No cases found</h3>
          <p style={{ color: '#6b7280' }}>Your cases will appear here once they are assigned</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((caseItem) => (
            <CaseCard key={caseItem._id} caseData={caseItem} role="client" />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCases;
