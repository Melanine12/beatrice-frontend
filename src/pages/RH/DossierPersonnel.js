import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { PlusIcon, XMarkIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { employeeAPI, departementAPI, sousDepartementAPI } from '../../services/api';

const DossierPersonnel = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showNewEmployeeModal, setShowNewEmployeeModal] = useState(false);
  const [showEditEmployeeModal, setShowEditEmployeeModal] = useState(false);
  const [departements, setDepartements] = useState([]);
  const [sousDepartements, setSousDepartements] = useState([]);
  const [loadingDepartements, setLoadingDepartements] = useState(false);
  const [loadingSousDepartements, setLoadingSousDepartements] = useState(false);
  const [loadingCreateEmployee, setLoadingCreateEmployee] = useState(false);
  const [loadingUpdateEmployee, setLoadingUpdateEmployee] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    departement: '',
    statut: ''
  });
  const [newEmployee, setNewEmployee] = useState({
    // Informations Personnelles (État Civil)
    civilite: '',
    nomFamille: '',
    nomUsage: '',
    prenoms: '',
    dateNaissance: '',
    lieuNaissance: '',
    nationalite: '',
    numeroSecuriteSociale: '',
    situationFamille: '',
    
    // Coordonnées et Contact
    adresse: '',
    codePostal: '',
    ville: '',
    pays: '',
    telephonePersonnel: '',
    telephoneDomicile: '',
    emailPersonnel: '',
    contactUrgenceNom: '',
    contactUrgencePrenom: '',
    contactUrgenceLien: '',
    contactUrgenceTelephone: '',
    
    // Informations Professionnelles
    matricule: '',
    poste: '',
    departement_id: '',
    sous_departement_id: '',
    dateEmbauche: '',
    typeContrat: '',
    dateFinContrat: '',
    tempsTravail: '',
    statut: 'Actif',
    niveauClassification: '',
    photo: null
  });

  useEffect(() => {
    loadEmployees();
    loadDepartements();
  }, [filters]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getAll(filters);
      if (response.data.success) {
        setEmployees(response.data.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des employés:', error);
    } finally {
      setLoading(false);
    }
  };

  // Charger les départements
  const loadDepartements = async () => {
    try {
      setLoadingDepartements(true);
      const response = await departementAPI.getAll({ statut: 'Actif' });
      setDepartements(response.data.departements || []);
    } catch (error) {
      console.error('Erreur lors du chargement des départements:', error);
    } finally {
      setLoadingDepartements(false);
    }
  };

  // Charger les sous-départements par département
  const loadSousDepartements = async (departementId) => {
    if (!departementId) {
      setSousDepartements([]);
      return;
    }
    
    try {
      setLoadingSousDepartements(true);
      const response = await sousDepartementAPI.getByDepartement(departementId);
      setSousDepartements(response.data.sousDepartements || []);
    } catch (error) {
      console.error('Erreur lors du chargement des sous-départements:', error);
    } finally {
      setLoadingSousDepartements(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'file') {
      setNewEmployee(prev => ({
        ...prev,
        [name]: e.target.files[0]
      }));
    } else if (name === 'departement_id') {
      // Quand le département change, charger les sous-départements et réinitialiser le sous-département
      setNewEmployee(prev => ({
        ...prev,
        [name]: value,
        sous_departement_id: ''
      }));
      loadSousDepartements(value);
    } else {
      setNewEmployee(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Empêcher les clics multiples
    if (loadingCreateEmployee) return;
    
    setLoadingCreateEmployee(true);
    
    try {
      // Créer FormData pour l'upload de fichier
      const formData = new FormData();
      
      // Mapper les champs du frontend vers les noms attendus par le backend
      const fieldMapping = {
        // Informations Personnelles
        civilite: 'civilite',
        nomFamille: 'nom_famille',
        nomUsage: 'nom_usage',
        prenoms: 'prenoms',
        dateNaissance: 'date_naissance',
        lieuNaissance: 'lieu_naissance',
        nationalite: 'nationalite',
        numeroSecuriteSociale: 'numero_securite_sociale',
        situationFamille: 'situation_famille',
        
        // Coordonnées et Contact
        adresse: 'adresse',
        codePostal: 'code_postal',
        ville: 'ville',
        pays: 'pays',
        telephonePersonnel: 'telephone_personnel',
        telephoneDomicile: 'telephone_domicile',
        emailPersonnel: 'email_personnel',
        contactUrgenceNom: 'contact_urgence_nom',
        contactUrgencePrenom: 'contact_urgence_prenom',
        contactUrgenceLien: 'contact_urgence_lien',
        contactUrgenceTelephone: 'contact_urgence_telephone',
        
        // Informations Professionnelles
        matricule: 'matricule',
        poste: 'poste',
        departement_id: 'departement_id',
        sous_departement_id: 'sous_departement_id',
        dateEmbauche: 'date_embauche',
        typeContrat: 'type_contrat',
        dateFinContrat: 'date_fin_contrat',
        tempsTravail: 'temps_travail',
        statut: 'statut',
        niveauClassification: 'niveau_classification',
        photo: 'photo'
      };
      
      // Ajouter les champs mappés au FormData
      Object.keys(fieldMapping).forEach(frontendKey => {
        const backendKey = fieldMapping[frontendKey];
        const value = newEmployee[frontendKey];
        
        if (value !== null && value !== '' && value !== undefined) {
          formData.append(backendKey, value);
        }
      });

      console.log('Données envoyées:', Object.fromEntries(formData.entries()));

      const response = await employeeAPI.create(formData);
      if (response.data.success) {
        await loadEmployees(); // Recharger la liste
        resetForm();
        alert('Employé créé avec succès');
      }
    } catch (error) {
      console.error('Erreur lors de la création de l\'employé:', error);
      console.error('Détails de l\'erreur:', error.response?.data);
      alert('Erreur lors de la création de l\'employé: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoadingCreateEmployee(false);
    }
  };

  const resetForm = () => {
    setNewEmployee({
      // Informations Personnelles (État Civil)
      civilite: '',
      nomFamille: '',
      nomUsage: '',
      prenoms: '',
      dateNaissance: '',
      lieuNaissance: '',
      nationalite: '',
      numeroSecuriteSociale: '',
      situationFamille: '',
      
      // Coordonnées et Contact
      adresse: '',
      codePostal: '',
      ville: '',
      pays: '',
      telephonePersonnel: '',
      telephoneDomicile: '',
      emailPersonnel: '',
      contactUrgenceNom: '',
      contactUrgencePrenom: '',
      contactUrgenceLien: '',
      contactUrgenceTelephone: '',
      
      // Informations Professionnelles
      matricule: '',
      poste: '',
      departement_id: '',
      sous_departement_id: '',
      dateEmbauche: '',
      typeContrat: '',
      dateFinContrat: '',
      tempsTravail: '',
      statut: 'Actif',
      niveauClassification: '',
      photo: null
    });
    setShowNewEmployeeModal(false);
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setShowEditEmployeeModal(true);
    // Charger les sous-départements si un département est sélectionné
    if (employee.departement_id) {
      loadSousDepartements(employee.departement_id);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    // Empêcher les clics multiples
    if (loadingUpdateEmployee) return;
    
    setLoadingUpdateEmployee(true);
    
    try {
      // Créer FormData pour l'upload de fichier
      const formData = new FormData();
      
      // Mapper les champs du frontend vers les noms attendus par le backend
      const fieldMapping = {
        // Informations Personnelles
        civilite: 'civilite',
        nomFamille: 'nom_famille',
        nomUsage: 'nom_usage',
        prenoms: 'prenoms',
        dateNaissance: 'date_naissance',
        lieuNaissance: 'lieu_naissance',
        nationalite: 'nationalite',
        numeroSecuriteSociale: 'numero_securite_sociale',
        situationFamille: 'situation_famille',
        
        // Coordonnées et Contact
        adresse: 'adresse',
        codePostal: 'code_postal',
        ville: 'ville',
        pays: 'pays',
        telephonePersonnel: 'telephone_personnel',
        telephoneDomicile: 'telephone_domicile',
        emailPersonnel: 'email_personnel',
        contactUrgenceNom: 'contact_urgence_nom',
        contactUrgencePrenom: 'contact_urgence_prenom',
        contactUrgenceLien: 'contact_urgence_lien',
        contactUrgenceTelephone: 'contact_urgence_telephone',
        
        // Informations Professionnelles
        matricule: 'matricule',
        poste: 'poste',
        departement_id: 'departement_id',
        sous_departement_id: 'sous_departement_id',
        dateEmbauche: 'date_embauche',
        typeContrat: 'type_contrat',
        dateFinContrat: 'date_fin_contrat',
        tempsTravail: 'temps_travail',
        statut: 'statut',
        niveauClassification: 'niveau_classification',
        photo: 'photo'
      };
      
      // Ajouter les champs mappés au FormData
      Object.keys(fieldMapping).forEach(frontendKey => {
        const backendKey = fieldMapping[frontendKey];
        const value = editingEmployee[frontendKey];
        
        if (value !== null && value !== '' && value !== undefined) {
          formData.append(backendKey, value);
        }
      });

      console.log('Données de mise à jour envoyées:', Object.fromEntries(formData.entries()));

      const response = await employeeAPI.update(editingEmployee.id, formData);
      if (response.data.success) {
        await loadEmployees();
        setShowEditEmployeeModal(false);
        setEditingEmployee(null);
        alert('Employé mis à jour avec succès');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'employé:', error);
      console.error('Détails de l\'erreur:', error.response?.data);
      alert('Erreur lors de la mise à jour de l\'employé: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoadingUpdateEmployee(false);
    }
  };

  const handleDelete = async (employeeId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
      try {
        const response = await employeeAPI.delete(employeeId);
        if (response.data.success) {
          await loadEmployees();
          alert('Employé supprimé avec succès');
        }
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'employé:', error);
        alert('Erreur lors de la suppression de l\'employé');
      }
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Dossier Personnel
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des employés */}
          <div className="lg:col-span-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Employés ({employees.length})
            </h2>
              <button
                onClick={() => setShowNewEmployeeModal(true)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Nouvel employé
              </button>
            </div>

            {/* Filtres */}
            <div className="mb-4 space-y-2">
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Rechercher un employé..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  name="departement"
                  value={filters.departement}
                  onChange={handleFilterChange}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Tous les départements</option>
                  <option value="Réception">Réception</option>
                  <option value="Restauration">Restauration</option>
                  <option value="Ménage">Ménage</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Sécurité">Sécurité</option>
                  <option value="Administration">Administration</option>
                  <option value="Ressources Humaines">Ressources Humaines</option>
                  <option value="Comptabilité">Comptabilité</option>
                </select>
                <select
                  name="statut"
                  value={filters.statut}
                  onChange={handleFilterChange}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Tous les statuts</option>
                  <option value="Actif">Actif</option>
                  <option value="Inactif">Inactif</option>
                  <option value="En congé">En congé</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {employees.map((employee) => (
                <div
                  key={employee.id}
                  className={`p-3 rounded-lg transition-colors ${
                    selectedEmployee?.id === employee.id
                      ? 'bg-primary-100 dark:bg-primary-900 border border-primary-300 dark:border-primary-700'
                      : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div 
                      className="flex items-center space-x-3 flex-1 cursor-pointer"
                      onClick={() => setSelectedEmployee(employee)}
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
                        {employee.photo_url ? (
                          <img 
                            src={employee.photo_url} 
                            alt={`${employee.prenoms} ${employee.nom_famille}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                            {employee.prenoms?.charAt(0) || ''}{employee.nom_famille?.charAt(0) || ''}
                    </div>
                        )}
                      </div>
                      <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                          {employee.prenoms} {employee.nom_famille}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {employee.poste}
                      </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {employee.departement_nom || '-'}
                          {employee.sous_departement_nom && ` - ${employee.sous_departement_nom}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEdit(employee)}
                        className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                        title="Modifier"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(employee.id)}
                        className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                        title="Supprimer"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Détails de l'employé sélectionné */}
          <div className="lg:col-span-2">
            {selectedEmployee ? (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center">
                      {selectedEmployee.photo_url ? (
                        <img 
                          src={selectedEmployee.photo_url} 
                          alt={`${selectedEmployee.prenoms} ${selectedEmployee.nom_famille}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary-600 flex items-center justify-center text-white font-semibold text-xl">
                          {selectedEmployee.prenoms?.charAt(0) || ''}{selectedEmployee.nom_famille?.charAt(0) || ''}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {selectedEmployee.civilite} {selectedEmployee.prenoms} {selectedEmployee.nom_famille}
                </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedEmployee.poste} - {selectedEmployee.departement_nom || '-'}
                        {selectedEmployee.sous_departement_nom && ` - ${selectedEmployee.sous_departement_nom}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(selectedEmployee)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                      Modifier
                    </button>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {/* Informations Personnelles */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                      Informations Personnelles
                    </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nom complet
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                          {selectedEmployee.prenoms} {selectedEmployee.nom_famille}
                          {selectedEmployee.nom_usage && ` (${selectedEmployee.nom_usage})`}
                    </p>
                  </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Date de naissance
                        </label>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                          {selectedEmployee.date_naissance ? new Date(selectedEmployee.date_naissance).toLocaleDateString('fr-FR') : '-'}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Lieu de naissance
                        </label>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                          {selectedEmployee.lieu_naissance || '-'}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Nationalité
                        </label>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                          {selectedEmployee.nationalite || '-'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Coordonnées */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                      Coordonnées
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Adresse
                        </label>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                          {selectedEmployee.adresse || '-'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {selectedEmployee.code_postal} {selectedEmployee.ville}, {selectedEmployee.pays}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Téléphone
                        </label>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                          {selectedEmployee.telephone_personnel || '-'}
                        </p>
                        {selectedEmployee.telephone_domicile && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Domicile: {selectedEmployee.telephone_domicile}
                          </p>
                        )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                          {selectedEmployee.email_personnel || '-'}
                    </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Informations Professionnelles */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                      Informations Professionnelles
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Poste
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                          {selectedEmployee.poste || '-'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Département
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                          {selectedEmployee.departement_nom || '-'}
                          {selectedEmployee.sous_departement_nom && ` - ${selectedEmployee.sous_departement_nom}`}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Date d'embauche
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                          {selectedEmployee.date_embauche ? new Date(selectedEmployee.date_embauche).toLocaleDateString('fr-FR') : '-'}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Type de contrat
                        </label>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                          {selectedEmployee.type_contrat || '-'}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Temps de travail
                        </label>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                          {selectedEmployee.temps_travail || '-'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Statut
                    </label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedEmployee.statut === 'Actif'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : selectedEmployee.statut === 'Inactif'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                          {selectedEmployee.statut || '-'}
                    </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  Sélectionnez un employé pour voir ses détails
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Nouvel Employé */}
      {showNewEmployeeModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-6 border w-full max-w-4xl shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Enregistrer un Nouvel Employé
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Remplissez les informations ci-dessous pour ajouter un nouvel employé à l'équipe
                  </p>
                </div>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Section 1: Informations Personnelles (État Civil) */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    1. Informations Personnelles (État Civil)
                  </h4>
                  
                  {/* Photo de l'employé */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Photo de l'employé
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                        {newEmployee.photo ? (
                          <img 
                            src={URL.createObjectURL(newEmployee.photo)} 
                            alt="Aperçu de la photo"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-gray-400 text-sm text-center">
                            Aucune photo
                          </div>
                        )}
                      </div>
                      <div>
                        <input
                          type="file"
                          name="photo"
                          accept="image/*"
                          onChange={handleInputChange}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-gray-700 dark:file:text-gray-300"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Formats acceptés: JPG, PNG, GIF (max 5MB)
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Civilité *
                      </label>
                      <select
                        name="civilite"
                        value={newEmployee.civilite}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      >
                        <option value="">Sélectionner</option>
                        <option value="M.">M.</option>
                        <option value="Mme">Mme</option>
                        <option value="Mlle">Mlle</option>
                        <option value="Dr">Dr</option>
                        <option value="Prof">Prof</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Nom de famille *
                      </label>
                      <input
                        type="text"
                        name="nomFamille"
                        value={newEmployee.nomFamille}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Nom d'usage
                      </label>
                      <input
                        type="text"
                        name="nomUsage"
                        value={newEmployee.nomUsage}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Prénoms (ordre état civil) *
                      </label>
                      <input
                        type="text"
                        name="prenoms"
                        value={newEmployee.prenoms}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Date de naissance *
                      </label>
                      <input
                        type="date"
                        name="dateNaissance"
                        value={newEmployee.dateNaissance}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Lieu de naissance *
                      </label>
                      <input
                        type="text"
                        name="lieuNaissance"
                        value={newEmployee.lieuNaissance}
                        onChange={handleInputChange}
                        required
                        placeholder="Ville, Pays"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Nationalité *
                      </label>
                      <input
                        type="text"
                        name="nationalite"
                        value={newEmployee.nationalite}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        N° Sécurité Sociale
                      </label>
                      <input
                        type="text"
                        name="numeroSecuriteSociale"
                        value={newEmployee.numeroSecuriteSociale}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Situation de famille
                      </label>
                      <select
                        name="situationFamille"
                        value={newEmployee.situationFamille}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      >
                        <option value="">Sélectionner</option>
                        <option value="Célibataire">Célibataire</option>
                        <option value="Marié(e)">Marié(e)</option>
                        <option value="Pacsé(e)">Pacsé(e)</option>
                        <option value="Divorcé(e)">Divorcé(e)</option>
                        <option value="Veuf/Veuve">Veuf/Veuve</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 2: Coordonnées et Contact */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    2. Coordonnées et Contact
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Adresse personnelle *
                      </label>
                      <input
                        type="text"
                        name="adresse"
                        value={newEmployee.adresse}
                        onChange={handleInputChange}
                        required
                        placeholder="Numéro, Rue, Complément"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Code postal *
                      </label>
                      <input
                        type="text"
                        name="codePostal"
                        value={newEmployee.codePostal}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Ville *
                      </label>
                      <input
                        type="text"
                        name="ville"
                        value={newEmployee.ville}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Pays *
                      </label>
                      <input
                        type="text"
                        name="pays"
                        value={newEmployee.pays}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Téléphone personnel *
                      </label>
                      <input
                        type="tel"
                        name="telephonePersonnel"
                        value={newEmployee.telephonePersonnel}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Téléphone domicile
                      </label>
                      <input
                        type="tel"
                        name="telephoneDomicile"
                        value={newEmployee.telephoneDomicile}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email personnel *
                      </label>
                      <input
                        type="email"
                        name="emailPersonnel"
                        value={newEmployee.emailPersonnel}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                  </div>
                  
                  {/* Contact d'urgence */}
                  <div className="mt-6">
                    <h5 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                      Personne à contacter en cas d'urgence
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Nom
                        </label>
                        <input
                          type="text"
                          name="contactUrgenceNom"
                          value={newEmployee.contactUrgenceNom}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Prénom
                        </label>
                        <input
                          type="text"
                          name="contactUrgencePrenom"
                          value={newEmployee.contactUrgencePrenom}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Lien de parenté
                        </label>
                        <select
                          name="contactUrgenceLien"
                          value={newEmployee.contactUrgenceLien}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                        >
                          <option value="">Sélectionner</option>
                          <option value="Conjoint">Conjoint</option>
                          <option value="Parent">Parent</option>
                          <option value="Enfant">Enfant</option>
                          <option value="Frère/Sœur">Frère/Sœur</option>
                          <option value="Ami(e)">Ami(e)</option>
                          <option value="Autre">Autre</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          name="contactUrgenceTelephone"
                          value={newEmployee.contactUrgenceTelephone}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3: Informations Professionnelles */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    3. Informations Professionnelles et Administratives
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Matricule/Identifiant
                      </label>
                      <input
                        type="text"
                        name="matricule"
                        value={newEmployee.matricule}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Poste occupé *
                      </label>
                      <input
                        type="text"
                        name="poste"
                        value={newEmployee.poste}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Service/Département *
                      </label>
                      <select
                        name="departement_id"
                        value={newEmployee.departement_id}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                        disabled={loadingDepartements}
                      >
                        <option value="">Sélectionner un département</option>
                        {departements.map((departement) => (
                          <option key={departement.id} value={departement.id}>
                            {departement.nom}
                          </option>
                        ))}
                      </select>
                      {loadingDepartements && (
                        <p className="mt-1 text-sm text-gray-500">Chargement des départements...</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Sous-Département
                      </label>
                      <select
                        name="sous_departement_id"
                        value={newEmployee.sous_departement_id}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                        disabled={!newEmployee.departement_id || loadingSousDepartements}
                      >
                        <option value="">Sélectionner un sous-département</option>
                        {sousDepartements.map((sousDepartement) => (
                          <option key={sousDepartement.id} value={sousDepartement.id}>
                            {sousDepartement.nom}
                          </option>
                        ))}
                      </select>
                      {loadingSousDepartements && (
                        <p className="mt-1 text-sm text-gray-500">Chargement des sous-départements...</p>
                      )}
                      {!newEmployee.departement_id && (
                        <p className="mt-1 text-sm text-gray-500">Veuillez d'abord sélectionner un département</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Date d'embauche *
                      </label>
                      <input
                        type="date"
                        name="dateEmbauche"
                        value={newEmployee.dateEmbauche}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Type de contrat *
                      </label>
                      <select
                        name="typeContrat"
                        value={newEmployee.typeContrat}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      >
                        <option value="">Sélectionner</option>
                        <option value="CDI">CDI</option>
                        <option value="CDD">CDD</option>
                        <option value="Intérim">Intérim</option>
                        <option value="Stage">Stage</option>
                        <option value="Alternance">Alternance</option>
                        <option value="Contrat de professionnalisation">Contrat de professionnalisation</option>
                        <option value="Freelance">Freelance</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Date de fin de contrat
                      </label>
                      <input
                        type="date"
                        name="dateFinContrat"
                        value={newEmployee.dateFinContrat}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Temps de travail *
                      </label>
                      <select
                        name="tempsTravail"
                        value={newEmployee.tempsTravail}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      >
                        <option value="">Sélectionner</option>
                        <option value="Temps plein">Temps plein</option>
                        <option value="Temps partiel - 20h/semaine">Temps partiel - 20h/semaine</option>
                        <option value="Temps partiel - 24h/semaine">Temps partiel - 24h/semaine</option>
                        <option value="Temps partiel - 28h/semaine">Temps partiel - 28h/semaine</option>
                        <option value="Temps partiel - 30h/semaine">Temps partiel - 30h/semaine</option>
                        <option value="Temps partiel - 32h/semaine">Temps partiel - 32h/semaine</option>
                        <option value="Temps partiel - 35h/semaine">Temps partiel - 35h/semaine</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Statut *
                      </label>
                      <select
                        name="statut"
                        value={newEmployee.statut}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      >
                        <option value="Actif">Actif</option>
                        <option value="Inactif">Inactif</option>
                        <option value="En congé">En congé</option>
                        <option value="Cadre">Cadre</option>
                        <option value="Non-cadre">Non-cadre</option>
                        <option value="Agent de maîtrise">Agent de maîtrise</option>
                        <option value="Ouvrier">Ouvrier</option>
                        <option value="Employé">Employé</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Niveau de classification
                      </label>
                      <input
                        type="text"
                        name="niveauClassification"
                        value={newEmployee.niveauClassification}
                        onChange={handleInputChange}
                        placeholder="Ex: E1, E2, E3..."
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loadingCreateEmployee}
                    className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                      loadingCreateEmployee 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-primary-600 hover:bg-primary-700'
                    }`}
                  >
                    {loadingCreateEmployee ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enregistrement...
                      </div>
                    ) : (
                      'Enregistrer'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Édition Employé */}
      {showEditEmployeeModal && editingEmployee && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-6 border w-full max-w-4xl shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Modifier l'Employé
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Modifiez les informations de {editingEmployee.prenoms} {editingEmployee.nom_famille}
                  </p>
                </div>
                <button
                  onClick={() => setShowEditEmployeeModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleEditSubmit} className="space-y-8">
                {/* Section 1: Informations Personnelles (État Civil) */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    1. Informations Personnelles (État Civil)
                  </h4>
                  
                  {/* Photo de l'employé */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Photo de l'employé
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                        {editingEmployee.photo ? (
                          <img 
                            src={URL.createObjectURL(editingEmployee.photo)} 
                            alt="Aperçu de la photo"
                            className="w-full h-full object-cover"
                          />
                        ) : editingEmployee.photo_url ? (
                          <img 
                            src={editingEmployee.photo_url} 
                            alt={`${editingEmployee.prenoms} ${editingEmployee.nom_famille}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-gray-400 text-sm text-center">
                            Aucune photo
                          </div>
                        )}
                      </div>
                      <div>
                        <input
                          type="file"
                          name="photo"
                          accept="image/*"
                          onChange={(e) => setEditingEmployee({...editingEmployee, photo: e.target.files[0]})}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-gray-700 dark:file:text-gray-300"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Formats acceptés: JPG, PNG, GIF (max 5MB)
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Civilité *
                      </label>
                      <select
                        name="civilite"
                        value={editingEmployee.civilite || ''}
                        onChange={(e) => setEditingEmployee({...editingEmployee, civilite: e.target.value})}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      >
                        <option value="">Sélectionner</option>
                        <option value="M.">M.</option>
                        <option value="Mme">Mme</option>
                        <option value="Mlle">Mlle</option>
                        <option value="Dr">Dr</option>
                        <option value="Prof">Prof</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Nom de famille *
                      </label>
                      <input
                        type="text"
                        name="nom_famille"
                        value={editingEmployee.nom_famille || ''}
                        onChange={(e) => setEditingEmployee({...editingEmployee, nom_famille: e.target.value})}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Nom d'usage
                      </label>
                      <input
                        type="text"
                        name="nom_usage"
                        value={editingEmployee.nom_usage || ''}
                        onChange={(e) => setEditingEmployee({...editingEmployee, nom_usage: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Prénoms (ordre état civil) *
                      </label>
                      <input
                        type="text"
                        name="prenoms"
                        value={editingEmployee.prenoms || ''}
                        onChange={(e) => setEditingEmployee({...editingEmployee, prenoms: e.target.value})}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Date de naissance *
                      </label>
                      <input
                        type="date"
                        name="date_naissance"
                        value={editingEmployee.date_naissance || ''}
                        onChange={(e) => setEditingEmployee({...editingEmployee, date_naissance: e.target.value})}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Lieu de naissance *
                      </label>
                      <input
                        type="text"
                        name="lieu_naissance"
                        value={editingEmployee.lieu_naissance || ''}
                        onChange={(e) => setEditingEmployee({...editingEmployee, lieu_naissance: e.target.value})}
                        required
                        placeholder="Ville, Pays"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Nationalité *
                      </label>
                      <input
                        type="text"
                        name="nationalite"
                        value={editingEmployee.nationalite || ''}
                        onChange={(e) => setEditingEmployee({...editingEmployee, nationalite: e.target.value})}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        N° Sécurité Sociale
                      </label>
                      <input
                        type="text"
                        name="numero_securite_sociale"
                        value={editingEmployee.numero_securite_sociale || ''}
                        onChange={(e) => setEditingEmployee({...editingEmployee, numero_securite_sociale: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Situation de famille
                      </label>
                      <select
                        name="situation_famille"
                        value={editingEmployee.situation_famille || ''}
                        onChange={(e) => setEditingEmployee({...editingEmployee, situation_famille: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      >
                        <option value="">Sélectionner</option>
                        <option value="Célibataire">Célibataire</option>
                        <option value="Marié(e)">Marié(e)</option>
                        <option value="Pacsé(e)">Pacsé(e)</option>
                        <option value="Divorcé(e)">Divorcé(e)</option>
                        <option value="Veuf/Veuve">Veuf/Veuve</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 2: Coordonnées et Contact */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    2. Coordonnées et Contact
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Adresse personnelle *
                      </label>
                      <input
                        type="text"
                        name="adresse"
                        value={editingEmployee.adresse || ''}
                        onChange={(e) => setEditingEmployee({...editingEmployee, adresse: e.target.value})}
                        required
                        placeholder="Numéro, Rue, Complément"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Code postal *
                      </label>
                      <input
                        type="text"
                        name="code_postal"
                        value={editingEmployee.code_postal || ''}
                        onChange={(e) => setEditingEmployee({...editingEmployee, code_postal: e.target.value})}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Ville *
                      </label>
                      <input
                        type="text"
                        name="ville"
                        value={editingEmployee.ville || ''}
                        onChange={(e) => setEditingEmployee({...editingEmployee, ville: e.target.value})}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Pays *
                      </label>
                      <input
                        type="text"
                        name="pays"
                        value={editingEmployee.pays || ''}
                        onChange={(e) => setEditingEmployee({...editingEmployee, pays: e.target.value})}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Téléphone personnel *
                      </label>
                      <input
                        type="tel"
                        name="telephone_personnel"
                        value={editingEmployee.telephone_personnel || ''}
                        onChange={(e) => setEditingEmployee({...editingEmployee, telephone_personnel: e.target.value})}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Téléphone domicile
                      </label>
                      <input
                        type="tel"
                        name="telephone_domicile"
                        value={editingEmployee.telephone_domicile || ''}
                        onChange={(e) => setEditingEmployee({...editingEmployee, telephone_domicile: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email personnel *
                      </label>
                      <input
                        type="email"
                        name="email_personnel"
                        value={editingEmployee.email_personnel || ''}
                        onChange={(e) => setEditingEmployee({...editingEmployee, email_personnel: e.target.value})}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Informations Professionnelles */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    3. Informations Professionnelles et Administratives
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Matricule/Identifiant
                      </label>
                      <input
                        type="text"
                        name="matricule"
                        value={editingEmployee.matricule || ''}
                        onChange={(e) => setEditingEmployee({...editingEmployee, matricule: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Poste occupé *
                      </label>
                      <input
                        type="text"
                        name="poste"
                        value={editingEmployee.poste || ''}
                        onChange={(e) => setEditingEmployee({...editingEmployee, poste: e.target.value})}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Service/Département *
                      </label>
                      <select
                        name="departement_id"
                        value={editingEmployee.departement_id || ''}
                        onChange={(e) => {
                          const departementId = e.target.value;
                          setEditingEmployee({...editingEmployee, departement_id: departementId, sous_departement_id: ''});
                          loadSousDepartements(departementId);
                        }}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                        disabled={loadingDepartements}
                      >
                        <option value="">Sélectionner un département</option>
                        {departements.map((departement) => (
                          <option key={departement.id} value={departement.id}>
                            {departement.nom}
                          </option>
                        ))}
                      </select>
                      {loadingDepartements && (
                        <p className="mt-1 text-sm text-gray-500">Chargement des départements...</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Sous-Département
                      </label>
                      <select
                        name="sous_departement_id"
                        value={editingEmployee.sous_departement_id || ''}
                        onChange={(e) => setEditingEmployee({...editingEmployee, sous_departement_id: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                        disabled={!editingEmployee.departement_id || loadingSousDepartements}
                      >
                        <option value="">Sélectionner un sous-département</option>
                        {sousDepartements.map((sousDepartement) => (
                          <option key={sousDepartement.id} value={sousDepartement.id}>
                            {sousDepartement.nom}
                          </option>
                        ))}
                      </select>
                      {loadingSousDepartements && (
                        <p className="mt-1 text-sm text-gray-500">Chargement des sous-départements...</p>
                      )}
                      {!editingEmployee.departement_id && (
                        <p className="mt-1 text-sm text-gray-500">Veuillez d'abord sélectionner un département</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Date d'embauche *
                      </label>
                      <input
                        type="date"
                        name="date_embauche"
                        value={editingEmployee.date_embauche || ''}
                        onChange={(e) => setEditingEmployee({...editingEmployee, date_embauche: e.target.value})}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Type de contrat *
                      </label>
                      <select
                        name="type_contrat"
                        value={editingEmployee.type_contrat || ''}
                        onChange={(e) => setEditingEmployee({...editingEmployee, type_contrat: e.target.value})}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      >
                        <option value="">Sélectionner</option>
                        <option value="CDI">CDI</option>
                        <option value="CDD">CDD</option>
                        <option value="Intérim">Intérim</option>
                        <option value="Stage">Stage</option>
                        <option value="Alternance">Alternance</option>
                        <option value="Contrat de professionnalisation">Contrat de professionnalisation</option>
                        <option value="Freelance">Freelance</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Date de fin de contrat
                      </label>
                      <input
                        type="date"
                        name="date_fin_contrat"
                        value={editingEmployee.date_fin_contrat || ''}
                        onChange={(e) => setEditingEmployee({...editingEmployee, date_fin_contrat: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Temps de travail *
                      </label>
                      <select
                        name="temps_travail"
                        value={editingEmployee.temps_travail || ''}
                        onChange={(e) => setEditingEmployee({...editingEmployee, temps_travail: e.target.value})}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      >
                        <option value="">Sélectionner</option>
                        <option value="Temps plein">Temps plein</option>
                        <option value="Temps partiel - 20h/semaine">Temps partiel - 20h/semaine</option>
                        <option value="Temps partiel - 24h/semaine">Temps partiel - 24h/semaine</option>
                        <option value="Temps partiel - 28h/semaine">Temps partiel - 28h/semaine</option>
                        <option value="Temps partiel - 30h/semaine">Temps partiel - 30h/semaine</option>
                        <option value="Temps partiel - 32h/semaine">Temps partiel - 32h/semaine</option>
                        <option value="Temps partiel - 35h/semaine">Temps partiel - 35h/semaine</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Statut *
                      </label>
                      <select
                        name="statut"
                        value={editingEmployee.statut || ''}
                        onChange={(e) => setEditingEmployee({...editingEmployee, statut: e.target.value})}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      >
                        <option value="Actif">Actif</option>
                        <option value="Inactif">Inactif</option>
                        <option value="En congé">En congé</option>
                        <option value="Cadre">Cadre</option>
                        <option value="Non-cadre">Non-cadre</option>
                        <option value="Agent de maîtrise">Agent de maîtrise</option>
                        <option value="Ouvrier">Ouvrier</option>
                        <option value="Employé">Employé</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Niveau de classification
                      </label>
                      <input
                        type="text"
                        name="niveau_classification"
                        value={editingEmployee.niveau_classification || ''}
                        onChange={(e) => setEditingEmployee({...editingEmployee, niveau_classification: e.target.value})}
                        placeholder="Ex: E1, E2, E3..."
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditEmployeeModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loadingUpdateEmployee}
                    className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                      loadingUpdateEmployee 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-primary-600 hover:bg-primary-700'
                    }`}
                  >
                    {loadingUpdateEmployee ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Mise à jour...
                      </div>
                    ) : (
                      'Mettre à jour'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DossierPersonnel;
