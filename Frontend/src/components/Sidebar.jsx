// src/components/Sidebar.jsx - UPDATED WITH LIGHT THEME
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  FileText, 
  Calendar,
  MessageSquare,
  UserPlus,
  Plus,
  Clock,
  ClipboardList,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const adminLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'Manage Users' },
    { to: '/admin/staff', icon: UserPlus, label: 'Manage Staff' },
    { to: '/admin/cases', icon: Briefcase, label: 'All Cases' },
    { to: '/admin/case-requests', icon: ClipboardList, label: 'Case Requests' },
    { to: '/admin/reports', icon: BarChart3, label: 'Reports' },
    { to: '/admin/inquiries', icon: MessageSquare, label: 'Inquiries' }
  ];

  const staffLinks = [
    { to: '/staff/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/staff/cases', icon: Briefcase, label: 'My Cases' },
    { to: '/staff/calendar', icon: Calendar, label: 'My Calendar' },
    { to: '/staff/hearings', icon: Calendar, label: 'Hearings' },
    { to: '/staff/appointments', icon: Calendar, label: 'Appointments' },
    { to: '/staff/documents', icon: FileText, label: 'Documents' }
  ];

  const clientLinks = [
    { to: '/client/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/client/request-case', icon: Plus, label: 'Request Case' },
    { to: '/client/case-requests', icon: Clock, label: 'My Requests' },
    { to: '/client/cases', icon: Briefcase, label: 'My Cases' },
    { to: '/client/calendar', icon: Calendar, label: 'My Calendar' },
    { to: '/client/appointments', icon: Calendar, label: 'Appointments' },
    { to: '/client/feedback', icon: MessageSquare, label: 'Feedback' }
  ];

  let links = [];
  if (user?.role === 'admin') links = adminLinks;
  else if (user?.role === 'staff') links = staffLinks;
  else if (user?.role === 'client') links = clientLinks;

  return (
    <aside className="w-64 shadow-lg h-full overflow-y-auto" style={{ backgroundColor: '#f5f1ed', borderRightWidth: '1px', borderRightColor: 'rgba(134, 121, 105, 0.2)' }}>
      <div className="p-4">
        {/* Role Badge */}
        <div className="mb-4 p-3 rounded-lg border" style={{ backgroundColor: 'rgba(134, 121, 105, 0.1)', borderColor: 'rgba(134, 121, 105, 0.3)' }}>
          <p className="text-xs mb-1" style={{ color: '#6b7280' }}>Logged in as</p>
          <p className="text-sm font-semibold capitalize" style={{ color: '#867969' }}>{user?.role}</p>
        </div>

        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            
            return (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200"
                style={{
                  background: isActive ? 'linear-gradient(135deg, #867969 0%, #a89983 100%)' : 'transparent',
                  color: isActive ? '#ffffff' : '#6b7280',
                  transform: isActive ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: isActive ? '0 4px 12px rgba(134, 121, 105, 0.3)' : 'none'
                }}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Scrollbar styling */}
      <style jsx>{`
        aside::-webkit-scrollbar {
          width: 8px;
        }

        aside::-webkit-scrollbar-track {
          background: transparent;
        }

        aside::-webkit-scrollbar-thumb {
          background: rgba(134, 121, 105, 0.3);
          border-radius: 4px;
        }

        aside::-webkit-scrollbar-thumb:hover {
          background: rgba(134, 121, 105, 0.5);
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
