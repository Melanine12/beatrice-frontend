import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { PlusIcon, FunnelIcon, ChartBarIcon } from '@heroicons/react/24/outline';

// Import des composants
import ExpensesTable from '../components/Expenses/ExpensesTable';
import ExpensesModal from '../components/Expenses/ExpensesModal';
import ExpensesStats from '../components/Expenses/ExpensesStats';
import ExpensesFilters from '../components/Expenses/ExpensesFilters';
import PaiementsPartielsModal from '../components/Expenses/PaiementsPartielsModal';
import RappelsPaiementModal from '../components/Expenses/RappelsPaiementModal';

const Expenses = () => {
  const { user, hasPermission, hasExactRole } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [showPaiementsPartiels, setShowPaiementsPartiels] = useState(false);
  const [showRappelsPaiement, setShowRappelsPaiement] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [filters, setFilters] = useState({
    statut: '',
    categorie: '',
    search: '',
    dateFrom: '',
    dateTo: '',
    tags: []
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  useEffect(() => {
    fetchExpenses();
    fetchStats();
  }, [filters, pagination.currentPage]);

  const fetchExpenses = async () => {
    try {
      setPageLoading(true);
      const params = new URLSearchParams();
      
      if (filters.statut) params.append('statut', filters.statut);
      if (filters.categorie) params.append('categorie', filters.categorie);
      if (filters.search) params.append('search', filters.search);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      if (filters.tags && filters.tags.length > 0) {
        filters.tags.forEach(tag => params.append('tags', tag));
      }
      
      params.append('page', pagination.currentPage);
      params.append('limit', pagination.itemsPerPage);

      const response = await api.get(`/depenses?${params}`);
      setExpenses(response.data.depenses || []);
      
      // Update pagination info
      if (response.data.pagination) {
        setPagination(prev => ({
          ...prev,
          totalPages: response.data.pagination.pages,
          totalItems: response.data.pagination.total,
          currentPage: response.data.pagination.page
        }));
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error('Erreur lors du chargement des dépenses');
    } finally {
      setPageLoading(false);
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/depenses/stats/overview');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      console.log('📤 Tentative de sauvegarde avec les données:', formData);
      
      if (editingExpense) {
        console.log('🔄 Mise à jour de la dépense ID:', editingExpense.id);
        const response = await api.put(`/depenses/${editingExpense.id}`, formData);
        console.log('✅ Réponse mise à jour:', response.data);
        toast.success('Dépense mise à jour avec succès');
      } else {
        console.log('🆕 Création d\'une nouvelle dépense');
        const response = await api.post('/depenses', formData);
        console.log('✅ Réponse création:', response.data);
        toast.success('Dépense créée avec succès');
      }
      
      fetchExpenses();
      fetchStats();
      setShowModal(false);
      setEditingExpense(null);
    } catch (error) {
      console.error('❌ Erreur détaillée lors de la sauvegarde:');
      console.error('Status:', error.response?.status);
      console.error('Status Text:', error.response?.statusText);
      console.error('Headers:', error.response?.headers);
      console.error('Data:', error.response?.data);
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
      
      // Afficher un message d'erreur plus détaillé
      let errorMessage = 'Erreur lors de la sauvegarde';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
      return;
    }

    try {
      await api.delete(`/depenses/${id}`);
      toast.success('Dépense supprimée avec succès');
      fetchExpenses();
      fetchStats();
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.post(`/depenses/${id}/approve`);
      toast.success('Dépense approuvée avec succès');
      fetchExpenses();
      fetchStats();
    } catch (error) {
      console.error('Error approving expense:', error);
      toast.error('Erreur lors de l\'approbation');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.post(`/depenses/${id}/reject`);
      toast.success('Dépense rejetée avec succès');
      fetchExpenses();
      fetchStats();
    } catch (error) {
      console.error('Error rejecting expense:', error);
      toast.error('Erreur lors du rejet');
    }
  };

  const handlePay = async (id) => {
    try {
      await api.post(`/depenses/${id}/pay`);
      toast.success('Dépense marquée comme payée');
      fetchExpenses();
      fetchStats();
    } catch (error) {
      console.error('Error marking expense as paid:', error);
      toast.error('Erreur lors du marquage comme payée');
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowModal(true);
  };

  const handleNewExpense = () => {
    setEditingExpense(null); // Reset editing expense
    setShowModal(true);
  };

  const handlePaiementsPartiels = (expense) => {
    setSelectedExpense(expense);
    setShowPaiementsPartiels(true);
  };

  const handleRappelsPaiement = (expense) => {
    setSelectedExpense(expense);
    setShowRappelsPaiement(true);
  };

  const handlePageChange = (newPage) => {
    setPageLoading(true);
    setPagination(prev => ({
      ...prev,
      currentPage: newPage
    }));
  };


  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      statut: '',
      categorie: '',
      search: '',
      dateFrom: '',
      dateTo: '',
      tags: []
    });
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion des Dépenses
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Suivez et approuvez les dépenses de l'hôtel
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowStats(!showStats)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
              showStats 
                ? 'bg-primary-100 text-primary-700 border border-primary-300 dark:bg-primary-900 dark:text-primary-300' 
                : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <ChartBarIcon className="w-4 h-4 mr-2 inline" />
            Statistiques
          </button>
          
          {/* Bouton Nouvelle Dépense - Visible uniquement pour les Superviseurs */}
          {hasExactRole('Superviseur') && (
            <button
              onClick={handleNewExpense}
              className="btn-primary bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white px-6 py-3 text-sm font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center"
              title="Créer une nouvelle dépense"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Nouvelle Dépense
            </button>
          )}
        </div>
      </div>

      {/* Statistics */}
      {showStats && stats && (
        <ExpensesStats stats={stats} />
      )}

      {/* Filters */}
      <ExpensesFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Content */}
      <div className="card">
        <div className="card-body">
          <ExpensesTable 
            expenses={expenses}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onApprove={handleApprove}
            onReject={handleReject}
            onPay={handlePay}
            onPaiementsPartiels={handlePaiementsPartiels}
            onRappelsPaiement={handleRappelsPaiement}
            hasPermission={hasPermission}
            hasExactRole={hasExactRole}
            currentUser={user}
            loading={pageLoading}
            pagination={pagination}
            onPageChange={handlePageChange}
            onNewExpense={handleNewExpense}
          />
        </div>
      </div>

      {/* Floating Action Button for New Expense - Mobile friendly */}
      {hasExactRole('Superviseur') && (
        <button
          onClick={handleNewExpense}
          className="fixed bottom-6 right-6 md:hidden bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110 z-50"
          title="Créer une nouvelle dépense"
        >
          <PlusIcon className="w-6 h-6" />
        </button>
      )}

      {/* Modal for Add/Edit */}
      {showModal && (
        <ExpensesModal
          expense={editingExpense}
          onClose={() => {
            setShowModal(false);
            setEditingExpense(null);
          }}
          onSubmit={handleSubmit}
        />
      )}

      {/* Modal for Paiements Partiels */}
      {showPaiementsPartiels && selectedExpense && (
        <PaiementsPartielsModal
          expense={selectedExpense}
          onClose={() => {
            setShowPaiementsPartiels(false);
            setSelectedExpense(null);
          }}
          onUpdate={() => {
            fetchExpenses();
            fetchStats();
          }}
        />
      )}

      {/* Modal for Rappels Paiement */}
      {showRappelsPaiement && selectedExpense && (
        <RappelsPaiementModal
          expense={selectedExpense}
          onClose={() => {
            setShowRappelsPaiement(false);
            setSelectedExpense(null);
          }}
          onUpdate={() => {
            fetchExpenses();
            fetchStats();
          }}
        />
      )}
    </div>
  );
};

export default Expenses; 