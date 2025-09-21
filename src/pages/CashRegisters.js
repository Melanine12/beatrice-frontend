import React, { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import CaisseModal from '../components/CashRegisters/CaisseModal';
import CaisseDetailsModal from '../components/CashRegisters/CaisseDetailsModal';
import CaissesTable from '../components/CashRegisters/CaissesTable';
import CaissesFilters from '../components/CashRegisters/CaissesFilters';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const CashRegisters = () => {
  const { user } = useAuth();
  const [caisses, setCaisses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCaisse, setEditingCaisse] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedCaisse, setSelectedCaisse] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [filters, setFilters] = useState({
    search: '',
    statut: '',
    devise: ''
  });
  const [pageLoading, setPageLoading] = useState(false);

  // Récupérer les caisses
  const fetchCaisses = async (page = 1, itemsPerPage = 10) => {
    try {
      setPageLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
        ...filters
      });

      const response = await api.get(`/caisses?${params}`);
      
      if (response.data.success) {
        setCaisses(response.data.caisses);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des caisses:', error);
      toast.error('Erreur lors de la récupération des caisses');
    } finally {
      setPageLoading(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaisses();
  }, []);

  useEffect(() => {
    // Recharger les données quand les filtres changent
    fetchCaisses(1, pagination.itemsPerPage);
  }, [filters]);

  const handleCreateCaisse = async (caisseData) => {
    try {
      const response = await api.post('/caisses', caisseData);
      
      if (response.data.success) {
        toast.success('Caisse créée avec succès');
        fetchCaisses(pagination.currentPage, pagination.itemsPerPage);
      }
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Erreur lors de la création de la caisse');
      }
      throw error;
    }
  };

  const handleUpdateCaisse = async (caisseData) => {
    try {
      const response = await api.put(`/caisses/${editingCaisse.id}`, caisseData);
      
      if (response.data.success) {
        toast.success('Caisse mise à jour avec succès');
        fetchCaisses(pagination.currentPage, pagination.itemsPerPage);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Erreur lors de la mise à jour de la caisse');
      }
      throw error;
    }
  };

  const handleDeleteCaisse = async (caisseId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette caisse ?')) {
      return;
    }

    try {
      const response = await api.delete(`/caisses/${caisseId}`);
      
      if (response.data.success) {
        toast.success('Caisse supprimée avec succès');
        fetchCaisses(pagination.currentPage, pagination.itemsPerPage);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Erreur lors de la suppression de la caisse');
      }
    }
  };

  const handleEditCaisse = (caisse) => {
    setEditingCaisse(caisse);
    setModalOpen(true);
  };

  const handleViewDetails = (caisse) => {
    setSelectedCaisse(caisse);
    setDetailsModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingCaisse(null);
  };

  const handleDetailsModalClose = () => {
    setDetailsModalOpen(false);
    setSelectedCaisse(null);
  };

  const handleCaisseUpdate = (caisseMiseAJour) => {
    // Mettre à jour la caisse dans la liste
    setCaisses(prevCaisses => 
      prevCaisses.map(caisse => 
        caisse.id === caisseMiseAJour.id 
          ? { ...caisse, ...caisseMiseAJour }
          : caisse
      )
    );
    
    // Mettre à jour la caisse sélectionnée si c'est la même
    if (selectedCaisse && selectedCaisse.id === caisseMiseAJour.id) {
      setSelectedCaisse(prev => ({ ...prev, ...caisseMiseAJour }));
    }
  };

  const handleModalSubmit = async (caisseData) => {
    if (editingCaisse) {
      await handleUpdateCaisse(caisseData);
    } else {
      await handleCreateCaisse(caisseData);
    }
  };

  const handlePageChange = (page) => {
    fetchCaisses(page, pagination.itemsPerPage);
  };

  const handleItemsPerPageChange = (itemsPerPage) => {
    fetchCaisses(1, itemsPerPage);
  };

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Gestion des Caisses
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Gérez les caisses enregistreuses et leurs soldes.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          {(user?.role === 'Superviseur' || user?.role === 'Superviseur Finance') && (
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Nouvelle caisse
            </button>
          )}
        </div>
      </div>

      {/* Filtres */}
      <CaissesFilters
        filters={filters}
        setFilters={handleFilterChange}
        onSearch={handleSearch}
      />

      {/* Tableau des caisses */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <CaissesTable
          caisses={caisses}
          onEdit={handleEditCaisse}
          onDelete={handleDeleteCaisse}
          onViewDetails={handleViewDetails}
          pagination={pagination}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          pageLoading={pageLoading}
        />
      </div>

      {/* Modal pour ajouter/modifier une caisse */}
      <CaisseModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        caisse={editingCaisse}
      />

      {/* Modal pour afficher les détails d'une caisse */}
      <CaisseDetailsModal
        isOpen={detailsModalOpen}
        onClose={handleDetailsModalClose}
        caisse={selectedCaisse}
        onCaisseUpdate={handleCaisseUpdate}
      />
    </div>
  );
};

export default CashRegisters; 