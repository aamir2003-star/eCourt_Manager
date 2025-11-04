
// src/components/CaseCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, MapPin } from 'lucide-react';

const CaseCard = ({ caseData, role }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
      'on-hold': 'bg-orange-100 text-orange-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleClick = () => {
    const basePath = role === 'admin' ? '/admin' : role === 'staff' ? '/staff' : '/client';
    navigate(`${basePath}/cases/${caseData._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer border border-gray-200"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {caseData.case_title}
          </h3>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(caseData.status)}`}>
            {caseData.status}
          </span>
        </div>
        <span className="text-sm text-gray-500">{caseData.case_type}</span>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {caseData.description}
      </p>

      <div className="space-y-2 text-sm">
        {caseData.client && (
          <div className="flex items-center text-gray-600">
            <User className="h-4 w-4 mr-2" />
            <span>Client: {caseData.client.f_name} {caseData.client.l_name}</span>
          </div>
        )}
        
        {caseData.staff && role !== 'staff' && (
          <div className="flex items-center text-gray-600">
            <User className="h-4 w-4 mr-2" />
            <span>Lawyer: {caseData.staff.f_name} {caseData.staff.l_name}</span>
          </div>
        )}

        <div className="flex items-center text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Registered: {new Date(caseData.case_reg_date).toLocaleDateString()}</span>
        </div>

        {caseData.city && (
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{caseData.city.city_name}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseCard;