import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { organigrammeAPI } from '../../services/api';
import { UserIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Select from 'react-select';

const Organigramme = () => {
  const { user } = useAuth();
  const [organigramme, setOrganigramme] = useState([]); // Assignations des employés
  const [loading, setLoading] = useState(false);
  const [employesDisponibles, setEmployesDisponibles] = useState([]);
  const [selectedPoste, setSelectedPoste] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedEmploye, setSelectedEmploye] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    loadEmployesDisponibles();
    loadAssignations();
  }, []);

  const loadAssignations = async () => {
    try {
      console.log('🔄 Chargement des assignations...');
      const response = await organigrammeAPI.getOrganigramme();
      console.log('📡 Réponse organigramme:', response);
      
      let assignations = [];
      
      // Gérer les deux formats possibles
      if (response?.data?.success && Array.isArray(response.data.data)) {
        assignations = response.data.data;
      } else if (Array.isArray(response.data)) {
        assignations = response.data;
      } else if (response?.data?.data && Array.isArray(response.data.data)) {
        assignations = response.data.data;
      }
      
      // Convertir les données de l'organigramme en assignations
      const assignationsList = [];
      const processPoste = (poste) => {
        if (poste.employe) {
          assignationsList.push({
            posteId: poste.id,
            employe: poste.employe
          });
        }
        if (poste.enfants) {
          poste.enfants.forEach(processPoste);
        }
      };
      
      assignations.forEach(processPoste);
      
      console.log('👥 Assignations chargées:', assignationsList.length);
      setOrganigramme(assignationsList);
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement des assignations:', error);
    }
  };

  const loadOrganigramme = async () => {
    // Plus besoin de charger depuis l'API, on utilise la structure statique
    setOrganigramme([]);
  };

  const loadEmployesDisponibles = async () => {
    try {
      console.log('🔄 Chargement des employés disponibles...');
      console.log('🔑 Token utilisé:', localStorage.getItem('token'));
      
      const response = await organigrammeAPI.getEmployesDisponibles();
      console.log('📡 Réponse complète:', response);
      console.log('📡 Response.data:', response.data);
      console.log('📡 Response.data type:', typeof response.data);
      console.log('📡 Response.data isArray:', Array.isArray(response.data));
      
      let employes = [];
      
      // Gérer les deux formats possibles
      if (response?.data?.success && Array.isArray(response.data.data)) {
        // Format: { success: true, data: [...] }
        employes = response.data.data;
        console.log('✅ Format avec success wrapper détecté');
      } else if (Array.isArray(response.data)) {
        // Format: [...] directement
        employes = response.data;
        console.log('✅ Format direct array détecté');
      } else if (response?.data?.data && Array.isArray(response.data.data)) {
        // Format: { data: [...] }
        employes = response.data.data;
        console.log('✅ Format avec data wrapper détecté');
      } else {
        console.error('❌ Format de réponse invalide pour les employés:', response);
        setEmployesDisponibles([]);
        return;
      }
      
      console.log('👥 Employés chargés:', employes.length);
      console.log('👥 Noms des employés:', employes.map(e => `${e.prenoms} ${e.nom_famille}`));
      setEmployesDisponibles(employes);
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement des employés disponibles:', error);
      console.error('🔍 Détails de l\'erreur:', error.response?.data || error.message);
      console.error('🔍 Status:', error.response?.status);
      console.error('🔍 Headers:', error.response?.headers);
      setEmployesDisponibles([]);
    }
  };

  const handleAssignEmploye = async () => {
    if (!selectedEmploye || !selectedPoste) {
      alert('Veuillez sélectionner un employé');
      return;
    }

    try {
      // Sauvegarder dans la base de données
      await organigrammeAPI.assignerEmploye(selectedPoste.id, selectedEmploye.id);
      
      // Mettre à jour l'état local
      setOrganigramme(prev => {
        const existing = prev.find(p => p.posteId === selectedPoste.id);
        if (existing) {
          // Remplacer l'assignation existante
          return prev.map(p => p.posteId === selectedPoste.id ? { ...p, employe: selectedEmploye } : p);
        } else {
          // Ajouter une nouvelle assignation
          return [...prev, { posteId: selectedPoste.id, employe: selectedEmploye }];
        }
      });

      // Mettre à jour la liste des employés disponibles
      setEmployesDisponibles(prev => prev.filter(e => e.id !== selectedEmploye.id));
      
      setShowAssignModal(false);
      setSelectedPoste(null);
      setSelectedEmploye(null);
      
      alert('Employé assigné avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'assignation:', error);
      alert('Erreur lors de l\'assignation de l\'employé');
    }
  };

  const handleDesassignerEmploye = async (posteId) => {
    try {
      // Trouver l'assignation à supprimer
      const assignation = organigramme.find(p => p.posteId === posteId);
      if (!assignation) return;

      // Sauvegarder dans la base de données
      await organigrammeAPI.desassignerEmploye(posteId);

      // Remettre l'employé dans la liste des disponibles
      setEmployesDisponibles(prev => [...prev, assignation.employe]);

      // Supprimer l'assignation
      setOrganigramme(prev => prev.filter(p => p.posteId !== posteId));
      
      alert('Employé désassigné avec succès !');
    } catch (error) {
      console.error('Erreur lors de la désassignation:', error);
      alert('Erreur lors de la désassignation de l\'employé');
    }
  };

  // Fonctions pour le zoom et le drag
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  const handleZoomReset = () => {
    setZoomLevel(100);
    setScrollPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (e.button === 0 && !e.target.closest('[data-no-drag]')) { // Clic gauche seulement et pas sur les cartes
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX - scrollPosition.x, y: e.clientY - scrollPosition.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setScrollPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -10 : 10;
      setZoomLevel(prev => Math.min(Math.max(prev + delta, 50), 200));
    }
  };

  // Options pour react-select
  const employeOptions = employesDisponibles.map(employe => ({
    value: employe.id,
    label: `${employe.civilite} ${employe.prenoms} ${employe.nom_famille}`,
    employe: employe
  }));

  console.log('🔍 employeOptions:', employeOptions);
  console.log('🔍 employesDisponibles length:', employesDisponibles.length);

  // Styles personnalisés pour react-select
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '50px',
      border: state.isFocused ? '2px solid #3B82F6' : '2px solid #E5E7EB',
      borderRadius: '8px',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
      '&:hover': {
        border: '2px solid #3B82F6'
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#3B82F6' : state.isFocused ? '#EFF6FF' : 'white',
      color: state.isSelected ? 'white' : '#374151',
      padding: '12px 16px',
      '&:hover': {
        backgroundColor: state.isSelected ? '#3B82F6' : '#EFF6FF'
      }
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9CA3AF'
    })
  };


  // Structure statique de l'organigramme
  const organigrammeStructure = [
    {
      id: 1,
      nom: 'Patron',
      description: 'Direction Générale',
      niveau: 1,
      couleur: '#1E40AF',
      enfants: [
        {
          id: 2,
          nom: 'Directeur Général',
          description: 'Direction Générale',
          niveau: 2,
          couleur: '#1E40AF',
          enfants: [
            {
              id: 3,
              nom: 'Superviseur RH',
              description: 'Supervision des Ressources Humaines',
              niveau: 3,
              couleur: '#3B82F6',
              enfants: [
                {
                  id: 7,
                  nom: 'Responsable RH',
                  description: 'Responsable des Ressources Humaines',
                  niveau: 4,
                  couleur: '#6B7280',
                  enfants: [
                    { id: 11, nom: 'Agent RH', description: 'Agent des Ressources Humaines', niveau: 5, couleur: '#9CA3AF' },
                    { id: 12, nom: 'Assistant RH', description: 'Assistant des Ressources Humaines', niveau: 5, couleur: '#9CA3AF' }
                  ]
                }
              ]
            },
            {
              id: 4,
              nom: 'Superviseur Finance',
              description: 'Supervision des Finances',
              niveau: 3,
              couleur: '#3B82F6',
              enfants: [
                {
                  id: 8,
                  nom: 'Responsable Finances',
                  description: 'Responsable des Finances',
                  niveau: 4,
                  couleur: '#6B7280',
                  enfants: [
                    { id: 13, nom: 'Comptable', description: 'Comptable', niveau: 5, couleur: '#9CA3AF' },
                    { id: 14, nom: 'Guichetier', description: 'Guichetier', niveau: 5, couleur: '#9CA3AF' }
                  ]
                }
              ]
            },
            {
              id: 'superviseur-stock',
              nom: 'Superviseur Stock',
              description: 'Supervision du Stock',
              niveau: 3,
              couleur: '#3B82F6',
              enfants: [
                {
                  id: 'responsable-stock',
                  nom: 'Responsable Stock',
                  description: 'Responsable du Stock',
                  niveau: 4,
                  couleur: '#6B7280',
                  enfants: [
                    { id: 'agent-stock', nom: 'Agent Stock', description: 'Agent du Stock', niveau: 5, couleur: '#9CA3AF' }
                  ]
                }
              ]
            },
            {
              id: 'superviseur-operations',
              nom: 'Superviseur Opérations',
              description: 'Supervision des Opérations',
              niveau: 3,
              couleur: '#3B82F6',
              enfants: [
                {
                  id: 'responsable-operations',
                  nom: 'Responsable Opérations',
                  description: 'Responsable des Opérations',
                  niveau: 4,
                  couleur: '#6B7280',
                  enfants: [
                    { id: 'agent-operations', nom: 'Agent Opérations', description: 'Agent des Opérations', niveau: 5, couleur: '#9CA3AF' }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ];

  const renderPoste = (poste, level = 0, parentPosition = null) => {
    const hasEmploye = organigramme.find(p => p.posteId === poste.id)?.employe;
    const isSelected = selectedPoste?.id === poste.id;
    const hasChildren = poste.enfants && poste.enfants.length > 0;
    
    return (
      <div key={poste.id} className="relative flex flex-col items-center">
        {/* Carte du poste */}
        <div className="relative z-10">
        <div
            className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
            isSelected
                ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-500 shadow-2xl scale-105'
                : hasEmploye 
                  ? 'bg-white border-blue-300 shadow-xl hover:shadow-2xl' 
                  : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300 hover:border-blue-400 hover:shadow-xl'
            }`}
            style={{ 
              backgroundColor: isSelected 
                ? '#dbeafe' 
                : hasEmploye 
                  ? 'white' 
                  : poste.couleur + '15',
              minWidth: '220px',
              maxWidth: '280px'
            }}
            data-no-drag
            onClick={() => {
              setSelectedPoste(poste);
              setShowAssignModal(true);
            }}
          >
            {/* Indicateur de niveau */}
            <div 
              className="absolute -top-3 -left-3 w-6 h-6 rounded-full border-3 border-white shadow-lg flex items-center justify-center"
              style={{ backgroundColor: poste.couleur }}
            >
              <span className="text-white text-xs font-bold">{poste.niveau}</span>
            </div>

            {/* Contenu du poste */}
            <div className="flex items-center space-x-4">
              {hasEmploye ? (
                <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 shadow-lg ring-2 ring-blue-200">
                  {hasEmploye.photo_url ? (
                    <img 
                      src={hasEmploye.photo_url} 
                      alt={`${hasEmploye.prenoms} ${hasEmploye.nom_famille}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-7 h-7 text-blue-600" />
                  )}
                </div>
              ) : (
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center shadow-lg ring-2 ring-gray-200">
                  <UserIcon className="w-7 h-7 text-gray-500" />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-base truncate">{poste.nom}</h3>
                {hasEmploye ? (
                  <div>
                    <p className="text-sm text-gray-700 font-medium truncate">
                      {hasEmploye.civilite} {hasEmploye.prenoms} {hasEmploye.nom_famille}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{hasEmploye.poste}</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic font-medium">Cliquez pour assigner</p>
                )}
              </div>

              {hasEmploye && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDesassignerEmploye(poste.id);
                  }}
                  className="p-1.5 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                  title="Désassigner l'employé"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Badge de niveau */}
            <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg">
              N{poste.niveau}
            </div>
          </div>
        </div>
        
        {/* Lignes de connexion */}
        {hasChildren && (
          <div className="relative mt-6">
            {/* Ligne verticale principale */}
            <div className="absolute left-1/2 top-0 w-1 h-8 bg-gradient-to-b from-blue-400 to-blue-300 transform -translate-x-1/2 rounded-full"></div>
            
            {/* Ligne horizontale vers les enfants */}
            <div 
              className="absolute left-1/2 top-8 h-1 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 transform -translate-x-1/2 rounded-full" 
              style={{ 
                width: `${Math.max((poste.enfants.length - 1) * 320, 500)}px` 
              }}
            ></div>
            
            {/* Lignes verticales vers chaque enfant */}
            {poste.enfants.map((_, index) => (
              <div 
                key={index}
                className="absolute top-8 w-1 h-8 bg-gradient-to-b from-blue-400 to-blue-300 rounded-full"
                style={{ 
                  left: `${50 + (index - (poste.enfants.length - 1) / 2) * 320 / Math.max(poste.enfants.length - 1, 1)}%`,
                  transform: 'translateX(-50%)'
                }}
              ></div>
            ))}
          </div>
        )}

        {/* Rendu des enfants */}
        {hasChildren && (
          <div className="flex justify-center mt-16 space-x-20">
            {poste.enfants.map((child, index) => (
              <div key={child.id} className="flex flex-col items-center">
                {renderPoste(child, level + 1, { level, index })}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="mb-8">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Organigramme de l'entreprise
        </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Gérez la structure organisationnelle et assignez les employés aux postes
          </p>
        </div>
        
        {/* Contrôles de zoom et légende */}
        <div className="flex justify-between items-center mb-6">
          {/* Légende */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-gray-600 dark:text-gray-400">Poste assigné</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                <span className="text-gray-600 dark:text-gray-400">Poste vacant</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-100 border-2 border-blue-500"></div>
                <span className="text-gray-600 dark:text-gray-400">Sélectionné</span>
              </div>
            </div>
          </div>

          {/* Contrôles de zoom */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                Zoom: {zoomLevel}%
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleZoomOut}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  title="Zoom arrière"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <button
                  onClick={handleZoomReset}
                  className="px-3 py-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors text-sm font-medium"
                >
                  Reset
                </button>
                <button
                  onClick={handleZoomIn}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  title="Zoom avant"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Ctrl + molette pour zoomer • Clic gauche + glisser pour déplacer
            </p>
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Position: X: {Math.round(scrollPosition.x)}px, Y: {Math.round(scrollPosition.y)}px
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
        <div 
          className="relative overflow-auto h-[70vh] cursor-grab active:cursor-grabbing transition-transform duration-200"
          style={{
            transform: `scale(${zoomLevel / 100}) translate(${scrollPosition.x}px, ${scrollPosition.y}px)`,
            transformOrigin: 'center center',
            minWidth: '100%',
            minHeight: '100%'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <div className="flex justify-center min-w-max min-h-max">
            <div className="relative">
              {organigrammeStructure.map(poste => renderPoste(poste))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal d'assignation d'employé */}
      {showAssignModal && selectedPoste && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg mx-4">
            <div className="flex justify-between items-center mb-6">
            <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Assigner un employé
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Poste: <span className="font-medium">{selectedPoste.nom}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={loadEmployesDisponibles}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  title="Recharger les employés"
                >
                  🔄 Recharger
                </button>
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedPoste(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sélectionner un employé
              </label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      Debug: {employesDisponibles.length} employés disponibles
                    </div>
                    <button
                      onClick={() => {
                        console.log('🔄 Rechargement manuel des employés...');
                        loadEmployesDisponibles();
                      }}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                    >
                      🔄 Recharger
                    </button>
                  </div>
                  <Select
                    value={selectedEmploye ? employeOptions.find(option => option.value === selectedEmploye.id) : null}
                    onChange={(option) => {
                      console.log('🔍 Option sélectionnée:', option);
                      setSelectedEmploye(option ? option.employe : null);
                    }}
                    options={employeOptions}
                    styles={customStyles}
                    placeholder="Rechercher un employé..."
                    isSearchable
                    isClearable
                    noOptionsMessage={() => "Aucun employé disponible"}
                    formatOptionLabel={(option) => (
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-blue-100">
                          {option.employe.photo_url ? (
                            <img 
                              src={option.employe.photo_url} 
                              alt={`${option.employe.prenoms} ${option.employe.nom_famille}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <UserIcon className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-gray-500">{option.employe.poste}</div>
                        </div>
                      </div>
                    )}
                  />
                </div>
              </div>

              {selectedEmploye && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-blue-100">
                      {selectedEmploye.photo_url ? (
                        <img 
                          src={selectedEmploye.photo_url} 
                          alt={`${selectedEmploye.prenoms} ${selectedEmploye.nom_famille}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserIcon className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-blue-800">
                        {selectedEmploye.civilite} {selectedEmploye.prenoms} {selectedEmploye.nom_famille}
                      </p>
                      <p className="text-sm text-blue-600">{selectedEmploye.poste}</p>
                      {selectedEmploye.email_personnel && (
                        <p className="text-xs text-blue-500">{selectedEmploye.email_personnel}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {selectedPoste.employe && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-yellow-100">
                    {selectedPoste.employe.photo_url ? (
                      <img 
                        src={selectedPoste.employe.photo_url} 
                        alt={`${selectedPoste.employe.prenoms} ${selectedPoste.employe.nom_famille}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-5 h-5 text-yellow-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-800">
                      Actuellement assigné: {selectedPoste.employe.civilite} {selectedPoste.employe.prenoms} {selectedPoste.employe.nom_famille}
                    </p>
                    <p className="text-xs text-yellow-600">{selectedPoste.employe.poste}</p>
                  </div>
                  <button
                    onClick={() => handleDesassignerEmploye(selectedPoste.id)}
                    className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
                  >
                    Désassigner
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedPoste(null);
                  setSelectedEmploye(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleAssignEmploye}
                disabled={!selectedEmploye}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Assigner
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Organigramme;