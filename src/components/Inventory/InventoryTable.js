import React, { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import QRCode from 'qrcode';
import ArticleDetailsModal from './ArticleDetailsModal';

const InventoryTable = ({ inventory, onEdit, onDelete, getCategoryColor, getStockStatusColor }) => {
  const { hasPermission } = useAuth();
  const [qrCodeImages, setQrCodeImages] = useState({});
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Générer les images QR code pour tous les articles
  useEffect(() => {
    const generateQRCodeImages = async () => {
      const images = {};
      for (const item of inventory) {
        if (item.qr_code_article) {
          try {
            const qrImage = await QRCode.toDataURL(item.qr_code_article, {
              width: 60,
              margin: 1,
              color: {
                dark: '#000000',
                light: '#FFFFFF'
              }
            });
            images[item.id] = qrImage;
          } catch (error) {
            console.error('Erreur lors de la génération du QR code pour', item.nom, error);
          }
        }
      }
      setQrCodeImages(images);
    };

    generateQRCodeImages();
  }, [inventory]);

  const handleViewDetails = (article) => {
    setSelectedArticle(article);
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedArticle(null);
  };

  if (inventory.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 text-gray-400 mx-auto mb-4">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Aucun article trouvé
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Commencez par ajouter des articles à l'inventaire
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Article
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Code produit
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              QR Code
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Catégorie
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Sous-catégorie
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Nature
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Stock
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Prix
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Statut
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {inventory.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.nom}
                  </div>
                  {item.description && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {item.description}
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white">
                  {item.code_produit || '-'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col items-center">
                  {qrCodeImages[item.id] ? (
                    <div className="flex flex-col items-center space-y-2">
                      <img 
                        src={qrCodeImages[item.id]} 
                        alt={`QR Code pour ${item.nom}`}
                        className="border border-gray-300 rounded-lg shadow-sm"
                        style={{ width: '60px', height: '60px' }}
                        title={item.qr_code_article}
                      />
                      <div className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-20 truncate">
                        {item.qr_code_article}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400 dark:text-gray-500">
                      -
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(item.categorie)}`}>
                  {item.categorie}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white">
                  {item.sous_categorie || '-'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white">
                  {item.nature || '-'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white">
                  {item.quantite} {item.unite}
                </div>
                <div className={`text-xs ${getStockStatusColor(item)} px-2 py-1 rounded-full inline-block`}>
                  {item.quantite === 0 ? 'Rupture' : 
                   item.quantite <= item.quantite_min ? 'Stock faible' : 'OK'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {item.prix_unitaire ? `${item.prix_unitaire}$` : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  item.statut === 'Disponible' ? 'bg-green-100 text-green-800' :
                  item.statut === 'En rupture' ? 'bg-red-100 text-red-800' :
                  item.statut === 'En commande' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {item.statut}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  {/* Bouton Détails - Visible pour tous */}
                  <button
                    onClick={() => handleViewDetails(item)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    title="Voir les détails"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </button>
                  
                  {hasPermission('Superviseur') && (
                    <button
                      onClick={() => onEdit(item)}
                      className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                      title="Modifier"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                  )}
                  {hasPermission('Administrateur') && (
                    <button
                      onClick={() => onDelete(item.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      title="Supprimer"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Modal de détails */}
      <ArticleDetailsModal
        article={selectedArticle}
        isOpen={isDetailsModalOpen}
        onClose={closeDetailsModal}
      />
    </div>
  );
};

export default InventoryTable; 