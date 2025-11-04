// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { CaseProvider } from './context/CaseContext';

//New Routes Added
import AllCases from './pages/admin/AllCases';
import AdminReports from './pages/admin/AdminReports';
import StaffMyCases from './pages/staff/CaseDetails';
import StaffHearings from './pages/staff/HearingSchedule';
import StaffAppointments from './pages/staff/StaffAppointments';
import StaffDocuments from './pages/staff/StaffDocuments ';

// Layout Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageStaff from './pages/admin/ManageStaff';

import ManageCaseRequests from './pages/admin/ManageCaseRequests';

// Staff Pages
import StaffDashboard from './pages/staff/StaffDashboard';
import ManageCases from './pages/staff/ManageCases';
import CaseDetails from './pages/staff/CaseDetails';
import HearingSchedule from './pages/staff/HearingSchedule';

// Client Pages
import ClientDashboard from './pages/client/ClientDashboard';
import ClientCases from './pages/client/MyCases';
import Appointments from './pages/client/Appointments';
import Feedback from './pages/client/Feedback';
import RequestCase from './pages/client/RequestCase';
import MyCaseRequests from './pages/client/MyCaseRequests';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#E9E8E6' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderBottomColor: '#867969' }}></div>
          <p style={{ color: '#6b7280' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Layout with Sidebar
const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#E9E8E6' }}>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <CaseProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <DashboardLayout>
                      <AdminDashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <DashboardLayout>
                      <ManageUsers />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

              // Admin Routes
<Route path="/admin/cases" element={
  <ProtectedRoute allowedRoles={['admin']}>
    <DashboardLayout><AllCases /></DashboardLayout>
  </ProtectedRoute>
} />

<Route path="/admin/reports" element={
  <ProtectedRoute allowedRoles={['admin']}>
    <DashboardLayout><AdminReports /></DashboardLayout>
  </ProtectedRoute>
} />

// Staff Routes
<Route path="/staff/cases" element={
  <ProtectedRoute allowedRoles={['staff']}>
    <DashboardLayout><StaffMyCases /></DashboardLayout>
  </ProtectedRoute>
} />

<Route path="/staff/hearings" element={
  <ProtectedRoute allowedRoles={['staff']}>
    <DashboardLayout><StaffHearings /></DashboardLayout>
  </ProtectedRoute>
} />

<Route path="/staff/appointments" element={
  <ProtectedRoute allowedRoles={['staff']}>
    <DashboardLayout><StaffAppointments /></DashboardLayout>
  </ProtectedRoute>
} />

<Route path="/staff/documents" element={
  <ProtectedRoute allowedRoles={['staff']}>
    <DashboardLayout><StaffDocuments /></DashboardLayout>
  </ProtectedRoute>
} />
              <Route
                path="/admin/case-requests"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <DashboardLayout>
                      <ManageCaseRequests />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/staff"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <DashboardLayout>
                      <ManageStaff />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/cases"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <DashboardLayout>
                      <ManageCases />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <DashboardLayout>
                      <AdminReports />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

              {/* Staff Routes */}
              <Route
                path="/staff/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['staff']}>
                    <DashboardLayout>
                      <StaffDashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/staff/cases"
                element={
                  <ProtectedRoute allowedRoles={['staff']}>
                    <DashboardLayout>
                      <ManageCases />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/staff/cases/:id"
                element={
                  <ProtectedRoute allowedRoles={['staff']}>
                    <DashboardLayout>
                      <CaseDetails />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/staff/hearings"
                element={
                  <ProtectedRoute allowedRoles={['staff']}>
                    <DashboardLayout>
                      <HearingSchedule />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

              {/* Client Routes */}
              <Route
                path="/client/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['client']}>
                    <DashboardLayout>
                      <ClientDashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/client/request-case"
                element={
                  <ProtectedRoute allowedRoles={['client']}>
                    <DashboardLayout>
                      <RequestCase />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/client/case-requests"
                element={
                  <ProtectedRoute allowedRoles={['client']}>
                    <DashboardLayout>
                      <MyCaseRequests />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/client/cases"
                element={
                  <ProtectedRoute allowedRoles={['client']}>
                    <DashboardLayout>
                      <ClientCases />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/client/cases/:id"
                element={
                  <ProtectedRoute allowedRoles={['client']}>
                    <DashboardLayout>
                      <CaseDetails />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/client/appointments"
                element={
                  <ProtectedRoute allowedRoles={['client']}>
                    <DashboardLayout>
                      <Appointments />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/client/feedback"
                element={
                  <ProtectedRoute allowedRoles={['client']}>
                    <DashboardLayout>
                      <Feedback />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </CaseProvider>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
