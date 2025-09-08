import React from 'react';
import { XMarkIcon, QrCodeIcon, MapPinIcon, UserIcon, CalendarIcon, TagIcon } from '@heroicons/react/24/outline';
import QRCode from 'qrcode';
import { useState, useEffect } from 'react';

const ArticleDetailsModal = ({ article, isOpen, onClose }) => {
  const [qrCodeImage, setQrCodeImage] = useState(null);

  useEffect(() => {
    if (article?.qr_code_article) {
      generateQRCode();
    }
  }, [article]);

  const generateQRCode = async () => {
    try {
      const qrCodeDataURL = await QRCode.toDataURL(article.qr_code_article, {
        width: 150,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeImage(qrCodeDataURL);
    } catch (error) {
      console.error('Erreur lors de la génération du QR code:', error);
    }
  };

  if (!isOpen || !article) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifiée';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStockStatusColor = (quantite, quantiteMin) => {
    if (quantite === 0) return 'text-red-600 bg-red-100';
    if (quantite <= quantiteMin) return 'text-orange-600 bg-orange-100';
    return 'text-green-600 bg-green-100';
  };

  const getStockStatusText = (quantite, quantiteMin) => {
    if (quantite === 0) return 'Rupture de stock';
    if (quantite <= quantiteMin) return 'Stock faible';
    return 'Stock suffisant';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Mobilier': 'bg-purple-100 text-purple-800',
      'Équipement': 'bg-blue-100 text-blue-800',
      'Linge': 'bg-green-100 text-green-800',
      'Produits': 'bg-yellow-100 text-yellow-800',
      'Électronique': 'bg-indigo-100 text-indigo-800',
      'Décoration': 'bg-pink-100 text-pink-800',
      'Autre': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors['Autre'];
  };

  const getStatusColor = (statut) => {
    const colors = {
      'Disponible': 'bg-green-100 text-green-800',
      'En rupture': 'bg-red-100 text-red-800',
      'En commande': 'bg-yellow-100 text-yellow-800',
      'Hors service': 'bg-gray-100 text-gray-800'
    };
    return colors[statut] || colors['Disponible'];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <TagIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Détails de l'article
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {article.code_produit || 'Sans code'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Informations principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Colonne gauche */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Informations générales
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Nom de l'article
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {article.nom}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Description
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {article.description || 'Aucune description'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Catégorie
                      </label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(article.categorie)}`}>
                        {article.categorie}
                      </span>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Sous-catégorie
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {article.sous_categorie || 'Non spécifiée'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Nature
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {article.nature || 'Non spécifiée'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Unité
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {article.unite}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stock et prix */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Stock et prix
                </h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Quantité en stock
                      </label>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {article.quantite}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Stock minimum
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {article.quantite_min}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Statut du stock
                    </label>
                    <div className="mt-1">
                      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStockStatusColor(article.quantite, article.quantite_min)}`}>
                        {getStockStatusText(article.quantite, article.quantite_min)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Prix unitaire
                    </label>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {article.prix_unitaire ? `${article.prix_unitaire}€` : 'Non spécifié'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne droite */}
            <div className="space-y-4">
              {/* Statut et fournisseur */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Statut et fournisseur
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Statut
                    </label>
                    <div className="mt-1">
                      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(article.statut)}`}>
                        {article.statut}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Fournisseur
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {article.fournisseur || 'Non spécifié'}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Numéro de référence
                    </label>
                    <p className="text-gray-900 dark:text-white font-mono">
                      {article.numero_reference || 'Non spécifié'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Emplacement */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Emplacement
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Emplacement
                    </label>
                    <p className="text-gray-900 dark:text-white flex items-center">
                      <MapPinIcon className="w-4 h-4 mr-2 text-gray-400" />
                      {article.emplacement || 'Non spécifié'}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Chambre assignée
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {article.chambre_id ? `Chambre ${article.chambre_id}` : 'Aucune chambre assignée'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Dates importantes
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Date d'achat
                    </label>
                    <p className="text-gray-900 dark:text-white flex items-center">
                      <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
                      {formatDate(article.date_achat)}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Date d'expiration
                    </label>
                    <p className="text-gray-900 dark:text-white flex items-center">
                      <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
                      {formatDate(article.date_expiration)}
                    </p>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              {qrCodeImage && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    Code QR
                  </h3>
                  <div className="flex items-center space-x-3">
                    <QrCodeIcon className="w-5 h-5 text-gray-400" />
                    <img 
                      src={qrCodeImage} 
                      alt="QR Code" 
                      className="w-24 h-24 border border-gray-200 dark:border-gray-600 rounded"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {article.qr_code_article}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Notes et tags */}
          {(article.notes || article.tags) && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Informations supplémentaires
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {article.notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Notes
                    </label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {article.notes}
                    </p>
                  </div>
                )}
                
                {article.tags && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {JSON.parse(article.tags || '[]').map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailsModal;
