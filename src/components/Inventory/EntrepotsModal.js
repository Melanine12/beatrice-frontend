import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';

const EntrepotsModal = ({ isOpen, onClose, entrepot = null, onRefresh }) => {
  const [formData, setFormData] = useState({
    nom: '',
    type: 'entrepôt',
    description: '',
    adresse: '',
    ville: '',
    code_postal: '',
    pays: 'France',
    capacite: '',
    utilisation: '',
    statut: 'actif',
    responsable: '',
    telephone: '',
    email: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (entrepot) {
      setFormData({
        nom: entrepot.nom || '',
        type: entrepot.type || 'entrepôt',
        description: entrepot.description || '',
        adresse: entrepot.adresse || '',
        ville: entrepot.ville || '',
        code_postal: entrepot.code_postal || '',
        pays: entrepot.pays || 'France',
        capacite: entrepot.capacite || '',
        utilisation: entrepot.utilisation || '',
        statut: entrepot.statut || 'actif',
        responsable: entrepot.responsable || '',
        telephone: entrepot.telephone || '',
        email: entrepot.email || '',
        notes: entrepot.notes || ''
      });
      setIsEdit(true);
    } else {
      setFormData({
        nom: '',
        type: 'entrepôt',
        description: '',
        adresse: '',
        ville: '',
        code_postal: '',
        pays: 'France',
        capacite: '',
        utilisation: '',
        statut: 'actif',
        responsable: '',
        telephone: '',
        email: '',
        notes: ''
      });
      setIsEdit(false);
    }
  }, [entrepot]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        await api.put(`/entrepots/${entrepot.id}`, formData);
        toast.success('Entrepôt mis à jour avec succès');
      } else {
        await api.post('/entrepots', formData);
        toast.success('Entrepôt créé avec succès');
      }
      
      onRefresh();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      const message = error.response?.data?.error || 'Erreur lors de la sauvegarde';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet entrepôt ?')) {
      return;
    }

    setLoading(true);
    try {
      await api.delete(`/entrepots/${entrepot.id}`);
      toast.success('Entrepôt supprimé avec succès');
      onRefresh();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      const message = error.response?.data?.error || 'Erreur lors de la suppression';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {isEdit ? 'Modifier l\'entrepôt' : 'Nouvel entrepôt'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom *
              </label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="entrepôt">Entrepôt</option>
                <option value="dépôt">Dépôt</option>
                <option value="magasin">Magasin</option>
                <option value="zone_stockage">Zone de stockage</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut *
              </label>
              <select
                name="statut"
                value={formData.statut}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
                <option value="maintenance">Maintenance</option>
                <option value="construction">Construction</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Responsable
              </label>
              <input
                type="text"
                name="responsable"
                value={formData.responsable}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacité (m³)
              </label>
              <input
                type="number"
                name="capacite"
                value={formData.capacite}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Utilisation (%)
              </label>
              <input
                type="number"
                name="utilisation"
                value={formData.utilisation}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ville
              </label>
              <input
                type="text"
                name="ville"
                value={formData.ville}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Code postal
              </label>
              <input
                type="text"
                name="code_postal"
                value={formData.code_postal}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pays
              </label>
              <input
                type="text"
                name="pays"
                value={formData.pays}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresse
            </label>
            <textarea
              name="adresse"
              value={formData.adresse}
              onChange={handleInputChange}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            {isEdit && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                Supprimer
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Sauvegarde...' : (isEdit ? 'Mettre à jour' : 'Créer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EntrepotsModal; 