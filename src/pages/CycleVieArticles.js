import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const CycleVieArticles = () => {
    const { user } = useAuth();
    const [operations, setOperations] = useState([]);
    const [articles, setArticles] = useState([]);
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [entrepots, setEntrepots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingOperation, setEditingOperation] = useState(null);
    const [filters, setFilters] = useState({
        article_id: '',
        type_operation: '',
        statut: '',
        date_debut: '',
        date_fin: ''
    });

    // État du formulaire
    const [formData, setFormData] = useState({
        article_id: '',
        type_operation: '',
        quantite: 1,
        unite: 'unité',
        lieu_origine: '',
        lieu_destination: '',
        reference_document: '',
        cout_unitaire: '',
        observations: '',
        maintenance: {
            type_maintenance: 'Preventive',
            description: '',
            technicien_id: '',
            date_debut_maintenance: '',
            date_fin_maintenance: '',
            cout_maintenance: '',
            pieces_remplacees: '',
            resultat: 'Reussi',
            prochaine_maintenance: ''
        },
        transfert: {
            entrepot_origine_id: '',
            entrepot_destination_id: '',
            moyen_transport: '',
            numero_transport: '',
            date_expedition: '',
            date_reception: '',
            responsable_expedition_id: '',
            responsable_reception_id: '',
            etat_reception: 'Bon',
            observations_reception: ''
        }
    });

    // Types d'opérations disponibles
    const typesOperation = [
        'Creation', 'Reception', 'Transfert', 'Utilisation', 
        'Maintenance', 'Perte', 'Vol', 'Destruction', 'Vente', 'Don'
    ];

    // Types de maintenance
    const typesMaintenance = ['Preventive', 'Corrective', 'Predictive', 'Conditionnelle'];

    // Résultats de maintenance
    const resultatsMaintenance = ['Reussi', 'Partiel', 'Echec'];

    // États de réception
    const etatsReception = ['Bon', 'Endommage', 'Incomplet', 'Perdu'];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [operationsRes, articlesRes, utilisateursRes, entrepotsRes] = await Promise.all([
                api.get('/cycle-vie-articles'),
                api.get('/inventaire'),
                api.get('/users'),
                api.get('/entrepots')
            ]);

            setOperations(operationsRes.data.data || []);
            setArticles(articlesRes.data.data || []);
            setUtilisateurs(utilisateursRes.data.data || []);
            setEntrepots(entrepotsRes.data.data || []);
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
        if (filters.article_id && operation.article_id !== parseInt(filters.article_id)) return false;
        if (filters.type_operation && operation.type_operation !== filters.type_operation) return false;
        if (filters.statut && operation.statut !== filters.statut) return false;
        if (filters.date_debut && filters.date_fin) {
            const operationDate = new Date(operation.date_operation);
            const debut = new Date(filters.date_debut);
            const fin = new Date(filters.date_fin);
            if (operationDate < debut || operationDate > fin) return false;
        }
        return true;
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingOperation) {
                await api.put(`/cycle-vie-articles/${editingOperation.id}`, formData);
            } else {
                await api.post('/cycle-vie-articles', formData);
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
            article_id: operation.article_id,
            type_operation: operation.type_operation,
            quantite: operation.quantite,
            unite: operation.unite,
            lieu_origine: operation.lieu_origine,
            lieu_destination: operation.lieu_destination,
            reference_document: operation.reference_document,
            cout_unitaire: operation.cout_unitaire,
            observations: operation.observations,
            maintenance: operation.maintenance || {
                type_maintenance: 'Preventive',
                description: '',
                technicien_id: '',
                date_debut_maintenance: '',
                date_fin_maintenance: '',
                cout_maintenance: '',
                pieces_remplacees: '',
                resultat: 'Reussi',
                prochaine_maintenance: ''
            },
            transfert: operation.transfert || {
                entrepot_origine_id: '',
                entrepot_destination_id: '',
                moyen_transport: '',
                numero_transport: '',
                date_expedition: '',
                date_reception: '',
                responsable_expedition_id: '',
                responsable_reception_id: '',
                etat_reception: 'Bon',
                observations_reception: ''
            }
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette opération ?')) {
            try {
                await api.delete(`/cycle-vie-articles/${id}`);
                fetchData();
            } catch (error) {
                console.error('Erreur lors de la suppression:', error);
                alert('Erreur lors de la suppression');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            article_id: '',
            type_operation: '',
            quantite: 1,
            unite: 'unité',
            lieu_origine: '',
            lieu_destination: '',
            reference_document: '',
            cout_unitaire: '',
            observations: '',
            maintenance: {
                type_maintenance: 'Preventive',
                description: '',
                technicien_id: '',
                date_debut_maintenance: '',
                date_fin_maintenance: '',
                cout_maintenance: '',
                pieces_remplacees: '',
                resultat: 'Reussi',
                prochaine_maintenance: ''
            },
            transfert: {
                entrepot_origine_id: '',
                entrepot_destination_id: '',
                moyen_transport: '',
                numero_transport: '',
                date_expedition: '',
                date_reception: '',
                responsable_expedition_id: '',
                responsable_reception_id: '',
                etat_reception: 'Bon',
                observations_reception: ''
            }
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

    const updateMaintenanceData = (field, value) => {
        setFormData(prev => ({
            ...prev,
            maintenance: { ...prev.maintenance, [field]: value }
        }));
    };

    const updateTransfertData = (field, value) => {
        setFormData(prev => ({
            ...prev,
            transfert: { ...prev.transfert, [field]: value }
        }));
    };

    const getOperationColor = (type) => {
        const colors = {
            'Creation': 'bg-green-100 text-green-800',
            'Reception': 'bg-blue-100 text-blue-800',
            'Transfert': 'bg-yellow-100 text-yellow-800',
            'Utilisation': 'bg-purple-100 text-purple-800',
            'Maintenance': 'bg-orange-100 text-orange-800',
            'Perte': 'bg-red-100 text-red-800',
            'Vol': 'bg-red-100 text-red-800',
            'Destruction': 'bg-gray-100 text-gray-800',
            'Vente': 'bg-indigo-100 text-indigo-800',
            'Don': 'bg-pink-100 text-pink-800'
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
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
                <h1 className="text-3xl font-bold text-gray-900">Cycle de Vie des Articles</h1>
                <button
                    onClick={openNewModal}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
                >
                    <span>+</span>
                    Nouvelle Opération
                </button>
            </div>

            {/* Filtres */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Filtres</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                    <select
                        value={filters.article_id}
                        onChange={(e) => handleFilterChange('article_id', e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2"
                    >
                        <option value="">Tous les articles</option>
                        {articles.map(article => (
                            <option key={article.id} value={article.id}>
                                {article.nom} - {article.reference}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filters.type_operation}
                        onChange={(e) => handleFilterChange('type_operation', e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2"
                    >
                        <option value="">Toutes les opérations</option>
                        {typesOperation.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>

                    <select
                        value={filters.statut}
                        onChange={(e) => handleFilterChange('statut', e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2"
                    >
                        <option value="">Tous les statuts</option>
                        <option value="En cours">En cours</option>
                        <option value="Termine">Terminé</option>
                        <option value="Annule">Annulé</option>
                        <option value="En attente">En attente</option>
                    </select>

                    <input
                        type="date"
                        value={filters.date_debut}
                        onChange={(e) => handleFilterChange('date_debut', e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2"
                        placeholder="Date début"
                    />

                    <input
                        type="date"
                        value={filters.date_fin}
                        onChange={(e) => handleFilterChange('date_fin', e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2"
                        placeholder="Date fin"
                    />

                    <button
                        onClick={() => setFilters({
                            article_id: '',
                            type_operation: '',
                            statut: '',
                            date_debut: '',
                            date_fin: ''
                        })}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                    >
                        Réinitialiser
                    </button>
                </div>
            </div>

            {/* Tableau des opérations */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Article
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Opération
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Quantité
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Coût
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Utilisateur
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
                                                {operation.article?.nom}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {operation.article?.numero_reference}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getOperationColor(operation.type_operation)}`}>
                                            {operation.type_operation}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(operation.date_operation).toLocaleDateString('fr-FR')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {operation.quantite} {operation.unite}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {operation.cout_total ? `${operation.cout_total.toLocaleString('fr-FR')} FC` : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {operation.utilisateur?.nom} {operation.utilisateur?.prenom}
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

            {/* Modal pour créer/modifier une opération */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">
                                {editingOperation ? 'Modifier l\'opération' : 'Nouvelle opération'}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Informations de base */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Article *
                                    </label>
                                    <select
                                        required
                                        value={formData.article_id}
                                        onChange={(e) => updateFormData('article_id', e.target.value)}
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
                                        Type d'opération *
                                    </label>
                                    <select
                                        required
                                        value={formData.type_operation}
                                        onChange={(e) => updateFormData('type_operation', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    >
                                        <option value="">Sélectionner le type</option>
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
                                        Unité
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.unite}
                                        onChange={(e) => updateFormData('unite', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                        placeholder="unité"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Lieu d'origine
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.lieu_origine}
                                        onChange={(e) => updateFormData('lieu_origine', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                        placeholder="ex: Fournisseur ABC"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Lieu de destination
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.lieu_destination}
                                        onChange={(e) => updateFormData('lieu_destination', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                        placeholder="ex: Entrepôt Principal"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Référence document
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.reference_document}
                                        onChange={(e) => updateFormData('reference_document', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                        placeholder="ex: Facture ABC-001"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Coût unitaire (FC)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formData.cout_unitaire}
                                        onChange={(e) => updateFormData('cout_unitaire', parseFloat(e.target.value) || '')}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Observations
                                </label>
                                <textarea
                                    value={formData.observations}
                                    onChange={(e) => updateFormData('observations', e.target.value)}
                                    rows="3"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    placeholder="Description de l'opération..."
                                />
                            </div>

                            {/* Détails de maintenance */}
                            {formData.type_operation === 'Maintenance' && (
                                <div className="border-t pt-4">
                                    <h4 className="text-md font-medium mb-4">Détails de la maintenance</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Type de maintenance
                                            </label>
                                            <select
                                                value={formData.maintenance.type_maintenance}
                                                onChange={(e) => updateMaintenanceData('type_maintenance', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            >
                                                {typesMaintenance.map(type => (
                                                    <option key={type} value={type}>{type}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Technicien
                                            </label>
                                            <select
                                                value={formData.maintenance.technicien_id}
                                                onChange={(e) => updateMaintenanceData('technicien_id', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            >
                                                <option value="">Sélectionner un technicien</option>
                                                {utilisateurs.filter(u => ['Technicien', 'Superviseur'].includes(u.role)).map(utilisateur => (
                                                    <option key={utilisateur.id} value={utilisateur.id}>
                                                        {utilisateur.nom} {utilisateur.prenom}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Date début
                                            </label>
                                            <input
                                                type="datetime-local"
                                                value={formData.maintenance.date_debut_maintenance}
                                                onChange={(e) => updateMaintenanceData('date_debut_maintenance', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Date fin
                                            </label>
                                            <input
                                                type="datetime-local"
                                                value={formData.maintenance.date_fin_maintenance}
                                                onChange={(e) => updateMaintenanceData('date_fin_maintenance', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Coût maintenance (FC)
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={formData.maintenance.cout_maintenance}
                                                onChange={(e) => updateMaintenanceData('cout_maintenance', parseFloat(e.target.value) || '')}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                placeholder="0.00"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Résultat
                                            </label>
                                            <select
                                                value={formData.maintenance.resultat}
                                                onChange={(e) => updateMaintenanceData('resultat', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            >
                                                {resultatsMaintenance.map(resultat => (
                                                    <option key={resultat} value={resultat}>{resultat}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Prochaine maintenance
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.maintenance.prochaine_maintenance}
                                                onChange={(e) => updateMaintenanceData('prochaine_maintenance', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            required
                                            value={formData.maintenance.description}
                                            onChange={(e) => updateMaintenanceData('description', e.target.value)}
                                            rows="3"
                                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            placeholder="Description détaillée de la maintenance..."
                                        />
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Pièces remplacées
                                        </label>
                                        <textarea
                                            value={formData.maintenance.pieces_remplacees}
                                            onChange={(e) => updateMaintenanceData('pieces_remplacees', e.target.value)}
                                            rows="2"
                                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            placeholder="Liste des pièces remplacées..."
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Détails de transfert */}
                            {formData.type_operation === 'Transfert' && (
                                <div className="border-t pt-4">
                                    <h4 className="text-md font-medium mb-4">Détails du transfert</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Entrepôt d'origine *
                                            </label>
                                            <select
                                                required
                                                value={formData.transfert.entrepot_origine_id}
                                                onChange={(e) => updateTransfertData('entrepot_origine_id', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            >
                                                <option value="">Sélectionner l'entrepôt d'origine</option>
                                                {entrepots.map(entrepot => (
                                                    <option key={entrepot.id} value={entrepot.id}>
                                                        {entrepot.nom}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Entrepôt de destination *
                                            </label>
                                            <select
                                                required
                                                value={formData.transfert.entrepot_destination_id}
                                                onChange={(e) => updateTransfertData('entrepot_destination_id', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            >
                                                <option value="">Sélectionner l'entrepôt de destination</option>
                                                {entrepots.map(entrepot => (
                                                    <option key={entrepot.id} value={entrepot.id}>
                                                        {entrepot.nom}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Moyen de transport
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.transfert.moyen_transport}
                                                onChange={(e) => updateTransfertData('moyen_transport', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                placeholder="ex: Camion, Voiture..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Numéro de transport
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.transfert.numero_transport}
                                                onChange={(e) => updateTransfertData('numero_transport', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                placeholder="ex: TR-001"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Date d'expédition
                                            </label>
                                            <input
                                                type="datetime-local"
                                                value={formData.transfert.date_expedition}
                                                onChange={(e) => updateTransfertData('date_expedition', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Date de réception
                                            </label>
                                            <input
                                                type="datetime-local"
                                                value={formData.transfert.date_reception}
                                                onChange={(e) => updateTransfertData('date_reception', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Responsable expédition
                                            </label>
                                            <select
                                                value={formData.transfert.responsable_expedition_id}
                                                onChange={(e) => updateTransfertData('responsable_expedition_id', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            >
                                                <option value="">Sélectionner le responsable</option>
                                                {utilisateurs.map(utilisateur => (
                                                    <option key={utilisateur.id} value={utilisateur.id}>
                                                        {utilisateur.nom} {utilisateur.prenom}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Responsable réception
                                            </label>
                                            <select
                                                value={formData.transfert.responsable_reception_id}
                                                onChange={(e) => updateTransfertData('responsable_reception_id', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            >
                                                <option value="">Sélectionner le responsable</option>
                                                {utilisateurs.map(utilisateur => (
                                                    <option key={utilisateur.id} value={utilisateur.id}>
                                                        {utilisateur.nom} {utilisateur.prenom}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                État de réception
                                            </label>
                                            <select
                                                value={formData.transfert.etat_reception}
                                                onChange={(e) => updateTransfertData('etat_reception', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            >
                                                {etatsReception.map(etat => (
                                                    <option key={etat} value={etat}>{etat}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Observations de réception
                                        </label>
                                        <textarea
                                            value={formData.transfert.observations_reception}
                                            onChange={(e) => updateTransfertData('observations_reception', e.target.value)}
                                            rows="2"
                                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            placeholder="Observations lors de la réception..."
                                        />
                                    </div>
                                </div>
                            )}

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

export default CycleVieArticles;
