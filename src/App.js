import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Spaces from './pages/Spaces';
import RoomsList from './pages/RoomsList';
import Tasks from './pages/Tasks';
import Expenses from './pages/Expenses';
import Inventory from './pages/Inventory';
import Users from './pages/Users';
import Assignments from './pages/Assignments';
import Problematiques from './pages/Problematiques';
import FinancialReports from './pages/FinancialReports';
import Investors from './pages/Investors';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import SuiviDocumentation from './pages/SuiviDocumentation';
import MyPayments from './pages/MyPayments';
import CashRegisters from './pages/CashRegisters';
import Banks from './pages/Banks';
import POS from './pages/POS';
import EspaceGuichetier from './pages/EspaceGuichetier';
import ValidationDemandes from './pages/ValidationDemandes';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import LoadingSpinner from './components/UI/LoadingSpinner';
import Departements from './pages/Departements';
import SousDepartements from './pages/SousDepartements';
import DemandesAffectation from './pages/DemandesAffectation';
import DemandesFonds from './pages/DemandesFonds';
import FichesExecution from './pages/FichesExecution';
import CycleVieArticles from './pages/CycleVieArticles';
import Buanderie from './pages/Buanderie';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="spaces" element={<Spaces />} />
                <Route path="rooms-list" element={<RoomsList />} />
                <Route path="issues" element={<Problematiques />} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="expenses" element={<Expenses />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="users" element={<Users />} />
                <Route path="assignments" element={<Assignments />} />
                <Route path="financial-reports" element={<FinancialReports />} />
                <Route path="my-payments" element={<MyPayments />} />
                <Route path="cash-registers" element={<CashRegisters />} />
                <Route path="banks" element={<Banks />} />
                <Route path="pos" element={<POS />} />
                <Route path="espace-guichetier" element={<EspaceGuichetier />} />
                <Route path="validation-demandes" element={<ValidationDemandes />} />
                <Route path="investors" element={<Investors />} />
                <Route path="profile" element={<Profile />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="suivi-documentation" element={<SuiviDocumentation />} />
                <Route path="departements" element={<Departements />} />
                <Route path="sous-departements" element={<SousDepartements />} />
                <Route path="demandes-affectation" element={<DemandesAffectation />} />
                <Route path="demandes-fonds" element={<DemandesFonds />} />
                <Route path="fiches-execution" element={<FichesExecution />} />
                <Route path="cycle-vie-articles" element={<CycleVieArticles />} />
                <Route path="buanderie" element={<Buanderie />} />
              </Route>
            </Routes>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </div>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 