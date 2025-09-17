import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import api, { bonsMenageAPI } from '../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import Pagination from '../components/UI/Pagination';
import Select from 'react-select';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import '../styles/react-select.css';
import { 
  ClipboardDocumentListIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  ClockIcon,
  UserIcon,
  BuildingOfficeIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

const BonsMenage = () => {
  const { user, hasPermission } = useAuth();
  const { addNotification } = useNotifications();
  const [bonsMenage, setBonsMenage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBon, setEditingBon] = useState(null);
  const [viewingBon, setViewingBon] = useState(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [filters, setFilters] = useState({
    utilisateur_id: '',
    numero_chambre_espace: '',
    etat_matin: '',
    etat_chambre_apres_entretien: '',
    shift: '',
    date_debut: '',
    date_fin: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [userOptions, setUserOptions] = useState([]);
  const [spaceOptions, setSpaceOptions] = useState([]);

  const etatMatinOptions = [
    { value: 'Propre', label: 'Propre' },
    { value: 'Sale', label: 'Sale' },
    { value: 'Très sale', label: 'Très sale' },
    { value: 'En désordre', label: 'En désordre' },
    { value: 'Rien à signaler', label: 'Rien à signaler' }
  ];

  const etatApresEntretienOptions = [
    { value: 'Parfait', label: 'Parfait' },
    { value: 'Bon', label: 'Bon' },
    { value: 'Moyen', label: 'Moyen' },
    { value: 'Problème signalé', label: 'Problème signalé' }
  ];

  const shiftOptions = [
    { value: 'Matin', label: 'Matin' },
    { value: 'Après-midi', label: 'Après-midi' },
    { value: 'Soir', label: 'Soir' },
    { value: 'Nuit', label: 'Nuit' }
  ];

  useEffect(() => {
    fetchBonsMenage();
    fetchUserOptions();
    fetchSpaceOptions();
  }, [filters, pagination.page, pagination.limit]);

  const fetchBonsMenage = async () => {
    try {
      setLoading(true);
      
      const response = await bonsMenageAPI.getAll({
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      });
      
      const data = response.data;
      
      setBonsMenage(data.bons_menage || []);
      
      if (data.pagination) {
        setPagination(prev => ({
          ...prev,
          total: data.pagination.total || 0,
          totalPages: data.pagination.pages || Math.ceil((data.pagination.total || 0) / pagination.limit)
        }));
      }
    } catch (error) {
      console.error('Error fetching cleaning orders:', error);
      toast.error('Erreur lors du chargement des bons de ménage');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOptions = async () => {
    try {
      const response = await bonsMenageAPI.getOptions.users();
      setUserOptions(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchSpaceOptions = async () => {
    try {
      const response = await bonsMenageAPI.getOptions.spaces();
      setSpaceOptions(response.data.spaces || []);
    } catch (error) {
      console.error('Error fetching spaces:', error);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingBon) {
        await bonsMenageAPI.update(editingBon.id, formData);
        toast.success('Bon de ménage mis à jour avec succès');
        
        // Notification pour la modification
        addNotification({
          title: 'Routine de ménage modifiée',
          message: `La routine de ménage pour ${formData.numero_chambre_espace} a été modifiée par ${user?.prenom} ${user?.nom}`,
          type: 'info',
          link: '/bons-menage'
        });
      } else {
        await bonsMenageAPI.create(formData);
        toast.success('Bon de ménage créé avec succès');
        
        // Notification pour la création
        addNotification({
          title: 'Nouvelle routine de ménage',
          message: `Une nouvelle routine de ménage a été créée pour ${formData.numero_chambre_espace} par ${user?.prenom} ${user?.nom}`,
          type: 'success',
          link: '/bons-menage'
        });
      }
      setShowModal(false);
      setEditingBon(null);
      fetchBonsMenage();
    } catch (error) {
      console.error('Error saving cleaning order:', error);
      const message = error.response?.data?.message || 'Erreur lors de la sauvegarde';
      toast.error(message);
      
      // Notification d'erreur
      addNotification({
        title: 'Erreur routine de ménage',
        message: `Erreur lors de la sauvegarde de la routine de ménage: ${message}`,
        type: 'error',
        link: '/bons-menage'
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce bon de ménage ?')) {
      return;
    }

    try {
      // Récupérer les informations du bon avant suppression pour la notification
      const bonToDelete = bonsMenage.find(bon => bon.id === id);
      
      await bonsMenageAPI.delete(id);
      toast.success('Bon de ménage supprimé avec succès');
      
      // Notification pour la suppression
      addNotification({
        title: 'Routine de ménage supprimée',
        message: `La routine de ménage pour ${bonToDelete?.numero_chambre_espace || 'espace inconnu'} a été supprimée par ${user?.prenom} ${user?.nom}`,
        type: 'warning',
        link: '/bons-menage'
      });
      
      fetchBonsMenage();
    } catch (error) {
      console.error('Error deleting cleaning order:', error);
      toast.error('Erreur lors de la suppression');
      
      // Notification d'erreur
      addNotification({
        title: 'Erreur suppression routine',
        message: `Erreur lors de la suppression de la routine de ménage: ${error.response?.data?.message || 'Erreur inconnue'}`,
        type: 'error',
        link: '/bons-menage'
      });
    }
  };

  const getEtatMatinColor = (etat) => {
    const colors = {
      'Propre': 'bg-green-100 text-green-800',
      'Sale': 'bg-yellow-100 text-yellow-800',
      'Très sale': 'bg-red-100 text-red-800',
      'En désordre': 'bg-orange-100 text-orange-800',
      'Rien à signaler': 'bg-blue-100 text-blue-800'
    };
    return colors[etat] || 'bg-gray-100 text-gray-800';
  };

  const getEtatApresEntretienColor = (etat) => {
    const colors = {
      'Parfait': 'bg-green-100 text-green-800',
      'Bon': 'bg-blue-100 text-blue-800',
      'Moyen': 'bg-yellow-100 text-yellow-800',
      'Problème signalé': 'bg-red-100 text-red-800'
    };
    return colors[etat] || 'bg-gray-100 text-gray-800';
  };

  const getShiftColor = (shift) => {
    const colors = {
      'Matin': 'bg-yellow-100 text-yellow-800',
      'Après-midi': 'bg-blue-100 text-blue-800',
      'Soir': 'bg-purple-100 text-purple-800',
      'Nuit': 'bg-indigo-100 text-indigo-800'
    };
    return colors[shift] || 'bg-gray-100 text-gray-800';
  };

  const formatDuration = (heureEntree, heureSortie) => {
    if (!heureEntree || !heureSortie) return 'En cours';
    
    const entree = new Date(`2000-01-01T${heureEntree}`);
    const sortie = new Date(`2000-01-01T${heureSortie}`);
    const diffMs = sortie - entree;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return `${hours}h${minutes.toString().padStart(2, '0')}`;
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleItemsPerPageChange = (newLimit) => {
    setPagination(prev => ({ 
      ...prev, 
      limit: newLimit, 
      page: 1
    }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const generatePDFReport = async () => {
    try {
      setGeneratingPDF(true);
      toast.loading('Génération du rapport PDF...', { id: 'pdf-generation' });

      // Récupérer tous les bons de ménage pour le PDF
      console.log('🔍 Fetching all bons de ménage for PDF...');
      
      let allBonsMenage = [];
      let page = 1;
      let hasMore = true;
      
      // Récupérer toutes les pages (limite max = 100 par page)
      while (hasMore) {
        console.log(`📄 Fetching page ${page}...`);
        const response = await api.get(`/bons-menage?page=${page}&limit=100`);
        
        const data = response.data;
        const pageBons = data.bons_menage || [];
        
        allBonsMenage = [...allBonsMenage, ...pageBons];
        
        // Vérifier s'il y a plus de pages
        hasMore = page < (data.pagination?.pages || 1);
        page++;
        
        // Limite de sécurité pour éviter les boucles infinies
        if (page > 50) {
          console.warn('⚠️ Limite de pages atteinte (50), arrêt de la récupération');
          break;
        }
      }

      console.log('📊 Total bons de ménage récupérés:', allBonsMenage.length);

      // Créer le PDF
      const doc = new jsPDF('landscape', 'mm', 'a4');
      
      // En-tête du document
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Rapport des Bons de Ménage', 105, 20, { align: 'center' });
      
      // Informations de génération
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 20, 35);
      doc.text(`Utilisateur: ${user?.prenom} ${user?.nom}`, 20, 42);
      doc.text(`Total bons: ${allBonsMenage.length}`, 20, 49);

      // Statistiques
      const stats = {
        propre: allBonsMenage.filter(b => b.etat_matin === 'Propre').length,
        sale: allBonsMenage.filter(b => b.etat_matin === 'Sale').length,
        tres_sale: allBonsMenage.filter(b => b.etat_matin === 'Très sale').length,
        desordre: allBonsMenage.filter(b => b.etat_matin === 'En désordre').length,
        rien_signal: allBonsMenage.filter(b => b.etat_matin === 'Rien à signaler').length,
        parfait: allBonsMenage.filter(b => b.etat_chambre_apres_entretien === 'Parfait').length,
        bon: allBonsMenage.filter(b => b.etat_chambre_apres_entretien === 'Bon').length,
        moyen: allBonsMenage.filter(b => b.etat_chambre_apres_entretien === 'Moyen').length,
        probleme: allBonsMenage.filter(b => b.etat_chambre_apres_entretien === 'Problème signalé').length
      };

      doc.text('Statistiques - État du matin:', 20, 60);
      doc.text(`Propre: ${stats.propre}`, 30, 67);
      doc.text(`Sale: ${stats.sale}`, 30, 74);
      doc.text(`Très sale: ${stats.tres_sale}`, 30, 81);
      doc.text(`En désordre: ${stats.desordre}`, 30, 88);
      doc.text(`Rien à signaler: ${stats.rien_signal}`, 30, 95);

      doc.text('Statistiques - État après entretien:', 120, 60);
      doc.text(`Parfait: ${stats.parfait}`, 130, 67);
      doc.text(`Bon: ${stats.bon}`, 130, 74);
      doc.text(`Moyen: ${stats.moyen}`, 130, 81);
      doc.text(`Problème signalé: ${stats.probleme}`, 130, 88);

      // Tableau des bons de ménage avec toutes les données (sans ID)
      const tableData = allBonsMenage.map(bon => [
        bon.nom_utilisateur,
        bon.numero_chambre_espace,
        bon.etat_matin,
        bon.heure_entree,
        bon.heure_sortie || 'En cours',
        bon.etat_chambre_apres_entretien,
        bon.shift,
        bon.designation || '-',
        bon.observation || '-'
      ]);

      autoTable(doc, {
        head: [['Agent', 'Espace', 'État Matin', 'Entrée', 'Sortie', 'État Après', 'Shift', 'Désignation', 'Observation']],
        body: tableData,
        startY: 105,
        margin: { left: 10, right: 10 },
        tableWidth: 'wrap',
        showHead: 'everyPage',
        pageBreak: 'auto',
        styles: { 
          fontSize: 7,
          cellPadding: 2,
          overflow: 'linebreak',
          halign: 'left',
          valign: 'top'
        },
        headStyles: { 
          fillColor: [59, 130, 246],
          textColor: [255, 255, 255],
          fontSize: 8,
          fontStyle: 'bold'
        },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        columnStyles: {
          0: { cellWidth: 30 },  // Agent (réduit)
          1: { cellWidth: 30 },  // Espace (réduit)
          2: { cellWidth: 25 },  // État Matin (réduit)
          3: { cellWidth: 20, halign: 'center' },  // Entrée (réduit)
          4: { cellWidth: 20, halign: 'center' },  // Sortie (réduit)
          5: { cellWidth: 25 },  // État Après (réduit)
          6: { cellWidth: 20, halign: 'center' },  // Shift (réduit)
          7: { cellWidth: 45 },  // Désignation (réduit)
          8: { cellWidth: 50 }   // Observation (réduit mais visible)
        },
        didDrawPage: function (data) {
          // Ajuster la hauteur des cellules pour les observations longues
          data.table.body.forEach((row, index) => {
            if (row[8] && row[8].length > 50) { // Si observation longue (index 8 au lieu de 9)
              row[8] = {
                content: row[8],
                styles: { cellHeight: 'auto' }
              };
            }
          });
        }
      });

      // Pied de page
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Page ${i} sur ${pageCount}`, 20, doc.internal.pageSize.height - 10);
        doc.text(`Rapport généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 105, doc.internal.pageSize.height - 10, { align: 'center' });
      }

      // Sauvegarder le PDF
      const filename = `rapport_bons_menage_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);

      toast.success('Rapport PDF généré avec succès!', { id: 'pdf-generation' });
      
      // Notification pour la génération de PDF
      addNotification({
        title: 'Rapport PDF généré',
        message: `Rapport des bons de ménage généré avec succès (${allBonsMenage.length} entrées) par ${user?.prenom} ${user?.nom}`,
        type: 'success',
        link: '/bons-menage'
      });

    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la génération du rapport PDF';
      toast.error(errorMessage, { id: 'pdf-generation' });
      
      // Notification d'erreur pour la génération de PDF
      addNotification({
        title: 'Erreur génération PDF',
        message: `Erreur lors de la génération du rapport PDF: ${errorMessage}`,
        type: 'error',
        link: '/bons-menage'
      });
    } finally {
      setGeneratingPDF(false);
    }
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
            Gestion des Bons de Ménage
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Suivez et gérez les tâches d'entretien des espaces
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={generatePDFReport}
            disabled={generatingPDF || bonsMenage.length === 0}
            className="btn-outline flex items-center"
          >
            <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
            {generatingPDF ? 'Génération...' : 'Rapport PDF'}
          </button>
          {user?.role === 'Agent Chambre' && (
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Nouvelle routine de ménage
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Recherche
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Numéro d'espace, utilisateur..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange({ ...filters, search: e.target.value })}
                  className="input pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Utilisateur
              </label>
              <select
                value={filters.utilisateur_id}
                onChange={(e) => handleFilterChange({ ...filters, utilisateur_id: e.target.value })}
                className="input"
              >
                <option value="">Tous les utilisateurs</option>
                {userOptions.map(user => (
                  <option key={user.id} value={user.id}>{user.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                État matin
              </label>
              <select
                value={filters.etat_matin}
                onChange={(e) => handleFilterChange({ ...filters, etat_matin: e.target.value })}
                className="input"
              >
                <option value="">Tous les états</option>
                {etatMatinOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Shift
              </label>
              <select
                value={filters.shift}
                onChange={(e) => handleFilterChange({ ...filters, shift: e.target.value })}
                className="input"
              >
                <option value="">Tous les shifts</option>
                {shiftOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date début
              </label>
              <input
                type="date"
                value={filters.date_debut}
                onChange={(e) => handleFilterChange({ ...filters, date_debut: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date fin
              </label>
              <input
                type="date"
                value={filters.date_fin}
                onChange={(e) => handleFilterChange({ ...filters, date_fin: e.target.value })}
                className="input"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => handleFilterChange({ 
                  utilisateur_id: '', 
                  numero_chambre_espace: '', 
                  etat_matin: '', 
                  etat_chambre_apres_entretien: '', 
                  shift: '', 
                  date_debut: '', 
                  date_fin: '', 
                  search: '' 
                })}
                className="btn-outline w-full"
              >
                <FunnelIcon className="w-4 h-4 mr-2" />
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bons de ménage List */}
      <div className="card">
        <div className="card-body">
          {bonsMenage.length === 0 ? (
            <div className="text-center py-8">
              <ClipboardDocumentListIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Aucun bon de ménage trouvé
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Commencez par créer une nouvelle routine de ménage
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Utilisateur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Espace
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      ID Chambre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      État matin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Heures
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      État après
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Shift
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {bonsMenage.map((bon) => (
                    <tr key={bon.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <UserIcon className="w-5 h-5 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {bon.nom_utilisateur}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {bon.utilisateur?.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <BuildingOfficeIcon className="w-5 h-5 text-gray-400 mr-2" />
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {bon.numero_chambre_espace}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {bon.chambre_id || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEtatMatinColor(bon.etat_matin)}`}>
                          {bon.etat_matin}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <ClockIcon className="w-4 h-4 text-gray-400 mr-1" />
                          <div className="text-sm text-gray-900 dark:text-white">
                            <div>{bon.heure_entree}</div>
                            {bon.heure_sortie && (
                              <div className="text-xs text-gray-500">
                                → {bon.heure_sortie} ({formatDuration(bon.heure_entree, bon.heure_sortie)})
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEtatApresEntretienColor(bon.etat_chambre_apres_entretien)}`}>
                          {bon.etat_chambre_apres_entretien}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getShiftColor(bon.shift)}`}>
                          {bon.shift}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setViewingBon(bon)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            title="Voir les détails"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          {user?.id === bon.created_by && (
                            <button
                              onClick={() => {
                                setEditingBon(bon);
                                setShowModal(true);
                              }}
                              className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                              title="Modifier"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                          )}
                          {user?.id === bon.created_by && (
                            <button
                              onClick={() => handleDelete(bon.id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              title="Supprimer"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 0 && (
        <div className="card">
          <div className="card-body">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.total}
              itemsPerPage={pagination.limit}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        </div>
      )}

      {/* Modal for Add/Edit */}
      {showModal && (
        <BonMenageModal
          bon={editingBon}
          onClose={() => {
            setShowModal(false);
            setEditingBon(null);
          }}
          onSubmit={handleSubmit}
          userOptions={userOptions}
          spaceOptions={spaceOptions}
          etatMatinOptions={etatMatinOptions}
          etatApresEntretienOptions={etatApresEntretienOptions}
          shiftOptions={shiftOptions}
          currentUser={user}
        />
      )}

      {/* Modal for View Details */}
      {viewingBon && (
        <BonMenageDetailsModal
          bon={viewingBon}
          onClose={() => setViewingBon(null)}
        />
      )}
    </div>
  );
};

// Modal Component for Add/Edit
const BonMenageModal = ({ 
  bon, 
  onClose, 
  onSubmit, 
  userOptions, 
  spaceOptions, 
  etatMatinOptions, 
  etatApresEntretienOptions, 
  shiftOptions,
  currentUser 
}) => {
  const [formData, setFormData] = useState({
    utilisateur_id: bon?.utilisateur_id || currentUser?.id || '',
    nom_utilisateur: bon?.nom_utilisateur || `${currentUser?.prenom} ${currentUser?.nom}` || '',
    numero_chambre_espace: bon?.numero_chambre_espace || '',
    chambre_id: bon?.chambre_id || '',
    etat_matin: bon?.etat_matin || 'Rien à signaler',
    designation: bon?.designation || '',
    heure_entree: bon?.heure_entree || '',
    heure_sortie: bon?.heure_sortie || '',
    etat_chambre_apres_entretien: bon?.etat_chambre_apres_entretien || 'Bon',
    observation: bon?.observation || '',
    shift: bon?.shift || 'Matin'
  });

  const [selectedSpace, setSelectedSpace] = useState(null);

  // Initialize selected space when spaceOptions or bon changes
  useEffect(() => {
    if (spaceOptions.length > 0 && formData.numero_chambre_espace) {
      const space = spaceOptions.find(space => space.numero === formData.numero_chambre_espace);
      if (space) {
        setSelectedSpace({
          value: space.numero,
          label: space.label,
          chambre_id: space.id
        });
      }
    }
  }, [spaceOptions, formData.numero_chambre_espace]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-update nom_utilisateur when utilisateur_id changes
    if (name === 'utilisateur_id') {
      const selectedUser = userOptions.find(user => user.id === parseInt(value));
      if (selectedUser) {
        setFormData(prev => ({
          ...prev,
          nom_utilisateur: selectedUser.label
        }));
      }
    }
  };

  const handleSpaceChange = (selectedOption) => {
    setSelectedSpace(selectedOption);
    if (selectedOption) {
      setFormData(prev => ({
        ...prev,
        numero_chambre_espace: selectedOption.value,
        chambre_id: selectedOption.chambre_id
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        numero_chambre_espace: '',
        chambre_id: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {bon ? 'Modifier la nouvelle routine de menage' : 'Nouvelle routine de ménage'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Utilisateur *
                </label>
                <input
                  type="text"
                  value={formData.nom_utilisateur}
                  readOnly
                  className="input bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                  placeholder="Utilisateur connecté"
                />
                <input
                  type="hidden"
                  name="utilisateur_id"
                  value={formData.utilisateur_id}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Espace *
                </label>
                <Select
                  value={selectedSpace}
                  onChange={handleSpaceChange}
                  options={spaceOptions.map(space => ({
                    value: space.numero,
                    label: space.label,
                    chambre_id: space.id
                  }))}
                  placeholder="Sélectionner un espace"
                  isSearchable
                  isClearable
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={{
                    control: (provided, state) => ({
                      ...provided,
                      minHeight: '42px',
                      borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
                      boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
                      '&:hover': {
                        borderColor: '#3b82f6'
                      }
                    }),
                    placeholder: (provided) => ({
                      ...provided,
                      color: '#9ca3af'
                    })
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Désignation *
              </label>
              <textarea
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
                rows="3"
                className="input"
                placeholder="Description de la tâche à effectuer..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  État du matin *
                </label>
                <select
                  name="etat_matin"
                  value={formData.etat_matin}
                  onChange={handleChange}
                  required
                  className="input"
                >
                  {etatMatinOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Shift *
                </label>
                <select
                  name="shift"
                  value={formData.shift}
                  onChange={handleChange}
                  required
                  className="input"
                >
                  {shiftOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Heure d'entrée *
                </label>
                <input
                  type="time"
                  name="heure_entree"
                  value={formData.heure_entree}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Heure de sortie
                </label>
                <input
                  type="time"
                  name="heure_sortie"
                  value={formData.heure_sortie}
                  onChange={handleChange}
                  className="input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                État après entretien *
              </label>
              <select
                name="etat_chambre_apres_entretien"
                value={formData.etat_chambre_apres_entretien}
                onChange={handleChange}
                required
                className="input"
              >
                {etatApresEntretienOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Observations
              </label>
              <textarea
                name="observation"
                value={formData.observation}
                onChange={handleChange}
                rows="3"
                className="input"
                placeholder="Observations particulières..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-outline"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                {bon ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Modal Component for View Details
const BonMenageDetailsModal = ({ bon, onClose }) => {
  const formatDuration = (heureEntree, heureSortie) => {
    if (!heureEntree || !heureSortie) return 'En cours';
    
    const entree = new Date(`2000-01-01T${heureEntree}`);
    const sortie = new Date(`2000-01-01T${heureSortie}`);
    const diffMs = sortie - entree;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return `${hours}h${minutes.toString().padStart(2, '0')}`;
  };

  const getEtatMatinColor = (etat) => {
    const colors = {
      'Propre': 'bg-green-100 text-green-800',
      'Sale': 'bg-yellow-100 text-yellow-800',
      'Très sale': 'bg-red-100 text-red-800',
      'En désordre': 'bg-orange-100 text-orange-800',
      'Rien à signaler': 'bg-blue-100 text-blue-800'
    };
    return colors[etat] || 'bg-gray-100 text-gray-800';
  };

  const getEtatApresEntretienColor = (etat) => {
    const colors = {
      'Parfait': 'bg-green-100 text-green-800',
      'Bon': 'bg-blue-100 text-blue-800',
      'Moyen': 'bg-yellow-100 text-yellow-800',
      'Problème signalé': 'bg-red-100 text-red-800'
    };
    return colors[etat] || 'bg-gray-100 text-gray-800';
  };

  const getShiftColor = (shift) => {
    const colors = {
      'Matin': 'bg-yellow-100 text-yellow-800',
      'Après-midi': 'bg-blue-100 text-blue-800',
      'Soir': 'bg-purple-100 text-purple-800',
      'Nuit': 'bg-indigo-100 text-indigo-800'
    };
    return colors[shift] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl">
          {/* Header */}
          <div className="relative overflow-hidden rounded-t-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700"></div>
            <div className="relative p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white bg-opacity-30 rounded-lg backdrop-blur-sm shadow-lg">
                    <ClipboardDocumentListIcon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-1 text-white drop-shadow-lg">
                      Bon de Ménage #{bon.id}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <BuildingOfficeIcon className="w-4 h-4 text-blue-100" />
                      <p className="text-lg text-blue-50 font-semibold">{bon.numero_chambre_espace}</p>
                      {bon.chambre_id && (
                        <span className="px-2 py-1 bg-white bg-opacity-30 rounded-full text-xs font-bold text-blue-900 shadow-md">
                          ID: {bon.chambre_id}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-white hover:text-blue-100 transition-all duration-200 p-2 rounded-full hover:bg-white hover:bg-opacity-30 transform hover:scale-110 shadow-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-xl p-3 border border-blue-200 dark:border-blue-700 shadow-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <UserIcon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-blue-800 dark:text-blue-200 text-lg">Utilisateur</h4>
                </div>
                <p className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-1">{bon.nom_utilisateur}</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">{bon.utilisateur?.email}</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-xl p-3 border border-green-200 dark:border-green-700 shadow-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <BuildingOfficeIcon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-green-800 dark:text-green-200 text-lg">Espace</h4>
                </div>
                <p className="text-xl font-bold text-green-900 dark:text-green-100 mb-1">{bon.numero_chambre_espace}</p>
                {bon.chambre_id && (
                  <p className="text-sm text-green-700 dark:text-green-300">ID: {bon.chambre_id}</p>
                )}
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-xl p-3 border border-purple-200 dark:border-purple-700 shadow-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <ClockIcon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-purple-800 dark:text-purple-200 text-lg">Durée</h4>
                </div>
                <p className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-1">
                  {formatDuration(bon.heure_entree, bon.heure_sortie)}
                </p>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  {bon.heure_entree} → {bon.heure_sortie || 'En cours'}
                </p>
              </div>
            </div>

            {/* States */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 rounded-xl p-3 border border-orange-200 dark:border-orange-700 shadow-lg">
                <h4 className="font-bold text-orange-800 dark:text-orange-200 mb-4 text-lg">État du matin</h4>
                <span className={`inline-flex px-4 py-2 text-base font-bold rounded-full ${getEtatMatinColor(bon.etat_matin)}`}>
                  {bon.etat_matin}
                </span>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900 dark:to-emerald-800 rounded-xl p-3 border border-emerald-200 dark:border-emerald-700 shadow-lg">
                <h4 className="font-bold text-emerald-800 dark:text-emerald-200 mb-4 text-lg">État après entretien</h4>
                <span className={`inline-flex px-4 py-2 text-base font-bold rounded-full ${getEtatApresEntretienColor(bon.etat_chambre_apres_entretien)}`}>
                  {bon.etat_chambre_apres_entretien}
                </span>
              </div>
            </div>

            {/* Shift */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900 dark:to-indigo-800 rounded-xl p-3 border border-indigo-200 dark:border-indigo-700 shadow-lg">
              <h4 className="font-bold text-indigo-800 dark:text-indigo-200 mb-4 text-lg">Équipe de travail</h4>
              <span className={`inline-flex px-4 py-2 text-base font-bold rounded-full ${getShiftColor(bon.shift)}`}>
                {bon.shift}
              </span>
            </div>

            {/* Designation and Observations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900 dark:to-amber-800 rounded-xl p-3 border border-amber-200 dark:border-amber-700 shadow-lg">
                <h4 className="font-bold text-amber-800 dark:text-amber-200 mb-4 text-lg">Désignation</h4>
                <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">{bon.designation}</p>
              </div>

              {bon.observation && (
                <div className="bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900 dark:to-rose-800 rounded-xl p-3 border border-rose-200 dark:border-rose-700 shadow-lg">
                  <h4 className="font-bold text-rose-800 dark:text-rose-200 mb-4 text-lg">Observations</h4>
                  <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">{bon.observation}</p>
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-600 shadow-lg">
              <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-4 text-lg">Informations de suivi</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-semibold text-gray-600 dark:text-gray-400">Créé le :</span>
                  <p className="text-gray-800 dark:text-gray-200">
                    {new Date(bon.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                {bon.createur && (
                  <div>
                    <span className="font-semibold text-gray-600 dark:text-gray-400">Créé par :</span>
                    <p className="text-gray-800 dark:text-gray-200">{bon.createur.prenom} {bon.createur.nom}</p>
                  </div>
                )}
                {bon.updated_at && bon.updated_at !== bon.created_at && (
                  <div>
                    <span className="font-semibold text-gray-600 dark:text-gray-400">Modifié le :</span>
                    <p className="text-gray-800 dark:text-gray-200">
                      {new Date(bon.updated_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}
                {bon.modificateur && (
                  <div>
                    <span className="font-semibold text-gray-600 dark:text-gray-400">Modifié par :</span>
                    <p className="text-gray-800 dark:text-gray-200">{bon.modificateur.prenom} {bon.modificateur.nom}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                onClick={onClose}
                className="px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 text-white font-bold rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BonsMenage;
