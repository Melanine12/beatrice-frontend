import React, { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import Select from 'react-select';
import { selectStyles } from '../components/Inventory/inventoryUtils';
import { PencilSquareIcon, TrashIcon, CheckCircleIcon, XMarkIcon, EyeIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useNotifications } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';

const emptyLigneLibelle = { libelle: '', montant: '' };
const emptyLigneArticle = { inventaire_id: '', quantite: 1, prix_unitaire: '' };

const DemandesFonds = () => {
  const { addNotification } = useNotifications();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [demandes, setDemandes] = useState([]);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [viewDemande, setViewDemande] = useState(null);
  const [inventoryOptions, setInventoryOptions] = useState([]);
  const [loadingInvOpts, setLoadingInvOpts] = useState(false);
  
  // Form state
  const [form, setForm] = useState({
    type: 'demande_fonds',
    motif: '',
    commentaire: '',
    devise: 'EUR',
    lignes: [{ ...emptyLigneLibelle }]
  });

  const isSuperviseurStock = user?.role === 'Superviseur';

  const fetchInventoryOptions = async () => {
    try {
      setLoadingInvOpts(true);
      const res = await api.get('/inventaire/public-options?limit=1000');
      setInventoryOptions((res.data.data || []).map(i => ({ 
        value: i.id, 
        label: `${i.nom}${i.code_produit ? ' - ' + i.code_produit : ''}`,
        prix_unitaire: i.prix_unitaire || 0
      })));
    } catch (err) {
      console.error('fetchInventoryOptions error:', err);
      toast.error("Impossible de charger les articles");
    } finally {
      setLoadingInvOpts(false);
    }
  };

  const fetchDemandes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/demandes-fonds');
      setDemandes(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors du chargement des demandes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryOptions();
    fetchDemandes();
  }, []);

  // Gestion du type de formulaire et de la devise
  useEffect(() => {
    if (form.type === 'bon_achat') {
      setForm(prev => ({
        ...prev,
        lignes: [{ ...emptyLigneArticle, devise: prev.devise }]
      }));
    } else {
      setForm(prev => ({
        ...prev,
        lignes: [{ ...emptyLigneLibelle, devise: prev.devise }]
      }));
    }
  }, [form.type, form.devise]);

  const addLigne = () => {
    const newLigne = form.type === 'bon_achat' ? { ...emptyLigneArticle } : { ...emptyLigneLibelle };
    setForm(prev => ({ ...prev, lignes: [...prev.lignes, newLigne] }));
  };

  const removeLigne = (idx) => {
    setForm(prev => ({ ...prev, lignes: prev.lignes.filter((_, i) => i !== idx) }));
  };

  const updateLigne = (idx, key, value) => {
    setForm(prev => ({
      ...prev,
      lignes: prev.lignes.map((l, i) => i === idx ? { ...l, [key]: value } : l)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      // Validation des lignes
      const lignesValides = form.lignes.filter(ligne => {
        if (form.type === 'bon_achat') {
          return ligne.inventaire_id && ligne.quantite > 0 && ligne.prix_unitaire > 0;
        } else {
          return ligne.libelle.trim() && ligne.montant > 0;
        }
      });

      if (lignesValides.length === 0) {
        toast.error('Veuillez ajouter au moins une ligne valide');
        return;
      }

      const payload = {
        type: form.type,
        motif: form.motif,
        commentaire: form.commentaire,
        devise: form.devise,
        lignes: lignesValides
      };

      await api.post('/demandes-fonds', payload);
      toast.success('Demande de fonds créée avec succès');
      
      addNotification({
        title: 'Nouvelle demande de fonds',
        message: `Votre demande a été soumise (${lignesValides.length} ligne(s))`,
        type: 'info',
        link: '/demandes-fonds'
      });

      // Reset form
      setForm({
        type: 'demande_fonds',
        motif: '',
        commentaire: '',
        devise: 'EUR',
        lignes: [{ ...emptyLigneLibelle }]
      });

      fetchDemandes();
    } catch (err) {
      console.error('Create demande error:', err.response?.data || err);
      const msg = err.response?.data?.message || 'Erreur lors de la création';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const openDetails = async (id) => {
    try {
      const res = await api.get(`/demandes-fonds/${id}`);
      setSelectedDemande(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors du chargement des détails");
    }
  };

  const openViewDetails = async (id) => {
    try {
      const res = await api.get(`/demandes-fonds/${id}`);
      setViewDemande(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors du chargement des détails");
    }
  };

  const deleteDemande = async (id) => {
    if (!window.confirm('Supprimer cette demande ?')) return;
    
    try {
      await api.delete(`/demandes-fonds/${id}`);
      toast.success('Demande supprimée');
      addNotification({
        title: 'Demande supprimée',
        message: `Demande #${id} supprimée`,
        type: 'info',
        link: '/demandes-fonds'
      });
      fetchDemandes();
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de la suppression');
    }
  };

  const updateDemande = async () => {
    if (!selectedDemande) return;
    
    try {
      setSaving(true);
      
      const lignesValides = selectedDemande.lignes.filter(ligne => {
        if (selectedDemande.type === 'bon_achat') {
          return ligne.inventaire_id && ligne.quantite > 0 && ligne.prix_unitaire > 0;
        } else {
          return ligne.libelle.trim() && ligne.montant > 0;
        }
      });

      if (lignesValides.length === 0) {
        toast.error('Veuillez ajouter au moins une ligne valide');
        return;
      }

      const payload = {
        motif: selectedDemande.motif,
        commentaire: selectedDemande.commentaire,
        lignes: lignesValides
      };

      await api.put(`/demandes-fonds/${selectedDemande.id}`, payload);
      toast.success('Demande mise à jour');
      setSelectedDemande(null);
      fetchDemandes();
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (id, newStatus, commentaire = '') => {
    try {
      console.log('🔄 Tentative de changement de statut:', { id, newStatus, commentaire });
      
      const response = await api.put(`/demandes-fonds/${id}/status`, {
        statut: newStatus,
        commentaire_superviseur: commentaire
      });
      
      console.log('✅ Réponse du serveur:', response.data);
      
      toast.success(`Demande ${newStatus === 'approuvee' ? 'approuvée' : 'rejetée'}`);
      addNotification({
        title: `Demande ${newStatus === 'approuvee' ? 'approuvée' : 'rejetée'}`,
        message: `Demande #${id} ${newStatus === 'approuvee' ? 'approuvée' : 'rejetée'}`,
        type: newStatus === 'approuvee' ? 'success' : 'warning',
        link: '/demandes-fonds'
      });
      
      fetchDemandes();
    } catch (err) {
      console.error('❌ Erreur lors du changement de statut:', err);
      console.error('Status:', err.response?.status);
      console.error('Data:', err.response?.data);
      console.error('Message:', err.message);
      
      // Vérifier si c'est une erreur d'authentification
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error("Erreur d'authentification. Vérifiez vos permissions.");
      } else {
        toast.error("Erreur lors du changement de statut");
      }
    }
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'en_attente': return 'bg-yellow-100 text-yellow-800';
      case 'approuvee': return 'bg-green-100 text-green-800';
      case 'rejetee': return 'bg-red-100 text-red-800';
      case 'annulee': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (statut) => {
    switch (statut) {
      case 'en_attente': return 'En attente';
      case 'approuvee': return 'Approuvée';
      case 'rejetee': return 'Rejetée';
      case 'annulee': return 'Annulée';
      default: return statut;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Demandes de Fonds</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {isSuperviseurStock 
            ? 'Créer des bons d\'achat ou des demandes de fonds' 
            : 'Soumettre des demandes de fonds pour validation'
          }
        </p>
      </div>

      {/* Formulaire de création */}
      <form onSubmit={handleSubmit} className="card">
        <div className="card-body space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type de demande</label>
              <select
                className="form-select w-full"
                value={form.type}
                onChange={e => setForm(prev => ({ ...prev, type: e.target.value }))}
                disabled={!isSuperviseurStock}
              >
                <option value="demande_fonds">Demande de fonds</option>
                {isSuperviseurStock && <option value="bon_achat">Bon d'achat</option>}
              </select>
              {/* Warning pour utilisateurs non-superviseurs */}
              {!isSuperviseurStock && (
                <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-2 py-1 mt-1">
                  ⚠️ Seuls les superviseurs peuvent créer des bons d'achat. Vous pouvez uniquement créer des demandes de fonds.
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Devise</label>
              <select
                className="form-select w-full"
                value={form.devise}
                onChange={e => setForm(prev => ({ ...prev, devise: e.target.value }))}
              >
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="FC">FC (Franc Congolais)</option>
              </select>
            </div>
            
            {form.type === 'demande_fonds' && (
              <div>
                <label className="block text-sm font-medium mb-1">Motif</label>
                <input
                  type="text"
                  className="form-input w-full"
                  value={form.motif}
                  onChange={e => setForm(prev => ({ ...prev, motif: e.target.value }))}
                  placeholder="Motif de la demande"
                  required
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Commentaire</label>
            <textarea
              className="form-input w-full"
              rows={2}
              value={form.commentaire}
              onChange={e => setForm(prev => ({ ...prev, commentaire: e.target.value }))}
              placeholder="Commentaire additionnel"
            />
          </div>

          {/* Lignes du formulaire */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">
                {form.type === 'bon_achat' ? 'Articles à commander' : 'Libellés et montants'}
              </h3>
              <button
                type="button"
                onClick={addLigne}
                className="btn-secondary flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                Ajouter une ligne
              </button>
            </div>

            {form.lignes.map((ligne, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end border p-3 rounded-lg">
                {form.type === 'bon_achat' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Article</label>
                      <Select
                        styles={selectStyles}
                        options={inventoryOptions}
                        value={inventoryOptions.find(o => o.value === ligne.inventaire_id) || null}
                        onChange={(opt) => {
                          updateLigne(idx, 'inventaire_id', opt ? opt.value : '');
                          if (opt && opt.prix_unitaire) {
                            updateLigne(idx, 'prix_unitaire', opt.prix_unitaire);
                          }
                        }}
                        placeholder="Sélectionner un article"
                        isLoading={loadingInvOpts}
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        noOptionsMessage={() => "Aucun article"}
                        isClearable
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Quantité</label>
                      <input
                        type="number"
                        min={1}
                        className="form-input w-full"
                        value={ligne.quantite}
                        onChange={e => updateLigne(idx, 'quantite', parseInt(e.target.value) || 1)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Prix unitaire</label>
                      <input
                        type="number"
                        min={0.01}
                        step={0.01}
                        className="form-input w-full"
                        value={ligne.prix_unitaire}
                        onChange={e => updateLigne(idx, 'prix_unitaire', parseFloat(e.target.value) || 0)}
                        required
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Libellé</label>
                      <input
                        type="text"
                        className="form-input w-full"
                        value={ligne.libelle}
                        onChange={e => updateLigne(idx, 'libelle', e.target.value)}
                        placeholder="Description de la dépense"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Montant</label>
                      <input
                        type="number"
                        min={0.01}
                        step={0.01}
                        className="form-input w-full"
                        value={ligne.montant}
                        onChange={e => updateLigne(idx, 'montant', parseFloat(e.target.value) || 0)}
                        required
                      />
                    </div>
                  </>
                )}
                
                <div className="flex gap-2">
                  {form.lignes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLigne(idx)}
                      className="btn-danger w-full"
                    >
                      Supprimer
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Total calculé */}
            <div className="text-right">
              <span className="text-lg font-semibold">
                Total: {form.lignes.reduce((total, ligne) => {
                  if (form.type === 'bon_achat') {
                    return total + (ligne.prix_unitaire * ligne.quantite);
                  } else {
                    return total + (ligne.montant || 0);
                  }
                }, 0).toFixed(2)} {form.devise === 'EUR' ? '€' : form.devise === 'USD' ? '$' : 'FC'}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Envoi...' : 'Soumettre la demande'}
            </button>
          </div>
        </div>
      </form>

      {/* Liste des demandes */}
      <div className="card">
        <div className="card-body">
          <h2 className="text-lg font-semibold mb-3">Mes demandes</h2>
          {loading ? (
            <div className="py-8 flex justify-center"><LoadingSpinner /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Créée le</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {demandes.map(d => (
                    <tr key={d.id}>
                      <td className="px-4 py-2 text-sm">{d.id}</td>
                      <td className="px-4 py-2 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          d.type === 'bon_achat' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {d.type === 'bon_achat' ? 'Bon d\'achat' : 'Demande de fonds'}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(d.statut)}`}>
                          {getStatusLabel(d.statut)}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm font-medium">
                        {d.montant_total} {d.devise === 'EUR' ? '€' : d.devise === 'USD' ? '$' : 'FC'}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {new Date(d.created_at).toLocaleString('fr-FR')}
                      </td>
                      <td className="px-4 py-2 text-sm text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => openViewDetails(d.id)}
                            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-2 py-1 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                            title="Détails"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          
                          {d.statut === 'en_attente' && (
                            <>
                              <button
                                onClick={() => openDetails(d.id)}
                                className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-2 py-1 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                title="Modifier"
                              >
                                <PencilSquareIcon className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => deleteDemande(d.id)}
                                className="inline-flex items-center justify-center rounded-md border border-red-300 bg-red-50 px-2 py-1 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
                                title="Supprimer"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </>
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

      {/* Modal de modification */}
      {selectedDemande && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-4xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Modifier la demande #{selectedDemande.id}</h3>
              <button onClick={() => setSelectedDemande(null)} className="text-gray-500 hover:text-gray-700">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Motif</label>
                  <input
                    type="text"
                    className="form-input w-full"
                    value={selectedDemande.motif || ''}
                    onChange={e => setSelectedDemande(prev => ({ ...prev, motif: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Commentaire</label>
                  <input
                    type="text"
                    className="form-input w-full"
                    value={selectedDemande.commentaire || ''}
                    onChange={e => setSelectedDemande(prev => ({ ...prev, commentaire: e.target.value }))}
                  />
                </div>
              </div>

              {/* Lignes modifiables */}
              <div className="space-y-3">
                <h4 className="font-medium">Lignes</h4>
                {selectedDemande.lignes.map((ligne, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end border p-3 rounded-lg">
                    {selectedDemande.type === 'bon_achat' ? (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-1">Article</label>
                          <Select
                            styles={selectStyles}
                            options={inventoryOptions}
                            value={inventoryOptions.find(o => o.value === ligne.inventaire_id) || null}
                            onChange={(opt) => {
                              const newLignes = [...selectedDemande.lignes];
                              newLignes[idx] = { ...ligne, inventaire_id: opt ? opt.value : '' };
                              setSelectedDemande(prev => ({ ...prev, lignes: newLignes }));
                            }}
                            placeholder="Sélectionner un article"
                            isLoading={loadingInvOpts}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            noOptionsMessage={() => "Aucun article"}
                            isClearable
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Quantité</label>
                          <input
                            type="number"
                            min={1}
                            className="form-input w-full"
                            value={ligne.quantite || 1}
                            onChange={e => {
                              const newLignes = [...selectedDemande.lignes];
                              newLignes[idx] = { ...ligne, quantite: parseInt(e.target.value) || 1 };
                              setSelectedDemande(prev => ({ ...prev, lignes: newLignes }));
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Prix unitaire</label>
                          <input
                            type="number"
                            min={0.01}
                            step={0.01}
                            className="form-input w-full"
                            value={ligne.prix_unitaire || ''}
                            onChange={e => {
                              const newLignes = [...selectedDemande.lignes];
                              newLignes[idx] = { ...ligne, prix_unitaire: parseFloat(e.target.value) || 0 };
                              setSelectedDemande(prev => ({ ...prev, lignes: newLignes }));
                            }}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-1">Libellé</label>
                          <input
                            type="text"
                            className="form-input w-full"
                            value={ligne.libelle || ''}
                            onChange={e => {
                              const newLignes = [...selectedDemande.lignes];
                              newLignes[idx] = { ...ligne, libelle: e.target.value };
                              setSelectedDemande(prev => ({ ...prev, lignes: newLignes }));
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Montant</label>
                          <input
                            type="number"
                            min={0.01}
                            step={0.01}
                            className="form-input w-full"
                            value={ligne.montant || ''}
                            onChange={e => {
                              const newLignes = [...selectedDemande.lignes];
                              newLignes[idx] = { ...ligne, montant: parseFloat(e.target.value) || 0 };
                              setSelectedDemande(prev => ({ ...prev, lignes: newLignes }));
                            }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setSelectedDemande(null)} className="btn-secondary">
                Annuler
              </button>
              <button onClick={updateDemande} disabled={saving} className="btn-primary">
                {saving ? 'Mise à jour...' : 'Mettre à jour'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de visualisation */}
      {viewDemande && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-4xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Détails demande #{viewDemande.id}</h3>
              <button onClick={() => setViewDemande(null)} className="text-gray-500 hover:text-gray-700">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Type:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    viewDemande.type === 'bon_achat' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {viewDemande.type === 'bon_achat' ? 'Bon d\'achat' : 'Demande de fonds'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Statut:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(viewDemande.statut)}`}>
                    {getStatusLabel(viewDemande.statut)}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Montant total:</span>
                  <span className="ml-2 font-semibold">
                    {viewDemande.montant_total} {viewDemande.devise === 'EUR' ? '€' : viewDemande.devise === 'USD' ? '$' : 'FC'}
                  </span>
                </div>
              </div>

              {viewDemande.motif && (
                <div>
                  <span className="font-medium">Motif:</span>
                  <span className="ml-2">{viewDemande.motif}</span>
                </div>
              )}

              {viewDemande.commentaire && (
                <div>
                  <span className="font-medium">Commentaire:</span>
                  <span className="ml-2">{viewDemande.commentaire}</span>
                </div>
              )}

              <div>
                <h4 className="font-medium mb-2">Lignes</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                      <tr>
                        {viewDemande.type === 'bon_achat' ? (
                          <>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Article</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Quantité</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Prix unitaire</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                          </>
                        ) : (
                          <>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Libellé</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Montant</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {viewDemande.lignes.map((ligne, idx) => (
                        <tr key={idx}>
                          {viewDemande.type === 'bon_achat' ? (
                            <>
                              <td className="px-4 py-2 text-sm">
                                {ligne.inventaire?.nom}
                                {ligne.inventaire?.code_produit && ` [${ligne.inventaire.code_produit}]`}
                              </td>
                              <td className="px-4 py-2 text-sm text-right">{ligne.quantite}</td>
                              <td className="px-4 py-2 text-sm text-right">{ligne.prix_unitaire} €</td>
                              <td className="px-4 py-2 text-sm text-right font-medium">
                                {(ligne.prix_unitaire * ligne.quantite).toFixed(2)} {viewDemande.devise === 'EUR' ? '€' : viewDemande.devise === 'USD' ? '$' : 'FC'}
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="px-4 py-2 text-sm">{ligne.libelle}</td>
                              <td className="px-4 py-2 text-sm text-right font-medium">
                                {ligne.montant} {viewDemande.devise === 'EUR' ? '€' : viewDemande.devise === 'USD' ? '$' : 'FC'}
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Actions pour superviseurs */}
              {user?.role === 'Superviseur' && viewDemande.statut === 'en_attente' && (
                <div className="flex gap-2 pt-4 border-t">
                  <button
                    onClick={() => changeStatus(viewDemande.id, 'approuvee')}
                    className="btn-success"
                  >
                    <CheckCircleIcon className="h-5 w-5 inline mr-2" />
                    Approuver
                  </button>
                  <button
                    onClick={() => changeStatus(viewDemande.id, 'rejetee')}
                    className="btn-danger"
                  >
                    <XMarkIcon className="h-5 w-5 inline mr-2" />
                    Rejeter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemandesFonds;
