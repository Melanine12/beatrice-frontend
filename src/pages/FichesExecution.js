import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { 
  PlusIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  PlayIcon, 
  CheckIcon, 
  XMarkIcon,
  EyeIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

// Import pour l'export PDF
import jsPDF from 'jspdf';

const FichesExecution = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [fiches, setFiches] = useState([]);
  const [filters, setFilters] = useState({
    statut: '',
    priorite: '',
    responsable_id: '',
    search: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedFiche, setSelectedFiche] = useState(null);
  const [viewFiche, setViewFiche] = useState(null);
  const [saving, setSaving] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  // Form state
  const [form, setForm] = useState({
    tache_id: '',
    titre: '',
    description: '',
    priorite: 'normale',
    date_debut_prevue: '',
    date_fin_prevue: '',
    duree_prevue: '',
    responsable_id: '',
    superviseur_id: '',
    commentaire: '',
    elements: []
  });

  const emptyElement = {
    type: 'materiel',
    nom: '',
    description: '',
    quantite: 1,
    unite: '',
    disponible: false,
    fournisseur: '',
    reference: '',
    cout_estime: '',
    devise: 'EUR'
  };

  useEffect(() => {
    fetchFiches();
  }, [filters]);

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/taches?limit=1000');
      // L'API retourne { taches: [...] } au lieu de { data: [...] }
      setTasks(res.data.taches || res.data.data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des tâches:', err);
      toast.error("Impossible de charger les tâches");
    }
  };

  const fetchUsers = async () => {
    try {
      console.log('🔄 Tentative de chargement des utilisateurs...');
      // Utiliser une limite élevée pour récupérer tous les utilisateurs
      const res = await api.get('/users?limit=100');
      console.log('📡 Réponse API utilisateurs:', res.data);
      
      // L'API retourne { users: [...] } au lieu de { data: [...] }
      const usersData = res.data.users || res.data.data || [];
      console.log('👥 Utilisateurs extraits:', usersData.length);
      console.log('IDs disponibles:', usersData.map(u => u.id).join(', '));
      
      // Vérifier spécifiquement l'utilisateur ID 2
      const userID2 = usersData.find(u => u.id === 2);
      if (userID2) {
        console.log('✅ Utilisateur ID 2 trouvé:', `${userID2.prenom} ${userID2.nom}`);
      } else {
        console.log('❌ Utilisateur ID 2 NON trouvé !');
      }
      
      setUsers(usersData);
      console.log('✅ Utilisateurs chargés avec succès:', usersData.length);
      
    } catch (err) {
      console.error('❌ Erreur lors du chargement des utilisateurs:', err);
      console.error('Détails de l\'erreur:', err.response?.data);
      toast.error("Impossible de charger les utilisateurs");
    }
  };

  const fetchFiches = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.statut) params.append('statut', filters.statut);
      if (filters.priorite) params.append('priorite', filters.priorite);
      if (filters.responsable_id) params.append('responsable_id', filters.responsable_id);
      if (filters.search) params.append('search', filters.search);
      
      const res = await api.get(`/fiches-execution?${params}`);
      let allFiches = res.data.data || [];
      
      // Appliquer les permissions de vue
      if (!canViewAll()) {
        // L'utilisateur ne peut voir que ses propres fiches
        allFiches = allFiches.filter(fiche => 
          fiche.responsable_id === user.id || fiche.createur_id === user.id
        );
      }
      
      // Appliquer les filtres supplémentaires côté client
      let filteredFiches = allFiches;
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredFiches = filteredFiches.filter(fiche =>
          fiche.titre?.toLowerCase().includes(searchTerm) ||
          fiche.numero?.toLowerCase().includes(searchTerm) ||
          fiche.description?.toLowerCase().includes(searchTerm) ||
          fiche.tache?.titre?.toLowerCase().includes(searchTerm)
        );
      }
      
      setFiches(filteredFiches);
      console.log(`📊 Fiches chargées: ${filteredFiches.length} (total: ${allFiches.length})`);
      
    } catch (err) {
      console.error('Erreur lors du chargement des fiches:', err);
      toast.error("Erreur lors du chargement des fiches d'exécution");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (fiche = null) => {
    if (fiche) {
      setSelectedFiche(fiche);
      setForm({
        tache_id: fiche.tache_id,
        titre: fiche.titre,
        description: fiche.description || '',
        priorite: fiche.priorite,
        date_debut_prevue: fiche.date_debut_prevue ? fiche.date_debut_prevue.split('T')[0] : '',
        date_fin_prevue: fiche.date_fin_prevue ? fiche.date_fin_prevue.split('T')[0] : '',
        duree_prevue: fiche.duree_prevue || '',
        responsable_id: fiche.responsable_id,
        superviseur_id: fiche.superviseur_id || '',
        commentaire: fiche.commentaire || '',
        elements: fiche.elements || []
      });
    } else {
      setSelectedFiche(null);
      setForm({
        tache_id: '',
        titre: '',
        description: '',
        priorite: 'normale',
        date_debut_prevue: '',
        date_fin_prevue: '',
        duree_prevue: '',
        responsable_id: '',
        superviseur_id: '',
        commentaire: '',
        elements: []
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedFiche(null);
    setForm({
      tache_id: '',
      titre: '',
      description: '',
      priorite: 'normale',
      date_debut_prevue: '',
      date_fin_prevue: '',
      duree_prevue: '',
      responsable_id: '',
      superviseur_id: '',
      commentaire: '',
      elements: []
    });
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      if (selectedFiche) {
        // Mise à jour
        await api.put(`/fiches-execution/${selectedFiche.id}`, form);
        toast.success('Fiche d\'exécution mise à jour avec succès');
        
        // Notification pour la modification de fiche
        addNotification({
          title: 'Fiche d\'exécution modifiée',
          message: `La fiche d'exécution "${form.titre}" a été modifiée par ${user?.prenom} ${user?.nom}`,
          type: 'info',
          link: '/fiches-execution'
        });
      } else {
        // Création
        await api.post('/fiches-execution', form);
        toast.success('Fiche d\'exécution créée avec succès');
        
        // Notification pour la création de fiche
        addNotification({
          title: 'Nouvelle fiche d\'exécution',
          message: `Une nouvelle fiche d'exécution "${form.titre}" a été créée par ${user?.prenom} ${user?.nom}`,
          type: 'success',
          link: '/fiches-execution'
        });
      }
      
      closeModal();
      fetchFiches();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      const msg = err.response?.data?.message || 'Erreur lors de la sauvegarde';
      toast.error(msg);
      
      // Notification d'erreur
      addNotification({
        title: 'Erreur fiche d\'exécution',
        message: `Erreur lors de la sauvegarde de la fiche d'exécution: ${msg}`,
        type: 'error',
        link: '/fiches-execution'
      });
    } finally {
      setSaving(false);
    }
  };

  const addElement = () => {
    setForm(prev => ({
      ...prev,
      elements: [...prev.elements, { ...emptyElement }]
    }));
  };

  const removeElement = (index) => {
    setForm(prev => ({
      ...prev,
      elements: prev.elements.filter((_, i) => i !== index)
    }));
  };

  const updateElement = (index, field, value) => {
    setForm(prev => ({
      ...prev,
      elements: prev.elements.map((el, i) => 
        i === index ? { ...el, [field]: value } : el
      )
    }));
  };

  const deleteFiche = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette fiche d\'exécution ?')) return;
    
    try {
      // Récupérer les informations de la fiche avant suppression pour la notification
      const ficheToDelete = fiches.find(f => f.id === id);
      
      await api.delete(`/fiches-execution/${id}`);
      toast.success('Fiche d\'exécution supprimée avec succès');
      
      // Notification pour la suppression de fiche
      addNotification({
        title: 'Fiche d\'exécution supprimée',
        message: `La fiche d'exécution "${ficheToDelete?.titre || 'inconnue'}" a été supprimée par ${user?.prenom} ${user?.nom}`,
        type: 'warning',
        link: '/fiches-execution'
      });
      
      fetchFiches();
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      const msg = err.response?.data?.message || 'Erreur lors de la suppression';
      toast.error(msg);
      
      // Notification d'erreur
      addNotification({
        title: 'Erreur suppression fiche',
        message: `Erreur lors de la suppression de la fiche d'exécution: ${msg}`,
        type: 'error',
        link: '/fiches-execution'
      });
    }
  };

  const changeStatus = async (id, newStatus) => {
    try {
      // Récupérer les informations de la fiche avant changement de statut pour la notification
      const fiche = fiches.find(f => f.id === id);
      const oldStatus = fiche?.statut;
      
      const updateData = { statut: newStatus };
      
      if (newStatus === 'en_cours') {
        updateData.date_debut_reelle = new Date().toISOString();
      } else if (newStatus === 'terminee') {
        updateData.date_fin_reelle = new Date().toISOString();
      }
      
      await api.put(`/fiches-execution/${id}/status`, updateData);
      
      const statusLabel = newStatus === 'en_cours' ? 'démarrée' : 
                         newStatus === 'terminee' ? 'terminée' : 
                         newStatus === 'annulee' ? 'annulée' : newStatus;
      
      toast.success(`Fiche d'exécution ${statusLabel} avec succès`);
      
      // Notification pour le changement de statut
      addNotification({
        title: 'Statut de fiche modifié',
        message: `Le statut de la fiche d'exécution "${fiche?.titre || 'inconnue'}" a été changé de "${getStatusLabel(oldStatus)}" à "${getStatusLabel(newStatus)}" par ${user?.prenom} ${user?.nom}`,
        type: 'info',
        link: '/fiches-execution'
      });
      
      fetchFiches();
    } catch (err) {
      console.error('Erreur lors du changement de statut:', err);
      toast.error("Erreur lors du changement de statut");
      
      // Notification d'erreur
      addNotification({
        title: 'Erreur changement de statut',
        message: `Erreur lors du changement de statut de la fiche d'exécution: ${err.response?.data?.message || 'Erreur inconnue'}`,
        type: 'error',
        link: '/fiches-execution'
      });
    }
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'en_preparation': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'en_cours': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'terminee': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'annulee': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusLabel = (statut) => {
    switch (statut) {
      case 'en_preparation': return 'En préparation';
      case 'en_cours': return 'En cours';
      case 'terminee': return 'Terminée';
      case 'annulee': return 'Annulée';
      default: return statut;
    }
  };

  const getPriorityColor = (priorite) => {
    switch (priorite) {
      case 'urgente': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'haute': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'normale': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'basse': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPriorityLabel = (priorite) => {
    switch (priorite) {
      case 'urgente': return 'Urgente';
      case 'haute': return 'Haute';
      case 'normale': return 'Normale';
      case 'basse': return 'Basse';
      default: return priorite;
    }
  };

  const canEdit = (fiche) => {
    // Administrateur et Patron peuvent tout modifier
    if (user?.role === 'Administrateur' || user?.role === 'Patron') return true;
    
    // Superviseur peut modifier toutes les fiches de son département
    if (user?.role === 'Superviseur') return true;
    
    // Agent peut modifier ses propres fiches ou les fiches où il est responsable
    if (user?.role === 'Agent') {
      return fiche.responsable_id === user.id || fiche.createur_id === user.id;
    }
    
    return false;
  };

  const canDelete = (fiche) => {
    // Seules les fiches en préparation peuvent être supprimées
    if (fiche.statut !== 'en_preparation') return false;
    
    // Administrateur et Patron peuvent tout supprimer
    if (user?.role === 'Administrateur' || user?.role === 'Patron') return true;
    
    // Superviseur peut supprimer les fiches de son département
    if (user?.role === 'Superviseur') return true;
    
    // Agent peut supprimer ses propres fiches
    if (user?.role === 'Agent') {
      return fiche.responsable_id === user.id;
    }
    
    return false;
  };

  const canCreate = () => {
    // Tous les rôles peuvent créer des fiches
    return true;
  };

  const canViewAll = () => {
    // Administrateur, Patron et Superviseur voient tout
    return user?.role === 'Administrateur' || user?.role === 'Patron' || user?.role === 'Superviseur';
  };

  const canChangeStatus = (fiche) => {
    // Administrateur et Patron peuvent tout faire
    if (user?.role === 'Administrateur' || user?.role === 'Patron') return true;
    
    // Superviseur peut changer le statut de toutes les fiches
    if (user?.role === 'Superviseur') return true;
    
    // Agent peut changer le statut de ses propres fiches
    if (user?.role === 'Agent') {
      return fiche.responsable_id === user.id;
    }
    
    return false;
  };

  const canExport = () => {
    // Seuls les rôles élevés peuvent exporter
    return user?.role === 'Administrateur' || user?.role === 'Patron' || user?.role === 'Superviseur';
  };

  const exportFiches = () => {
    try {
      console.log('🔄 Début de l\'export PDF...');
      
      // Filtrer les fiches selon les permissions
      let fichesToExport = fiches;
      
      // Si l'utilisateur ne peut pas voir tout, filtrer ses fiches
      if (!canViewAll()) {
        fichesToExport = fiches.filter(f => 
          f.responsable_id === user.id || f.createur_id === user.id
        );
      }
      
      console.log(`📊 Fiches à exporter: ${fichesToExport.length}`);
      
      // Créer le PDF
      const doc = new jsPDF();
      
      // En-tête du document
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Rapport des Fiches d\'Exécution', 105, 20, { align: 'center' });
      
      // Informations de génération
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 20, 35);
      doc.text(`Utilisateur: ${user?.prenom} ${user?.nom}`, 20, 42);
      doc.text(`Total fiches: ${fichesToExport.length}`, 20, 49);
      
      // Statistiques
      const stats = {
        en_preparation: fichesToExport.filter(f => f.statut === 'en_preparation').length,
        en_cours: fichesToExport.filter(f => f.statut === 'en_cours').length,
        terminee: fichesToExport.filter(f => f.statut === 'terminee').length,
        annulee: fichesToExport.filter(f => f.statut === 'annulee').length
      };
      
      doc.text('Statistiques:', 20, 60);
      doc.text(`En préparation: ${stats.en_preparation}`, 30, 67);
      doc.text(`En cours: ${stats.en_cours}`, 30, 74);
      doc.text(`Terminées: ${stats.terminee}`, 30, 81);
      doc.text(`Annulées: ${stats.annulee}`, 30, 88);
      
      // Tableau des fiches - Approche simplifiée
      let yPosition = 100;
      
      // En-têtes du tableau
      const headers = ['Numéro', 'Titre', 'Responsable', 'Statut', 'Priorité', 'Éléments'];
      const columnWidths = [30, 50, 35, 25, 25, 20];
      let xPosition = 20;
      
      // Dessiner les en-têtes
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setFillColor(41, 128, 185);
      doc.rect(xPosition, yPosition - 5, columnWidths.reduce((a, b) => a + b, 0), 8, 'F');
      
      doc.setTextColor(255, 255, 255);
      headers.forEach((header, index) => {
        doc.text(header, xPosition + 2, yPosition);
        xPosition += columnWidths[index];
      });
      
      // Données des fiches
      yPosition += 10;
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      
      fichesToExport.forEach((fiche, index) => {
        // Vérifier si on doit passer à la page suivante
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        
        // Ligne avec alternance de couleurs
        const fillColor = index % 2 === 0 ? [245, 245, 245] : [255, 255, 255];
        doc.setFillColor(...fillColor);
        doc.rect(20, yPosition - 3, 185, 6, 'F');
        
        // Données de la ligne
        xPosition = 20;
        const rowData = [
          fiche.numero || 'N/A',
          fiche.titre || 'N/A',
          fiche.responsable ? `${fiche.responsable.prenom} ${fiche.responsable.nom}` : 'N/A',
          getStatusLabel(fiche.statut) || 'N/A',
          getPriorityLabel(fiche.priorite) || 'N/A',
          fiche.elements?.length || 0
        ];
        
        rowData.forEach((data, colIndex) => {
          // Tronquer le texte si nécessaire
          let displayText = String(data);
          if (colIndex === 1 && displayText.length > 25) { // Titre
            displayText = displayText.substring(0, 22) + '...';
          }
          if (colIndex === 2 && displayText.length > 20) { // Responsable
            displayText = displayText.substring(0, 17) + '...';
          }
          
          doc.text(displayText, xPosition + 2, yPosition);
          xPosition += columnWidths[colIndex];
        });
        
        yPosition += 8;
      });
      
      // Pied de page
      const finalY = Math.max(yPosition, 100);
      doc.setFontSize(8);
      doc.text('Document généré automatiquement par le système Beatrice', 105, finalY + 10, { align: 'center' });
      
      // Sauvegarder le PDF
      const fileName = `fiches_execution_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      console.log('✅ Export PDF réussi !');
      toast.success('Export PDF réussi !');
      
      // Notification pour l'export PDF réussi
      addNotification({
        title: 'Rapport PDF généré',
        message: `Rapport des fiches d'exécution généré avec succès (${fichesToExport.length} fiches) par ${user?.prenom} ${user?.nom}`,
        type: 'success',
        link: '/fiches-execution'
      });
    } catch (error) {
      console.error('❌ Erreur lors de l\'export PDF:', error);
      console.error('Détails de l\'erreur:', error.stack);
      toast.error('Erreur lors de l\'export PDF');
      
      // Notification d'erreur pour l'export PDF
      addNotification({
        title: 'Erreur génération PDF',
        message: `Erreur lors de la génération du rapport PDF des fiches d'exécution: ${error.message || 'Erreur inconnue'}`,
        type: 'error',
        link: '/fiches-execution'
      });
    }
  };

  const taskOptions = tasks.map(t => ({ 
    value: t.id, 
    label: `${t.titre} (${t.priorite})`,
    task: t // Garder la référence complète de la tâche
  }));

  const userOptions = users.map(u => ({ 
    value: u.id, 
    label: `${u.prenom} ${u.nom}` 
  }));

  // Debug des options
  console.log('🔍 Debug des options:');
  console.log('Tasks disponibles:', tasks.length);
  console.log('TaskOptions créés:', taskOptions.length);
  console.log('Users disponibles:', users.length);
  console.log('UserOptions créés:', userOptions.length);
  
  if (taskOptions.length > 0) {
    console.log('Première taskOption:', taskOptions[0]);
  }
  if (userOptions.length > 0) {
    console.log('Première userOption:', userOptions[0]);
  }
  
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
            Fiches d'Exécution
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gérer les fiches d'exécution des tâches avec leurs éléments d'intervention
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Statistiques rapides */}
          <div className="hidden md:flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="text-center">
              <div className="font-semibold text-blue-600 dark:text-blue-400">
                {fiches.filter(f => f.statut === 'en_preparation').length}
              </div>
              <div>En préparation</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-yellow-600 dark:text-yellow-400">
                {fiches.filter(f => f.statut === 'en_cours').length}
              </div>
              <div>En cours</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-green-600 dark:text-green-400">
                {fiches.filter(f => f.statut === 'terminee').length}
              </div>
              <div>Terminées</div>
            </div>
          </div>
          
          {/* Bouton Export */}
          {canExport() && (
            <button
              onClick={() => exportFiches()}
              className="btn-secondary flex items-center gap-2"
              title="Exporter les fiches en PDF"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export PDF
            </button>
          )}
          
          {/* Bouton Nouvelle Fiche */}
          {canCreate() && (
            <button
              onClick={() => openModal()}
              className="btn-primary flex items-center gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              Nouvelle Fiche
            </button>
          )}
        </div>
      </div>

      {/* Filtres */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FunnelIcon className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Filtres
              </h3>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {fiches.length} fiche(s) trouvée(s)
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Statut
              </label>
              <select
                className="form-select w-full"
                value={filters.statut}
                onChange={e => setFilters(prev => ({ ...prev, statut: e.target.value }))}
              >
                <option value="">Tous les statuts</option>
                <option value="en_preparation">En préparation</option>
                <option value="en_cours">En cours</option>
                <option value="terminee">Terminée</option>
                <option value="annulee">Annulée</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Priorité
              </label>
              <select
                className="form-select w-full"
                value={filters.priorite}
                onChange={e => setFilters(prev => ({ ...prev, priorite: e.target.value }))}
              >
                <option value="">Toutes les priorités</option>
                <option value="urgente">Urgente</option>
                <option value="haute">Haute</option>
                <option value="normale">Normale</option>
                <option value="basse">Basse</option>
              </select>
            </div>
            
            {/* Filtre par responsable (seulement si l'utilisateur peut voir tout) */}
            {canViewAll() && (
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Responsable
                </label>
                <select
                  className="form-select w-full"
                  value={filters.responsable_id}
                  onChange={e => setFilters(prev => ({ ...prev, responsable_id: e.target.value }))}
                >
                  <option value="">Tous les responsables</option>
                  {userOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Recherche
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  className="form-input w-full pl-10"
                  placeholder="Titre, numéro, description..."
                  value={filters.search}
                  onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ statut: '', priorite: '', responsable_id: '', search: '' })}
                className="btn-secondary w-full"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tableau des fiches */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Fiches d'Exécution ({fiches.length})
          </h3>
        </div>
        <div className="card-body">
          {fiches.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 dark:text-gray-500">
                <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-lg font-medium">Aucune fiche d'exécution</p>
                <p className="text-sm">Commencez par créer votre première fiche d'exécution</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Numéro
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tâche
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Titre
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Responsable
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priorité
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Éléments
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {fiches.map(fiche => (
                    <tr key={fiche.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-4 py-4 text-sm font-mono text-gray-900 dark:text-white">
                        {fiche.numero}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {fiche.tache?.titre || 'N/A'}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        {fiche.titre}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {fiche.responsable?.prenom} {fiche.responsable?.nom}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(fiche.statut)}`}>
                          {getStatusLabel(fiche.statut)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(fiche.priorite)}`}>
                          {getPriorityLabel(fiche.priorite)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          {fiche.elements?.length || 0} élément(s)
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-right">
                        <div className="flex gap-2 justify-end">
                          {/* Voir les détails */}
                          <button
                            onClick={() => setViewFiche(fiche)}
                            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-2 py-1 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                            title="Voir les détails"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          
                          {/* Modifier */}
                          {canEdit(fiche) && (
                            <button
                              onClick={() => openModal(fiche)}
                              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-2 py-1 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                              title="Modifier"
                            >
                              <PencilSquareIcon className="h-4 w-4" />
                            </button>
                          )}
                          
                          {/* Supprimer */}
                          {canDelete(fiche) && (
                            <button
                              onClick={() => deleteFiche(fiche.id)}
                              className="inline-flex items-center justify-center rounded-md border border-red-300 bg-red-50 px-2 py-1 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
                              title="Supprimer"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          )}
                          
                          {/* Actions de statut */}
                          {fiche.statut === 'en_preparation' && canChangeStatus(fiche) && (
                            <button
                              onClick={() => changeStatus(fiche.id, 'en_cours')}
                              className="inline-flex items-center justify-center rounded-md border border-green-300 bg-green-50 px-2 py-1 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                              title="Démarrer l'exécution"
                            >
                              <PlayIcon className="h-4 w-4" />
                            </button>
                          )}
                          
                          {fiche.statut === 'en_cours' && canChangeStatus(fiche) && (
                            <button
                              onClick={() => changeStatus(fiche.id, 'terminee')}
                              className="inline-flex items-center justify-center rounded-md border border-green-300 bg-green-50 px-2 py-1 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                              title="Terminer l'exécution"
                            >
                              <CheckIcon className="h-4 w-4" />
                            </button>
                          )}
                          
                          {/* Annuler une fiche (seulement en préparation ou en cours) */}
                          {(fiche.statut === 'en_preparation' || fiche.statut === 'en_cours') && canChangeStatus(fiche) && (
                            <button
                              onClick={() => changeStatus(fiche.id, 'annulee')}
                              className="inline-flex items-center justify-center rounded-md border border-red-300 bg-red-50 px-2 py-1 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
                              title="Annuler l'exécution"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          )}
                          
                          {/* Reprendre une fiche annulée */}
                          {fiche.statut === 'annulee' && canChangeStatus(fiche) && (
                            <button
                              onClick={() => changeStatus(fiche.id, 'en_preparation')}
                              className="inline-flex items-center justify-center rounded-md border border-blue-300 bg-blue-50 px-2 py-1 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                              title="Reprendre l'exécution"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
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

      {/* Modal de création/édition - À implémenter */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-6xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedFiche ? 'Modifier la fiche d\'exécution' : 'Nouvelle fiche d\'exécution'}
              </h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations de base */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Tâche *
                  </label>
                  <select
                    className="form-select w-full"
                    value={form.tache_id}
                    onChange={e => {
                      const selectedTaskId = parseInt(e.target.value);
                      console.log('🔍 Debug sélection tâche:');
                      console.log('selectedTaskId:', selectedTaskId, 'type:', typeof selectedTaskId);
                      
                      // Trouver la tâche directement dans le tableau tasks
                      const selectedTask = tasks.find(t => t.id === selectedTaskId);
                      console.log('Tâche trouvée:', selectedTask);
                      
                      if (selectedTask) {
                        console.log('Tâche trouvée:', selectedTask);
                        console.log('createur_id:', selectedTask.createur_id, 'type:', typeof selectedTask.createur_id);
                        console.log('assigne_id:', selectedTask.assigne_id, 'type:', typeof selectedTask.assigne_id);
                        
                        const responsable_id = selectedTask.createur_id || selectedTask.assigne_id || '';
                        console.log('Responsable ID calculé:', responsable_id, 'type:', typeof responsable_id);
                        
                        setForm(prev => ({
                          ...prev,
                          tache_id: selectedTaskId,
                          titre: selectedTask.titre || '',
                          priorite: selectedTask.priorite ? selectedTask.priorite.toLowerCase() : 'normale',
                          responsable_id: responsable_id, // createur_id = superviseur de département
                          superviseur_id: '', // Pas de superviseur dans la table des tâches
                          duree_prevue: selectedTask.duree_estimee || '',
                          date_debut_prevue: selectedTask.date_debut ? selectedTask.date_debut.split('T')[0] : '',
                          date_fin_prevue: selectedTask.date_fin ? selectedTask.date_fin.split('T')[0] : '',
                          description: selectedTask.description || ''
                        }));
                        
                        console.log('Form mis à jour avec responsable_id:', responsable_id);
                      } else {
                        setForm(prev => ({
                          ...prev,
                          tache_id: selectedTaskId,
                          titre: '',
                          priorite: 'normale',
                          responsable_id: '',
                          superviseur_id: '',
                          duree_prevue: '',
                          date_debut_prevue: '',
                          date_fin_prevue: '',
                          description: ''
                        }));
                      }
                    }}
                    required
                  >
                    <option value="">Sélectionner une tâche</option>
                    {taskOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    💡 La sélection d'une tâche remplit automatiquement le titre, la priorité, les dates, la durée et le responsable (superviseur de département)
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Titre *
                  </label>
                  <input
                    type="text"
                    className="form-input w-full"
                    value={form.titre}
                    onChange={e => setForm(prev => ({ ...prev, titre: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Priorité
                  </label>
                  <select
                    className="form-select w-full"
                    value={form.priorite}
                    onChange={e => setForm(prev => ({ ...prev, priorite: e.target.value }))}
                  >
                    <option value="basse">Basse</option>
                    <option value="normale">Normale</option>
                    <option value="haute">Haute</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Responsable *
                  </label>
                  <select
                    className="form-select w-full"
                    value={form.responsable_id}
                    onChange={e => setForm(prev => ({ ...prev, responsable_id: e.target.value }))}
                    required
                  >
                    <option value="">Sélectionner un responsable</option>
                    {userOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Date début prévue
                  </label>
                  <input
                    type="date"
                    className="form-input w-full"
                    value={form.date_debut_prevue}
                    onChange={e => setForm(prev => ({ ...prev, date_debut_prevue: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Date fin prévue
                  </label>
                  <input
                    type="date"
                    className="form-input w-full"
                    value={form.date_fin_prevue}
                    onChange={e => setForm(prev => ({ ...prev, date_fin_prevue: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Durée prévue (minutes)
                  </label>
                  <input
                    type="number"
                    className="form-input w-full"
                    value={form.duree_prevue}
                    onChange={e => setForm(prev => ({ ...prev, duree_prevue: e.target.value }))}
                    placeholder="120"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Superviseur
                  </label>
                  <select
                    className="form-select w-full"
                    value={form.superviseur_id}
                    onChange={e => setForm(prev => ({ ...prev, superviseur_id: e.target.value }))}
                  >
                    <option value="">Sélectionner un superviseur</option>
                    {userOptions.filter(u => u.value !== form.responsable_id).map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  className="form-input w-full"
                  rows={3}
                  value={form.description}
                  onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description détaillée de l'exécution"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Commentaire
                </label>
                <textarea
                  className="form-input w-full"
                  rows={2}
                  value={form.commentaire}
                  onChange={e => setForm(prev => ({ ...prev, commentaire: e.target.value }))}
                  placeholder="Commentaires additionnels"
                />
              </div>

              {/* Éléments d'intervention */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                    Éléments d'intervention
                  </h4>
                  <button
                    type="button"
                    onClick={addElement}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Ajouter un élément
                  </button>
                </div>
                
                {form.elements.map((element, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-gray-900 dark:text-white">Élément #{index + 1}</h5>
                      <button
                        type="button"
                        onClick={() => removeElement(index)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                          Type *
                        </label>
                        <select
                          className="form-select w-full"
                          value={element.type}
                          onChange={e => updateElement(index, 'type', e.target.value)}
                          required
                        >
                          <option value="materiel">Matériel</option>
                          <option value="outil">Outil</option>
                          <option value="piece">Pièce</option>
                          <option value="document">Document</option>
                          <option value="formation">Formation</option>
                          <option value="autre">Autre</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                          Nom *
                        </label>
                        <input
                          type="text"
                          className="form-input w-full"
                          value={element.nom}
                          onChange={e => updateElement(index, 'nom', e.target.value)}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                          Quantité
                        </label>
                        <input
                          type="number"
                          className="form-input w-full"
                          value={element.quantite}
                          onChange={e => updateElement(index, 'quantite', parseInt(e.target.value) || 1)}
                          min="1"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                          Unité
                        </label>
                        <input
                          type="text"
                          className="form-input w-full"
                          value={element.unite}
                          onChange={e => updateElement(index, 'unite', e.target.value)}
                          placeholder="pièces, mètres, etc."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                          Disponible
                        </label>
                        <select
                          className="form-select w-full"
                          value={element.disponible.toString()}
                          onChange={e => updateElement(index, 'disponible', e.target.value === 'true')}
                        >
                          <option value="false">Non</option>
                          <option value="true">Oui</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                          Coût estimé
                        </label>
                        <input
                          type="number"
                          className="form-input w-full"
                          value={element.cout_estime}
                          onChange={e => updateElement(index, 'cout_estime', parseFloat(e.target.value) || 0)}
                          step="0.01"
                          min="0"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                          Description
                        </label>
                        <textarea
                          className="form-input w-full"
                          rows={2}
                          value={element.description}
                          onChange={e => updateElement(index, 'description', e.target.value)}
                          placeholder="Description détaillée de l'élément"
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                            Fournisseur
                          </label>
                          <input
                            type="text"
                            className="form-input w-full"
                            value={element.fournisseur}
                            onChange={e => updateElement(index, 'fournisseur', e.target.value)}
                            placeholder="Nom du fournisseur"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                            Référence
                          </label>
                          <input
                            type="text"
                            className="form-input w-full"
                            value={element.reference}
                            onChange={e => updateElement(index, 'reference', e.target.value)}
                            placeholder="Référence fournisseur"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-secondary"
                >
                  Annuler
                </button>
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? 'Sauvegarde...' : (selectedFiche ? 'Mettre à jour' : 'Créer')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de visualisation - À implémenter */}
      {viewFiche && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-6xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Détails fiche d'exécution #{viewFiche.numero}
              </h3>
              <button onClick={() => setViewFiche(null)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Informations de base */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Tâche:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{viewFiche.tache?.titre}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Statut:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(viewFiche.statut)}`}>
                    {getStatusLabel(viewFiche.statut)}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Priorité:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(viewFiche.priorite)}`}>
                    {getPriorityLabel(viewFiche.priorite)}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Responsable:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">
                    {viewFiche.responsable?.prenom} {viewFiche.responsable?.nom}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Superviseur:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">
                    {viewFiche.superviseur ? `${viewFiche.superviseur.prenom} ${viewFiche.superviseur.nom}` : 'Non assigné'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Durée prévue:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">
                    {viewFiche.duree_prevue ? `${viewFiche.duree_prevue} min` : 'Non définie'}
                  </span>
                </div>
              </div>

              {viewFiche.description && (
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Description:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{viewFiche.description}</span>
                </div>
              )}

              {viewFiche.commentaire && (
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Commentaire:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{viewFiche.commentaire}</span>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Début prévu:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">
                    {viewFiche.date_debut_prevue ? new Date(viewFiche.date_debut_prevue).toLocaleDateString('fr-FR') : 'Non définie'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Fin prévue:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">
                    {viewFiche.date_fin_prevue ? new Date(viewFiche.date_fin_prevue).toLocaleDateString('fr-FR') : 'Non définie'}
                  </span>
                </div>
                {viewFiche.date_debut_reelle && (
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Début réel:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">
                      {new Date(viewFiche.date_debut_reelle).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}
                {viewFiche.date_fin_reelle && (
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Fin réelle:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">
                      {new Date(viewFiche.date_fin_reelle).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}
              </div>

              {/* Éléments d'intervention */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Éléments d'intervention ({viewFiche.elements?.length || 0})
                </h4>
                {viewFiche.elements && viewFiche.elements.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantité</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Disponible</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Coût</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {viewFiche.elements.map((element, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-sm">
                              <span className="capitalize text-gray-900 dark:text-white">{element.type}</span>
                            </td>
                            <td className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white">{element.nom}</td>
                            <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                              {element.quantite} {element.unite}
                            </td>
                            <td className="px-4 py-2 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                element.disponible ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                              }`}>
                                {element.disponible ? 'Oui' : 'Non'}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-sm">
                              <span className="capitalize text-gray-600 dark:text-gray-400">{element.statut}</span>
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                              {element.cout_estime ? `${element.cout_estime} ${element.devise}` : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">Aucun élément d'intervention</p>
                )}
              </div>

              {/* Actions */}
              {canEdit(viewFiche) && (
                <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      setViewFiche(null);
                      openModal(viewFiche);
                    }}
                    className="btn-secondary"
                  >
                    <PencilSquareIcon className="h-5 w-5 inline mr-2" />
                    Modifier
                  </button>
                  
                  {viewFiche.statut === 'en_preparation' && (
                    <button
                      onClick={() => changeStatus(viewFiche.id, 'en_cours')}
                      className="btn-success"
                    >
                      <PlayIcon className="h-5 w-5 inline mr-2" />
                      Démarrer
                    </button>
                  )}
                  
                  {viewFiche.statut === 'en_cours' && (
                    <button
                      onClick={() => changeStatus(viewFiche.id, 'terminee')}
                      className="btn-success"
                    >
                      <CheckIcon className="h-5 w-5 inline mr-2" />
                      Terminer
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FichesExecution;
