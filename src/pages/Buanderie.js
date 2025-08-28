import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Buanderie = () => {
    const { user } = useAuth();
    const [operations, setOperations] = useState([]);
    const [articles, setArticles] = useState([]);
    const [chambres, setChambres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingOperation, setEditingOperation] = useState(null);
    const [stats, setStats] = useState({
        total: 0,
        envois: 0,
        retours: 0,
        transferts: 0,
        pertes: 0,
        endommagement: 0,
        en_cours: 0,
        propre: 0,
        sale: 0,
        perdu: 0,
        endommage: 0,
        urgente: 0,
        normale: 0,
        basse: 0,
        en_cours_statut: 0,
        termine: 0,
        annule: 0
    });
    const [filters, setFilters] = useState({
        inventaire_id: '',
        chambre_id: '',
        type_operation: '',
        etat_linge: '',
        priorite: '',
        statut: ''
    });

    // État du formulaire
    const [formData, setFormData] = useState({
        inventaire_id: '',
        chambre_id: '',
        type_operation: 'Envoi', // Envoi, Retour, Transfert, Perte, Endommagement
        quantite: 1,
        etat_linge: 'Propre', // Propre, Sale, En cours, Perdu, Endommagé
        priorite: 'Normale', // Urgente, Normale, Basse
        date_retour_prevue: '',
        motif: '',
        notes: '',
        responsable_id: '',
        cout_operation: 0,
        statut: 'En cours'
    });

    // Types d'opérations pour la buanderie
    const typesOperation = ['Envoi', 'Retour', 'Transfert', 'Perte', 'Endommagement'];
    
    // États du linge
    const etatsLinge = ['Propre', 'Sale', 'En cours', 'Perdu', 'Endommagé'];
    
    // Priorités
    const priorites = ['Urgente', 'Normale', 'Basse'];
    
    // Statuts
    const statuts = ['En cours', 'Terminé', 'Annulé'];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [operationsRes, articlesRes, chambresRes] = await Promise.all([
                api.get('/buanderie'),
                api.get('/inventaire?categorie=linge'),
                api.get('/chambres')
            ]);

            setOperations(operationsRes.data.operations || []);
            setStats(operationsRes.data.stats || {
                total: 0, envois: 0, retours: 0, transferts: 0, pertes: 0, endommagement: 0,
                en_cours: 0, propre: 0, sale: 0, perdu: 0, endommage: 0,
                urgente: 0, normale: 0, basse: 0, en_cours_statut: 0, termine: 0, annule: 0
            });
            setArticles(articlesRes.data.data || []);
            setChambres(chambresRes.data.data || []);
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const filteredOperations = operations.filter(operation => {
        if (filters.inventaire_id && operation.inventaire_id !== parseInt(filters.inventaire_id)) return false;
        if (filters.chambre_id && operation.chambre_id !== parseInt(filters.chambre_id)) return false;
        if (filters.type_operation && operation.type_operation !== filters.type_operation) return false;
        if (filters.etat_linge && operation.etat_linge !== filters.etat_linge) return false;
        if (filters.priorite && operation.priorite !== filters.priorite) return false;
        if (filters.statut && operation.statut !== filters.statut) return false;
        return true;
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const operationData = {
                ...formData,
                date_operation: new Date().toISOString(),
                date_retour_prevue: formData.date_retour_prevue ? new Date(formData.date_retour_prevue).toISOString() : null,
                statut: 'En cours'
            };

            if (editingOperation) {
                await api.put(`/buanderie/${editingOperation.id}`, operationData);
            } else {
                await api.post('/buanderie', operationData);
            }
            
            setShowModal(false);
            setEditingOperation(null);
            resetForm();
            fetchData();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            alert('Erreur lors de la sauvegarde');
        }
    };

    const handleEdit = (operation) => {
        setEditingOperation(operation);
        setFormData({
            inventaire_id: operation.inventaire_id,
            chambre_id: operation.chambre_id,
            type_operation: operation.type_operation,
            quantite: operation.quantite,
            notes: operation.notes || '',
            responsable_id: operation.responsable_id || '',
            etat_linge: operation.etat_linge || 'Propre',
            priorite: operation.priorite || 'Normale',
            date_retour_prevue: operation.date_retour_prevue ? new Date(operation.date_retour_prevue).toISOString().slice(0, 10) : '',
            motif: operation.motif || '',
            cout_operation: operation.cout_operation || 0
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette opération ?')) {
            try {
                await api.delete(`/buanderie/${id}`);
                fetchData();
            } catch (error) {
                console.error('Erreur lors de la suppression:', error);
                alert('Erreur lors de la suppression');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            inventaire_id: '',
            chambre_id: '',
            type_operation: 'Envoi',
            quantite: 1,
            notes: '',
            responsable_id: '',
            etat_linge: 'Propre',
            priorite: 'Normale',
            date_retour_prevue: '',
            motif: '',
            cout_operation: 0,
            statut: 'En cours'
        });
    };

    const openNewModal = () => {
        setEditingOperation(null);
        resetForm();
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingOperation(null);
        resetForm();
    };

    const updateFormData = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const getOperationColor = (type) => {
        const colors = {
            'Envoi': 'bg-red-100 text-red-800',
            'Retour': 'bg-green-100 text-green-800',
            'Transfert': 'bg-blue-100 text-blue-800',
            'Perte': 'bg-gray-100 text-gray-800',
            'Endommagement': 'bg-orange-100 text-orange-800'
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    };

    const getStatutColor = (statut) => {
        const colors = {
            'En cours': 'bg-yellow-100 text-yellow-800',
            'Terminé': 'bg-green-100 text-green-800',
            'Annulé': 'bg-red-100 text-red-800'
        };
        return colors[statut] || 'bg-gray-100 text-gray-800';
    };

    const getPrioriteColor = (priorite) => {
        const colors = {
            'Urgente': 'bg-red-100 text-red-800',
            'Normale': 'bg-blue-100 text-blue-800',
            'Basse': 'bg-gray-100 text-gray-800'
        };
        return colors[priorite] || 'bg-gray-100 text-gray-800';
    };

    const getEtatLingeColor = (etat) => {
        const colors = {
            'Propre': 'bg-green-100 text-green-800',
            'Sale': 'bg-red-100 text-red-800',
            'En cours': 'bg-yellow-100 text-yellow-800',
            'Perdu': 'bg-gray-100 text-gray-800',
            'Endommagé': 'bg-orange-100 text-orange-800'
        };
        return colors[etat] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">🧺 Gestion de la Buanderie</h1>
                <button
                    onClick={openNewModal}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
                >
                    <span>+</span>
                    Nouvelle Opération
                </button>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <span className="text-2xl">🧺</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Opérations</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <span className="text-2xl">📤</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Envois</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.envois}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <span className="text-2xl">📥</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Retours</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.retours}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <span className="text-2xl">⏳</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">En cours</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.en_cours_statut}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <span className="text-2xl">🔄</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Transferts</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.transferts}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <span className="text-2xl">🚨</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Urgentes</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.urgente}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filtres */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Filtres</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                    <select
                        value={filters.inventaire_id}
                        onChange={(e) => handleFilterChange('inventaire_id', e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2"
                    >
                        <option value="">Tous les articles</option>
                        {articles.map(article => (
                            <option key={article.id} value={article.id}>
                                {article.nom} - {article.numero_reference}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filters.chambre_id}
                        onChange={(e) => handleFilterChange('chambre_id', e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2"
                    >
                        <option value="">Toutes les chambres</option>
                        {chambres.map(chambre => (
                            <option key={chambre.id} value={chambre.id}>
                                {chambre.numero || chambre.nom}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filters.type_operation}
                        onChange={(e) => handleFilterChange('type_operation', e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2"
                    >
                        <option value="">Tous les types</option>
                        {typesOperation.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>

                    <select
                        value={filters.etat_linge}
                        onChange={(e) => handleFilterChange('etat_linge', e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2"
                    >
                        <option value="">Tous les états</option>
                        {etatsLinge.map(etat => (
                            <option key={etat} value={etat}>{etat}</option>
                        ))}
                    </select>

                    <select
                        value={filters.priorite}
                        onChange={(e) => handleFilterChange('priorite', e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2"
                    >
                        <option value="">Toutes les priorités</option>
                        {priorites.map(priorite => (
                            <option key={priorite} value={priorite}>{priorite}</option>
                        ))}
                    </select>

                    <button
                        onClick={() => setFilters({
                            inventaire_id: '',
                            chambre_id: '',
                            type_operation: '',
                            etat_linge: '',
                            priorite: '',
                            statut: ''
                        })}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                    >
                        Réinitialiser
                    </button>
                </div>
            </div>

            {/* Tableau des mouvements */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Article
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Chambre
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type d'opération
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Quantité
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    État du linge
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Priorité
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Statut
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredOperations.map((operation) => (
                                <tr key={operation.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {operation.inventaire?.nom}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {operation.inventaire?.numero_reference}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {operation.chambre?.numero || operation.chambre?.nom || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getOperationColor(operation.type_operation)}`}>
                                            {operation.type_operation}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {operation.quantite}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEtatLingeColor(operation.etat_linge)}`}>
                                            {operation.etat_linge || 'Propre'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPrioriteColor(operation.priorite)}`}>
                                            {operation.priorite || 'Normale'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatutColor(operation.statut)}`}>
                                            {operation.statut || 'En cours'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(operation.date_operation).toLocaleDateString('fr-FR')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(operation)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                                        >
                                            Modifier
                                        </button>
                                        {(user.role === 'Administrateur' || user.role === 'Superviseur') && (
                                            <button
                                                onClick={() => handleDelete(operation.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Supprimer
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal pour créer/modifier un mouvement */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">
                                {editingOperation ? 'Modifier l\'opération' : 'Nouvelle opération de buanderie'}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Article de linge *
                                    </label>
                                    <select
                                        required
                                        value={formData.inventaire_id}
                                        onChange={(e) => updateFormData('inventaire_id', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    >
                                        <option value="">Sélectionner un article</option>
                                        {articles.map(article => (
                                            <option key={article.id} value={article.id}>
                                                {article.nom} - {article.numero_reference}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Chambre *
                                    </label>
                                    <select
                                        required
                                        value={formData.chambre_id}
                                        onChange={(e) => updateFormData('chambre_id', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    >
                                        <option value="">Sélectionner une chambre</option>
                                        {chambres.map(chambre => (
                                            <option key={chambre.id} value={chambre.id}>
                                                {chambre.numero || chambre.nom}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Type d'opération *
                                    </label>
                                    <select
                                        required
                                        value={formData.type_operation}
                                        onChange={(e) => updateFormData('type_operation', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    >
                                        {typesOperation.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Quantité *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0.01"
                                        step="0.01"
                                        value={formData.quantite}
                                        onChange={(e) => updateFormData('quantite', parseFloat(e.target.value))}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Motif
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.motif}
                                        onChange={(e) => updateFormData('motif', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                        placeholder="Motif de l'opération..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Coût de l'opération
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.cout_operation}
                                        onChange={(e) => updateFormData('cout_operation', parseFloat(e.target.value))}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        État du linge
                                    </label>
                                    <select
                                        value={formData.etat_linge}
                                        onChange={(e) => updateFormData('etat_linge', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    >
                                        {etatsLinge.map(etat => (
                                            <option key={etat} value={etat}>{etat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Priorité
                                    </label>
                                    <select
                                        value={formData.priorite}
                                        onChange={(e) => updateFormData('priorite', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    >
                                        {priorites.map(priorite => (
                                            <option key={priorite} value={priorite}>{priorite}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Date de retour prévue
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.date_retour_prevue}
                                        onChange={(e) => updateFormData('date_retour_prevue', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Statut
                                    </label>
                                    <select
                                        value={formData.statut || 'En cours'}
                                        onChange={(e) => updateFormData('statut', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    >
                                        {statuts.map(statut => (
                                            <option key={statut} value={statut}>{statut}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Notes
                                </label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => updateFormData('notes', e.target.value)}
                                    rows="3"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    placeholder="Notes sur le mouvement de linge..."
                                />
                            </div>

                            {/* Boutons d'action */}
                            <div className="flex justify-end space-x-3 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    {editingOperation ? 'Mettre à jour' : 'Créer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Buanderie;
