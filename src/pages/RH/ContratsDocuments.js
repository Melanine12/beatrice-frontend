import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  DocumentIcon,
  CloudArrowUpIcon,
  EyeIcon,
  CalendarIcon,
  UserIcon,
  BuildingOfficeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const ContratsDocuments = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('contrats');
  const [contrats, setContrats] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [employes, setEmployes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create');
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // États pour les formulaires
  const [contratForm, setContratForm] = useState({
    employe_id: '',
    type_contrat: 'CDI',
    numero_contrat: '',
    date_debut: '',
    date_fin: '',
    salaire_brut: '',
    salaire_net: '',
    duree_hebdomadaire: '',
    statut: 'Actif',
    description: '',
    conditions_particulieres: '',
    date_signature: ''
  });

  const [documentForm, setDocumentForm] = useState({
    employe_id: '',
    contrat_id: '',
    type_document: 'Contrat',
    description: '',
    date_emission: '',
    date_expiration: '',
    confidentialite: 'Interne'
  });

  // Vérifier les permissions
  const hasPermission = (role) => {
    const allowedRoles = ['Superviseur RH', 'Administrateur', 'Patron'];
    return allowedRoles.includes(user?.role);
  };

  // Charger les données initiales
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🔄 Chargement des données pour l\'onglet:', activeTab);
        console.log('👤 Utilisateur actuel:', user);
        
        await fetchEmployes();
        if (activeTab === 'contrats') {
          await fetchContrats();
        } else {
          await fetchDocuments();
        }
        
        console.log('✅ Données chargées avec succès');
      } catch (error) {
        console.error('❌ Erreur lors du chargement des données:', error);
        console.error('Stack trace:', error.stack);
        toast.error('Erreur lors du chargement des données');
      }
    };

    loadData();
  }, [activeTab]);

  // Si l'utilisateur n'a pas les permissions, afficher un message
  if (!hasPermission(user?.role)) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Contrats & Documents RH
          </h1>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Accès refusé
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  <p>Vous n'avez pas les permissions nécessaires pour accéder à cette section.</p>
                  <p className="mt-1">Contactez votre administrateur pour obtenir l'accès.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const fetchEmployes = async () => {
    try {
      console.log('👥 Chargement des employés...');
      const response = await api.get('/users');
      console.log('✅ Employés chargés:', response.data.data?.length || 0);
      setEmployes(response.data.data || []);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des employés:', error);
      if (error.response?.status === 401) {
        toast.error('Session expirée. Veuillez vous reconnecter.');
        return;
      }
      toast.error('Erreur lors du chargement des employés');
    }
  };

  const fetchContrats = async () => {
    setLoading(true);
    try {
      console.log('📋 Chargement des contrats...');
      const response = await api.get('/contrats');
      console.log('✅ Contrats chargés:', response.data.data?.length || 0);
      setContrats(response.data.data || []);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des contrats:', error);
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      if (error.response?.status === 401) {
        toast.error('Session expirée. Veuillez vous reconnecter.');
        return;
      }
      if (error.response?.status === 403) {
        toast.error('Accès refusé. Vous n\'avez pas les permissions nécessaires.');
        return;
      }
      toast.error('Erreur lors du chargement des contrats');
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      console.log('📄 Chargement des documents...');
      const response = await api.get('/documents-rh');
      console.log('✅ Documents chargés:', response.data.data?.length || 0);
      setDocuments(response.data.data || []);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des documents:', error);
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      if (error.response?.status === 401) {
        toast.error('Session expirée. Veuillez vous reconnecter.');
        return;
      }
      if (error.response?.status === 403) {
        toast.error('Accès refusé. Vous n\'avez pas les permissions nécessaires.');
        return;
      }
      toast.error('Erreur lors du chargement des documents');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContrat = async (e) => {
    e.preventDefault();
    try {
      await api.post('/contrats', contratForm);
      toast.success('Contrat créé avec succès');
      setShowModal(false);
      resetContratForm();
      fetchContrats();
    } catch (error) {
      console.error('Erreur lors de la création du contrat:', error);
      toast.error('Erreur lors de la création du contrat');
    }
  };

  const handleCreateDocument = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      toast.error('Veuillez sélectionner un fichier');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('fichier', selectedFiles[0]);
      Object.keys(documentForm).forEach(key => {
        if (documentForm[key]) {
          formData.append(key, documentForm[key]);
        }
      });

      await api.post('/documents-rh', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Document créé avec succès');
      setShowModal(false);
      resetDocumentForm();
      setSelectedFiles([]);
      fetchDocuments();
    } catch (error) {
      console.error('Erreur lors de la création du document:', error);
      toast.error('Erreur lors de la création du document');
    }
  };

  const handleDeleteContrat = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce contrat ?')) {
      try {
        await api.delete(`/contrats/${id}`);
        toast.success('Contrat supprimé avec succès');
        fetchContrats();
      } catch (error) {
        console.error('Erreur lors de la suppression du contrat:', error);
        toast.error('Erreur lors de la suppression du contrat');
      }
    }
  };

  const handleDeleteDocument = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      try {
        await api.delete(`/documents-rh/${id}`);
        toast.success('Document supprimé avec succès');
        fetchDocuments();
      } catch (error) {
        console.error('Erreur lors de la suppression du document:', error);
        toast.error('Erreur lors de la suppression du document');
      }
    }
  };

  const resetContratForm = () => {
    setContratForm({
      employe_id: '',
      type_contrat: 'CDI',
      numero_contrat: '',
      date_debut: '',
      date_fin: '',
      salaire_brut: '',
      salaire_net: '',
      duree_hebdomadaire: '',
      statut: 'Actif',
      description: '',
      conditions_particulieres: '',
      date_signature: ''
    });
  };

  const resetDocumentForm = () => {
    setDocumentForm({
      employe_id: '',
      contrat_id: '',
      type_document: 'Contrat',
      description: '',
      date_emission: '',
      date_expiration: '',
      confidentialite: 'Interne'
    });
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setShowModal(true);
    
    if (type === 'edit' && item) {
      if (activeTab === 'contrats') {
        setContratForm(item);
      } else {
        setDocumentForm(item);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Contrats & Documents RH
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gestion des contrats et documents des employés
        </p>
      </div>

      {/* Onglets */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('contrats')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'contrats'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Contrats
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'documents'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Documents
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Barre d'actions */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {activeTab === 'contrats' ? 'Liste des Contrats' : 'Liste des Documents'}
            </h2>
            <button
              onClick={() => openModal('create')}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              {activeTab === 'contrats' ? 'Nouveau Contrat' : 'Nouveau Document'}
            </button>
          </div>

          {/* Contenu des onglets */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {activeTab === 'contrats' ? (
                <ContratsTable 
                  contrats={contrats}
                  onEdit={(contrat) => openModal('edit', contrat)}
                  onDelete={handleDeleteContrat}
                  formatDate={formatDate}
                  formatCurrency={formatCurrency}
                />
              ) : (
                <DocumentsTable 
                  documents={documents}
                  onEdit={(document) => openModal('edit', document)}
                  onDelete={handleDeleteDocument}
                  formatDate={formatDate}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <Modal
          type={modalType}
          itemType={activeTab}
          item={selectedItem}
          formData={activeTab === 'contrats' ? contratForm : documentForm}
          setFormData={activeTab === 'contrats' ? setContratForm : setDocumentForm}
          employes={employes}
          contrats={contrats}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          onSubmit={activeTab === 'contrats' ? handleCreateContrat : handleCreateDocument}
          onClose={() => {
            setShowModal(false);
            setSelectedItem(null);
            if (activeTab === 'contrats') {
              resetContratForm();
            } else {
              resetDocumentForm();
              setSelectedFiles([]);
            }
          }}
        />
      )}
    </div>
  );
};

// Composant Table des Contrats
const ContratsTable = ({ contrats, onEdit, onDelete, formatDate, formatCurrency }) => (
  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
    <thead className="bg-gray-50 dark:bg-gray-700">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
          Employé
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
          Type
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
          N° Contrat
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
          Période
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
          Salaire
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
          Statut
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>
    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
      {contrats.map((contrat) => (
        <tr key={contrat.id}>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <UserIcon className="w-8 h-8 text-gray-400 mr-3" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {contrat.employe?.prenoms} {contrat.employe?.nom_famille}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {contrat.employe?.poste}
                </div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {contrat.type_contrat}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
            {contrat.numero_contrat}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-1" />
              {formatDate(contrat.date_debut)} - {formatDate(contrat.date_fin) || 'Indéterminé'}
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
            {formatCurrency(contrat.salaire_brut)}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              contrat.statut === 'Actif' ? 'bg-green-100 text-green-800' :
              contrat.statut === 'Expiré' ? 'bg-red-100 text-red-800' :
              contrat.statut === 'Résilié' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {contrat.statut}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(contrat)}
                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(contrat.id)}
                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

// Composant Table des Documents
const DocumentsTable = ({ documents, onEdit, onDelete, formatDate }) => (
  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
    <thead className="bg-gray-50 dark:bg-gray-700">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
          Employé
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
          Type
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
          Fichier
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
          Date
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
          Confidentialité
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>
    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
      {documents.map((document) => (
        <tr key={document.id}>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <UserIcon className="w-8 h-8 text-gray-400 mr-3" />
                        <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {document.employe?.prenoms} {document.employe?.nom_famille}
                        </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {document.employe?.poste}
                        </div>
                      </div>
                    </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              {document.type_document.replace('_', ' ')}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <DocumentIcon className="w-5 h-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-900 dark:text-white">
                {document.nom_fichier_original}
              </span>
                    </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-1" />
              {formatDate(document.date_creation)}
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              document.confidentialite === 'Public' ? 'bg-green-100 text-green-800' :
              document.confidentialite === 'Interne' ? 'bg-blue-100 text-blue-800' :
              document.confidentialite === 'Confidentiel' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {document.confidentialite}
                        </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
              <button
                onClick={() => window.open(document.url_cloudinary, '_blank')}
                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                title="Voir le document"
              >
                <EyeIcon className="w-4 h-4" />
                          </button>
              <button
                onClick={() => onEdit(document)}
                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(document.id)}
                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

// Composant Modal
const Modal = ({ 
  type, 
  itemType, 
  item, 
  formData, 
  setFormData, 
  employes, 
  contrats, 
  selectedFiles, 
  setSelectedFiles, 
  onSubmit, 
  onClose 
}) => {
  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {type === 'create' ? 'Créer' : 'Modifier'} {itemType === 'contrats' ? 'un Contrat' : 'un Document'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {itemType === 'contrats' ? (
            <ContratForm 
              formData={formData}
              setFormData={setFormData}
              employes={employes}
            />
          ) : (
            <DocumentForm 
              formData={formData}
              setFormData={setFormData}
              employes={employes}
              contrats={contrats}
              selectedFiles={selectedFiles}
              onFileChange={handleFileChange}
            />
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              {type === 'create' ? 'Créer' : 'Modifier'}
            </button>
          </div>
        </form>
        </div>
    </div>
  );
};

// Composant Formulaire Contrat
const ContratForm = ({ formData, setFormData, employes }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Employé *
      </label>
      <select
        value={formData.employe_id}
        onChange={(e) => setFormData({...formData, employe_id: e.target.value})}
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
        required
      >
        <option value="">Sélectionner un employé</option>
        {employes.map(employe => (
          <option key={employe.id} value={employe.id}>
            {employe.prenoms} {employe.nom_famille} - {employe.poste}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Type de contrat *
      </label>
      <select
        value={formData.type_contrat}
        onChange={(e) => setFormData({...formData, type_contrat: e.target.value})}
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
        required
      >
        <option value="CDI">CDI</option>
        <option value="CDD">CDD</option>
        <option value="Stage">Stage</option>
        <option value="Interim">Intérim</option>
        <option value="Freelance">Freelance</option>
        <option value="Consultant">Consultant</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Numéro de contrat *
      </label>
      <input
        type="text"
        value={formData.numero_contrat}
        onChange={(e) => setFormData({...formData, numero_contrat: e.target.value})}
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Date de début *
      </label>
      <input
        type="date"
        value={formData.date_debut}
        onChange={(e) => setFormData({...formData, date_debut: e.target.value})}
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Date de fin
      </label>
      <input
        type="date"
        value={formData.date_fin}
        onChange={(e) => setFormData({...formData, date_fin: e.target.value})}
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Salaire brut
      </label>
      <input
        type="number"
        value={formData.salaire_brut}
        onChange={(e) => setFormData({...formData, salaire_brut: e.target.value})}
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Salaire net
      </label>
      <input
        type="number"
        value={formData.salaire_net}
        onChange={(e) => setFormData({...formData, salaire_net: e.target.value})}
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Durée hebdomadaire (heures)
      </label>
      <input
        type="number"
        value={formData.duree_hebdomadaire}
        onChange={(e) => setFormData({...formData, duree_hebdomadaire: e.target.value})}
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Statut
      </label>
      <select
        value={formData.statut}
        onChange={(e) => setFormData({...formData, statut: e.target.value})}
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
      >
        <option value="Actif">Actif</option>
        <option value="Expiré">Expiré</option>
        <option value="Résilié">Résilié</option>
        <option value="Suspendu">Suspendu</option>
      </select>
    </div>

    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Description
      </label>
      <textarea
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
        rows={3}
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
      />
    </div>

    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Conditions particulières
      </label>
      <textarea
        value={formData.conditions_particulieres}
        onChange={(e) => setFormData({...formData, conditions_particulieres: e.target.value})}
        rows={3}
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
      />
    </div>
  </div>
);

// Composant Formulaire Document
const DocumentForm = ({ formData, setFormData, employes, contrats, selectedFiles, onFileChange }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Employé *
        </label>
        <select
          value={formData.employe_id}
          onChange={(e) => setFormData({...formData, employe_id: e.target.value})}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
          required
        >
          <option value="">Sélectionner un employé</option>
          {employes.map(employe => (
            <option key={employe.id} value={employe.id}>
              {employe.prenoms} {employe.nom_famille} - {employe.poste}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Contrat (optionnel)
        </label>
        <select
          value={formData.contrat_id}
          onChange={(e) => setFormData({...formData, contrat_id: e.target.value})}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="">Sélectionner un contrat</option>
          {contrats.map(contrat => (
            <option key={contrat.id} value={contrat.id}>
              {contrat.numero_contrat} - {contrat.employe?.prenoms} {contrat.employe?.nom_famille}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Type de document *
        </label>
        <select
          value={formData.type_document}
          onChange={(e) => setFormData({...formData, type_document: e.target.value})}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
          required
        >
          <option value="Contrat">Contrat</option>
          <option value="Avenant">Avenant</option>
          <option value="Attestation_travail">Attestation de travail</option>
          <option value="Bulletin_salaire">Bulletin de salaire</option>
          <option value="Certificat_medical">Certificat médical</option>
          <option value="Justificatif_absence">Justificatif d'absence</option>
          <option value="Demande_conge">Demande de congé</option>
          <option value="Evaluation_performance">Évaluation de performance</option>
          <option value="Formation">Formation</option>
          <option value="Autre">Autre</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Confidentialité
        </label>
        <select
          value={formData.confidentialite}
          onChange={(e) => setFormData({...formData, confidentialite: e.target.value})}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="Public">Public</option>
          <option value="Interne">Interne</option>
          <option value="Confidentiel">Confidentiel</option>
          <option value="Secret">Secret</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Date d'émission
        </label>
        <input
          type="date"
          value={formData.date_emission}
          onChange={(e) => setFormData({...formData, date_emission: e.target.value})}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Date d'expiration
        </label>
        <input
          type="date"
          value={formData.date_expiration}
          onChange={(e) => setFormData({...formData, date_expiration: e.target.value})}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
        />
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Description
      </label>
      <textarea
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
        rows={3}
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Fichier *
      </label>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500">
        <div className="space-y-1 text-center">
          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="flex text-sm text-gray-600 dark:text-gray-400">
            <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
              <span>Télécharger un fichier</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                onChange={onFileChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
              />
            </label>
            <p className="pl-1">ou glisser-déposer</p>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            PDF, DOC, DOCX, XLS, XLSX, JPG, JPEG, PNG jusqu'à 10MB
          </p>
        </div>
      </div>
      {selectedFiles.length > 0 && (
        <div className="mt-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Fichier sélectionné: {selectedFiles[0].name}
          </p>
        </div>
      )}
    </div>
  </div>
);

export default ContratsDocuments;