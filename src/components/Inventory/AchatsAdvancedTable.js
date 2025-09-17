import React, { useState } from 'react';
import { 
  PencilIcon, 
  ShoppingCartIcon, 
  DocumentIcon,
  EyeIcon,
  TrashIcon,
  PlusIcon,
  BuildingStorefrontIcon,
  CubeIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

const AchatsAdvancedTable = ({ achats, onEdit, onApprove, onViewDetails }) => {
  const { hasPermission } = useAuth();
  const [expandedAchat, setExpandedAchat] = useState(null);

  // Fonction pour parser les pièces justificatives
  const parsePiecesJustificatives = (pieces) => {
    if (!pieces) return [];
    
    try {
      // Si c'est déjà un tableau, le retourner
      if (Array.isArray(pieces)) {
        return pieces;
      }
      
      // Si c'est une chaîne JSON, la parser
      if (typeof pieces === 'string') {
        return JSON.parse(pieces);
      }
      
      // Sinon, retourner un tableau vide
      return [];
    } catch (error) {
      console.error('Error parsing pieces_justificatives:', error);
      return [];
    }
  };

  if (achats.length === 0) {
    return (
      <div className="text-center py-8">
        <ShoppingCartIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Aucun achat trouvé
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Commencez par créer des achats
        </p>
      </div>
    );
  }

  const toggleExpanded = (achatId) => {
    setExpandedAchat(expandedAchat === achatId ? null : achatId);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Réceptionnée': 'bg-green-100 text-green-800',
      'Commandée': 'bg-blue-100 text-blue-800',
      'Approuvée': 'bg-purple-100 text-purple-800',
      'En attente': 'bg-yellow-100 text-yellow-800',
      'Annulée': 'bg-red-100 text-red-800',
      'En cours': 'bg-orange-100 text-orange-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Urgente': 'bg-red-100 text-red-800',
      'Haute': 'bg-orange-100 text-orange-800',
      'Normale': 'bg-blue-100 text-blue-800',
      'Basse': 'bg-green-100 text-green-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-4">
      {achats.map((achat) => (
        <div key={achat.id} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          {/* Header de l'achat */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <ShoppingCartIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {achat.numero_commande}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Créé le {new Date(achat.date_creation).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(achat.statut)}`}>
                  {achat.statut}
                </span>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getPriorityColor(achat.priorite)}`}>
                  {achat.priorite}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleExpanded(achat.id)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {expandedAchat === achat.id ? '▼' : '▶'}
                  </button>
                  <button
                    onClick={() => onViewDetails(achat)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(achat)}
                    className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  {hasPermission('Superviseur') && achat.statut === 'En attente' && (
                    <button
                      onClick={() => onApprove(achat.id)}
                      className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                    >
                      ✓
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Détails de l'achat (expandable) */}
          {expandedAchat === achat.id && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informations générales */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Informations générales
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Fournisseur principal:</span>
                      <span className="text-gray-900 dark:text-white">{achat.fournisseur?.nom || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Montant total:</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {achat.montant_total ? `${achat.montant_total}$` : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Date de livraison souhaitée:</span>
                      <span className="text-gray-900 dark:text-white">
                        {achat.date_livraison_souhaitee ? new Date(achat.date_livraison_souhaitee).toLocaleDateString() : 'Non définie'}
                      </span>
                    </div>
                    {achat.notes && (
                      <div className="mt-3 p-3 bg-white dark:bg-gray-700 rounded border">
                        <span className="text-gray-500 dark:text-gray-400 text-xs">Notes:</span>
                        <p className="text-gray-900 dark:text-white text-sm mt-1">{achat.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Produits de l'achat */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Produits commandés
                  </h4>
                  {(() => {
                    // Gérer les différents noms possibles pour les lignes
                    const lignes = achat.lignes || achat.lignes_achat || [];
                    return lignes.length > 0 ? (
                      <div className="space-y-2">
                        {lignes.map((ligne, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded border">
                            <div className="flex items-center space-x-2">
                              <CubeIcon className="w-4 h-4 text-gray-400" />
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {ligne.inventaire?.nom || ligne.description || 'Produit inconnu'}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {ligne.quantite} x {ligne.prix_unitaire}$
                                  {ligne.grammage && ` - ${ligne.grammage}g`}
                                  {ligne.inventaire?.categorie && ` (${ligne.inventaire.categorie})`}
                                </div>
                              </div>
                            </div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {ligne.montant_ttc || (ligne.montant_ht + ligne.montant_tva)}$
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">Aucun produit détaillé</p>
                    );
                  })()}
                </div>
              </div>

              {/* Pièces justificatives */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Pièces justificatives
                </h4>
                {(() => {
                  const pieces = parsePiecesJustificatives(achat.pieces_justificatives);
                  return pieces.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {pieces.map((piece, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-white dark:bg-gray-700 rounded border">
                        <DocumentIcon className="w-4 h-4 text-red-500" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 dark:text-white truncate">
                            {piece.nom}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {piece.taille} - {new Date(piece.date_upload).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => window.open(piece.url, '_blank')}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            title="Voir le document"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => window.open(piece.url, '_blank')}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            title="Télécharger"
                          >
                            ↓
                          </button>
                        </div>
                      </div>
                                          ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">Aucune pièce justificative</p>
                  );
                })()}
              </div>

              {/* Fournisseurs multiples */}
              {achat.fournisseurs && achat.fournisseurs.length > 1 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Fournisseurs impliqués
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {achat.fournisseurs.map((fournisseur, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-white dark:bg-gray-700 rounded border">
                        <BuildingStorefrontIcon className="w-4 h-4 text-gray-400" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {fournisseur.nom}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {fournisseur.ville} - {fournisseur.contact_principal}
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {fournisseur.montant}$
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AchatsAdvancedTable; 