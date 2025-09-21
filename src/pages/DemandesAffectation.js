import React, { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import Select from 'react-select';
import { selectStyles } from '../components/Inventory/inventoryUtils';
import { PencilSquareIcon, TrashIcon, CheckCircleIcon, XMarkIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useNotifications } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';

const emptyLine = { inventaire_id: '', chambre_ids: [], quantite_demandee: 1 };

const DemandesAffectation = () => {
  const { addNotification } = useNotifications();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [demandes, setDemandes] = useState([]);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [approvals, setApprovals] = useState({}); // { ligneId: qty }
  const [viewDemande, setViewDemande] = useState(null);
  const [inventoryOptions, setInventoryOptions] = useState([]);
  const [roomsOptions, setRoomsOptions] = useState([]);
  const [loadingInvOpts, setLoadingInvOpts] = useState(false);
  const [loadingRoomOpts, setLoadingRoomOpts] = useState(false);
  const [form, setForm] = useState({ commentaire: '', lignes: [ { ...emptyLine } ] });

  const fetchLists = async () => {
    try {
      setLoadingInvOpts(true);
      setLoadingRoomOpts(true);
      const [invRes, roomsRes] = await Promise.all([
        api.get('/inventaire/public-options?limit=1000'),
        api.get('/chambres/public-options?limit=1000')
      ]);
      setInventoryOptions((invRes.data.data || []).map(i => ({ value: i.id, label: `${i.nom}${i.code_produit ? ' - ' + i.code_produit : ''}` })));
      setRoomsOptions((roomsRes.data.data || []).map(r => ({ value: r.id, label: `${r.numero}${r.type ? ' - ' + r.type : ''}` })));
    } catch (err) {
      console.error('fetchLists error:', err);
      toast.error("Impossible de charger les options (articles/chambres)");
    }
    finally {
      setLoadingInvOpts(false);
      setLoadingRoomOpts(false);
    }
  };

  const fetchDemandes = async () => {
    try {
      setLoading(true);
      
      // Déterminer si l'utilisateur peut voir toutes les demandes
      const canViewAll = user?.role === 'Superviseur Stock' || user?.role === 'Auditeur';
      
      let endpoint = '/demandes-affectation';
      if (!canViewAll) {
        // Pour les utilisateurs normaux, ajouter un paramètre pour filtrer par utilisateur
        endpoint = `/demandes-affectation?user_id=${user?.id}`;
      }
      
      const res = await api.get(endpoint);
      setDemandes(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors du chargement des demandes");
    } finally {
      setLoading(false);
    }
  };

  const openDetails = async (id) => {
    // Prefer utiliser les données déjà chargées (avec lignes incluses)
    const local = (demandes || []).find(d => d.id === id);
    if (local) {
      setSelectedDemande(local);
      const initLocal = {};
      (local.lignes || []).forEach(l => { initLocal[l.id] = l.quantite_approvee || 0; });
      setApprovals(initLocal);
      return;
    }
    // Sinon fallback API
    try {
      const res = await api.get(`/demandes-affectation/${id}`);
      setSelectedDemande(res.data.data);
      const init = {};
      (res.data.data?.lignes || []).forEach(l => { init[l.id] = l.quantite_approvee || 0; });
      setApprovals(init);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Erreur lors du chargement des détails';
      toast.error(msg);
    }
  };

  const openViewDetails = async (id) => {
    const local = (demandes || []).find(d => d.id === id);
    if (local) {
      setViewDemande(local);
      return;
    }
    try {
      const res = await api.get(`/demandes-affectation/${id}`);
      setViewDemande(res.data.data);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Erreur lors du chargement des détails';
      toast.error(msg);
    }
  };

  const approveLines = async () => {
    if (!selectedDemande) return;
    try {
      const payload = {
        approvals: Object.keys(approvals).map(id => ({ ligne_id: Number(id), quantite_approvee: Number(approvals[id]) || 0 }))
      };
      await api.put(`/demandes-affectation/${selectedDemande.id}/approve-lines`, payload);
      toast.success('Quantités approuvées');
      addNotification({
        title: 'Demande d\'affectation approuvée',
        message: `Demande #${selectedDemande.id} approuvée. Mouvements de stock créés.`,
        type: 'success',
        link: '/demandes-affectation'
      });
      setSelectedDemande(null);
      fetchDemandes();
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'approbation");
    }
  };

  const approveAll = async () => {
    if (!selectedDemande) return;
    const filled = {};
    (selectedDemande.lignes || []).forEach(l => { filled[l.id] = l.quantite_demandee; });
    setApprovals(filled);
    // attendre que le state se mette à jour, puis envoyer
    setTimeout(() => approveLines(), 0);
  };

  const deleteDemande = async (id) => {
    if (!window.confirm('Supprimer cette demande ?')) return;
    try {
      await api.delete(`/demandes-affectation/${id}`);
      toast.success('Demande supprimée');
      addNotification({
        title: 'Demande supprimée',
        message: `Demande #${id} supprimée`,
        type: 'info',
        link: '/demandes-affectation'
      });
      fetchDemandes();
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de la suppression');
    }
  };

  const exportDemandeCSV = (demande) => {
    if (!demande) return;
    const headers = ['demande_id','statut','cree_le','maj_le','article','code_produit','chambre','quantite_demandee','quantite_approvee'];
    const rows = (demande.lignes || []).map(l => [
      demande.id,
      demande.statut,
      new Date(demande.created_at).toISOString(),
      new Date(demande.updated_at).toISOString(),
      l.inventaire?.nom || '',
      l.inventaire?.code_produit || '',
      l.chambre ? `${l.chambre.numero} (${l.chambre.type})` : '',
      l.quantite_demandee,
      l.quantite_approvee ?? 0
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `demande_${demande.id}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Export CSV généré');
  };

  const exportDemandePDF = (demande) => {
    if (!demande) return;
    const ts = new Date().toLocaleString('fr-FR');
    const demandeurLine = demande.demandeur ? `Demandeur: ${demande.demandeur.prenom} ${demande.demandeur.nom}${demande.demandeur.Departement ? ' • Département: ' + demande.demandeur.Departement.nom : ''}${demande.demandeur.SousDepartement ? ' • Sous-département: ' + demande.demandeur.SousDepartement.nom : ''}` : '';
    const rowsHtml = (demande.lignes || []).map(l => `
      <tr>
        <td>${l.inventaire?.nom || ''}${l.inventaire?.code_produit ? ` [${l.inventaire.code_produit}]` : ''}</td>
        <td>${l.chambre ? `${l.chambre.numero} (${l.chambre.type})` : '-'}</td>
        <td style="text-align:right;">${l.quantite_demandee}</td>
        <td style="text-align:right;">${l.quantite_approvee ?? 0}</td>
      </tr>
    `).join('');
    const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8" />
      <title>Demande ${demande.id} - ${ts}</title>
      <style>
        body{font-family:Arial, Helvetica, sans-serif; color:#111827; padding:24px}
        h1{margin:0 0 6px 0; font-size:20px}
        .meta{color:#6b7280; margin-bottom:16px; font-size:12px}
        table{border-collapse:collapse; width:100%}
        th,td{border:1px solid #e5e7eb; padding:8px; font-size:12px}
        th{background:#f9fafb; text-align:left}
      </style></head><body>
      <h1>Détails de la demande #${demande.id}</h1>
      <div class="meta">Statut: ${demande.statut} • Créée le ${new Date(demande.created_at).toLocaleString('fr-FR')} • MAJ le ${new Date(demande.updated_at).toLocaleString('fr-FR')} • Généré le ${ts}</div>
      ${demandeurLine ? `<div class=\"meta\">${demandeurLine}</div>` : ''}
      <table><thead><tr><th>Article</th><th>Chambre</th><th>Demandée</th><th>Approuvée</th></tr></thead><tbody>${rowsHtml}</tbody></table>
      </body></html>`;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 300);
  };

  useEffect(() => {
    fetchLists();
    fetchDemandes();
  }, []);

  const addLine = () => setForm(prev => ({ ...prev, lignes: [...prev.lignes, { ...emptyLine }] }));
  const removeLine = (idx) => setForm(prev => ({ ...prev, lignes: prev.lignes.filter((_, i) => i !== idx) }));

  const updateLine = (idx, key, value) => {
    setForm(prev => ({
      ...prev,
      lignes: prev.lignes.map((l, i) => i === idx ? { ...l, [key]: value } : l)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      // Assainir les lignes et filtrer celles incomplètes
      const cleanedLines = form.lignes
        .map(l => {
          const inventaireId = Number(l.inventaire_id);
          const quantite = Number(l.quantite_demandee);
          const chambreIds = Array.isArray(l.chambre_ids) ? l.chambre_ids.map(Number).filter(n => Number.isFinite(n)) : [];
          const base = {
            inventaire_id: inventaireId,
            quantite_demandee: Number.isFinite(quantite) && quantite > 0 ? quantite : 1
          };
          if (chambreIds.length > 0) base.chambre_ids = chambreIds;
          return base;
        })
        .filter(l => Number.isFinite(l.inventaire_id) && l.inventaire_id > 0);

      if (cleanedLines.length === 0) {
        toast.error('Veuillez ajouter au moins une ligne valide (article et quantité)');
        setSaving(false);
        return;
      }

      const payload = {
        commentaire: form.commentaire,
        lignes: cleanedLines
      };
      await api.post('/demandes-affectation', payload);
      toast.success('Demande créée');
      addNotification({
        title: 'Nouvelle demande d\'affectation',
        message: `Votre demande a été soumise (${cleanedLines.length} article(s))`,
        type: 'info',
        link: '/demandes-affectation'
      });
      setForm({ commentaire: '', lignes: [ { ...emptyLine } ] });
      fetchDemandes();
    } catch (err) {
      console.error('Create demande error:', err.response?.data || err);
      const msg = err.response?.data?.message || err.response?.data?.error || 'Erreur lors de la création';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bons de Prelèvement</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Soumettre une demande d'affectation d'articles à des chambres/espaces</p>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <div className="card-body space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Commentaire</label>
            <textarea
              className="form-input w-full"
              rows={2}
              value={form.commentaire}
              onChange={e => setForm(prev => ({ ...prev, commentaire: e.target.value }))}
            />
          </div>

          <div className="space-y-3">
            {form.lignes.map((l, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                <div>
                  <label className="block text-sm font-medium mb-1">Article</label>
                  <Select
                    styles={selectStyles}
                    options={inventoryOptions}
                    value={inventoryOptions.find(o => o.value === l.inventaire_id) || null}
                    onChange={(opt) => updateLine(idx, 'inventaire_id', opt ? opt.value : '')}
                    placeholder="Sélectionner"
                    isLoading={loadingInvOpts}
                    onMenuOpen={() => { if (inventoryOptions.length === 0) fetchLists(); }}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    noOptionsMessage={() => "Aucun article"}
                    isClearable
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Chambres (optionnel)</label>
                  <Select
                    styles={selectStyles}
                    isMulti
                    options={roomsOptions}
                    value={roomsOptions.filter(o => (l.chambre_ids || []).includes(o.value))}
                    onChange={(opts) => updateLine(idx, 'chambre_ids', (opts || []).map(o => o.value))}
                    placeholder="Sélectionner des chambres/espaces"
                    isLoading={loadingRoomOpts}
                    onMenuOpen={() => { if (roomsOptions.length === 0) fetchLists(); }}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    noOptionsMessage={() => "Aucune chambre/espace"}
                    closeMenuOnSelect={false}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Quantité demandée</label>
                  <input
                    type="number"
                    min={1}
                    className="form-input w-full"
                    value={l.quantite_demandee}
                    onChange={e => updateLine(idx, 'quantite_demandee', e.target.value)}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => addLine()} className="btn-secondary w-full">Ajouter</button>
                  {form.lignes.length > 1 && (
                    <button type="button" onClick={() => removeLine(idx)} className="btn-danger w-full">Supprimer</button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Envoi...' : 'Soumettre la demande'}
            </button>
          </div>
        </div>
      </form>

      <div className="card">
        <div className="card-body">
          <h2 className="text-lg font-semibold mb-3">
            {(user?.role === 'Superviseur Stock' || user?.role === 'Auditeur') ? 'Toutes les demandes' : 'Mes demandes'}
          </h2>
          {loading ? (
            <div className="py-8 flex justify-center"><LoadingSpinner /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Créée le</th>
                    {(user?.role === 'Superviseur Stock' || user?.role === 'Auditeur') && (
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Demandeur</th>
                    )}
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Articles</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {demandes.map(d => (
                    <tr key={d.id}>
                      <td className="px-4 py-2 text-sm">{d.id}</td>
                      <td className="px-4 py-2 text-sm">{d.statut}</td>
                      <td className="px-4 py-2 text-sm">{new Date(d.created_at).toLocaleString('fr-FR')}</td>
                      {(user?.role === 'Superviseur Stock' || user?.role === 'Auditeur') && (
                        <td className="px-4 py-2 text-sm">
                          {d.demandeur ? `${d.demandeur.prenom} ${d.demandeur.nom}` : 'N/A'}
                        </td>
                      )}
                      <td className="px-4 py-2 text-sm">
                        {(d.lignes || []).map(l => (
                          <div key={l.id} className="text-xs text-gray-700 dark:text-gray-300">
                            {l.inventaire?.code_produit ? `[${l.inventaire.code_produit}] ` : ''}{l.inventaire?.nom} — demandé: {l.quantite_demandee}, approuvé: {l.quantite_approvee}{l.chambre ? ` → chambre ${l.chambre.numero}` : ''}
                          </div>
                        ))}
                      </td>
                      <td className="px-4 py-2 text-sm text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => openViewDetails(d.id)}
                            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-2 py-1 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                            title="Détails"
                          >
                            <EyeIcon className="h-5 w-5" />
                            <span className="sr-only">Détails</span>
                          </button>
                          {d.statut !== 'approuvee' && (
                            <button
                              onClick={() => openDetails(d.id)}
                              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-2 py-1 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                              title="Mettre à jour la demande"
                            >
                              <PencilSquareIcon className="h-5 w-5" />
                              <span className="sr-only">Mettre à jour</span>
                            </button>
                          )}
                          {d.statut !== 'approuvee' && (user?.role === 'Superviseur Stock' || user?.role === 'Auditeur') && (
                            <button
                              onClick={() => deleteDemande(d.id)}
                              className="inline-flex items-center justify-center rounded-md border border-red-300 bg-red-50 px-2 py-1 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
                              title="Supprimer la demande"
                            >
                              <TrashIcon className="h-5 w-5" />
                              <span className="sr-only">Supprimer</span>
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

      {selectedDemande && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Mettre à jour la demande #{selectedDemande.id}</h3>
              <button onClick={() => setSelectedDemande(null)} className="text-gray-500 hover:text-gray-700" title="Fermer">
                <XMarkIcon className="h-6 w-6" />
                <span className="sr-only">Fermer</span>
              </button>
            </div>
            <div className="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-300">
              <div><span className="font-medium">Statut:</span> {selectedDemande.statut}</div>
              <div><span className="font-medium">Créée le:</span> {new Date(selectedDemande.created_at).toLocaleString('fr-FR')}</div>
              {selectedDemande.demandeur && (
                <div>
                  <span className="font-medium">Demandeur:</span> {selectedDemande.demandeur.prenom} {selectedDemande.demandeur.nom}
                  {selectedDemande.demandeur.Departement && (
                    <> • <span className="font-medium">Département:</span> {selectedDemande.demandeur.Departement.nom}</>
                  )}
                  {selectedDemande.demandeur.SousDepartement && (
                    <> • <span className="font-medium">Sous-département:</span> {selectedDemande.demandeur.SousDepartement.nom}</>
                  )}
                </div>
              )}
              {selectedDemande.commentaire && (
                <div><span className="font-medium">Commentaire:</span> {selectedDemande.commentaire}</div>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Article</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Chambre</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Demandée</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Approuvée</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {(selectedDemande.lignes || []).map(l => (
                    <tr key={l.id}>
                      <td className="px-4 py-2 text-sm">{l.inventaire?.nom}{l.inventaire?.code_produit ? ` [${l.inventaire.code_produit}]` : ''}</td>
                      <td className="px-4 py-2 text-sm">{l.chambre ? `${l.chambre.numero} (${l.chambre.type})` : '-'}</td>
                      <td className="px-4 py-2 text-sm text-right">{l.quantite_demandee}</td>
                      <td className="px-4 py-2 text-sm text-right">
                        <input
                          type="number"
                          min={0}
                          className="form-input w-24 text-right"
                          value={approvals[l.id] ?? 0}
                          onChange={e => setApprovals(prev => ({ ...prev, [l.id]: e.target.value }))}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setSelectedDemande(null)} className="btn-secondary" title="Fermer">
                <XMarkIcon className="h-5 w-5 inline" />
                <span className="ml-1">Fermer</span>
              </button>
              <button onClick={approveAll} className="btn-secondary" title="Approuver toute la demande">
                <CheckCircleIcon className="h-5 w-5 inline" />
                <span className="ml-1">Approuver tout</span>
              </button>
              <button onClick={approveLines} className="btn-primary" title="Enregistrer les quantités approuvées">Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      {viewDemande && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Détails demande #{viewDemande.id}</h3>
              <button onClick={() => setViewDemande(null)} className="text-gray-500 hover:text-gray-700" title="Fermer">
                <XMarkIcon className="h-6 w-6" />
                <span className="sr-only">Fermer</span>
              </button>
            </div>

            {/* Tracker du circuit */}
            <div className="mb-5">
              {(() => {
                const steps = ['en_attente', 'approuvee', 'rejetee', 'annulee'];
                const labels = {
                  en_attente: 'Soumise',
                  approuvee: 'Approuvée',
                  rejetee: 'Rejetée',
                  annulee: 'Annulée'
                };
                const current = viewDemande.statut;
                return (
                  <div className="flex items-center justify-between">
                    {steps.map((s, i) => (
                      <div key={s} className="flex-1 flex items-center">
                        <div className={`flex items-center justify-center h-8 px-3 rounded-full text-sm font-medium ${
                          current === s || (current === 'approuvee' && s === 'en_attente') ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {labels[s]}
                        </div>
                        {i < steps.length - 1 && <div className="flex-1 h-px bg-gray-300 mx-2" />}
                      </div>
                    ))}
                  </div>
                );
              })()}
              <div className="text-xs text-gray-500 mt-3 space-y-1">
                <div>Créée le {new Date(viewDemande.created_at).toLocaleString('fr-FR')}</div>
                <div>Dernière mise à jour {new Date(viewDemande.updated_at).toLocaleString('fr-FR')}</div>
                {viewDemande.demandeur && (
                  <div>
                    Demandeur: {viewDemande.demandeur.prenom} {viewDemande.demandeur.nom}
                    {viewDemande.demandeur.Departement && (
                      <> • Département: {viewDemande.demandeur.Departement.nom}</>
                    )}
                    {viewDemande.demandeur.SousDepartement && (
                      <> • Sous-département: {viewDemande.demandeur.SousDepartement.nom}</>
                    )}
                  </div>
                )}
                {/* Historique simple si dispo */}
                {(viewDemande.history || []).length > 0 && (
                  <div className="mt-2">
                    <div className="font-medium text-gray-600 mb-1">Historique</div>
                    <ul className="list-disc ml-5 space-y-0.5">
                      {viewDemande.history.map((h, idx) => (
                        <li key={idx}>{h.label}: {new Date(h.timestamp).toLocaleString('fr-FR')}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Lignes en lecture seule */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Article</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Chambre</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Demandée</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Approuvée</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {(viewDemande.lignes || []).map(l => (
                    <tr key={l.id}>
                      <td className="px-4 py-2 text-sm">{l.inventaire?.nom}{l.inventaire?.code_produit ? ` [${l.inventaire.code_produit}]` : ''}</td>
                      <td className="px-4 py-2 text-sm">{l.chambre ? `${l.chambre.numero} (${l.chambre.type})` : '-'}</td>
                      <td className="px-4 py-2 text-sm text-right">{l.quantite_demandee}</td>
                      <td className="px-4 py-2 text-sm text-right">{l.quantite_approvee ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div className="flex gap-2">
                <button onClick={() => exportDemandeCSV(viewDemande)} className="btn-secondary" title="Exporter CSV">CSV</button>
                <button onClick={() => exportDemandePDF(viewDemande)} className="btn-secondary" title="Exporter PDF">PDF</button>
              </div>
              <button onClick={() => setViewDemande(null)} className="btn-secondary" title="Fermer">
                <XMarkIcon className="h-5 w-5 inline" />
                <span className="ml-1">Fermer</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemandesAffectation;


