import React from 'react';

const StockTable = ({ data, items, onEdit, onDelete, filters, pagination, onPageChange }) => {
  // Utiliser data ou items selon ce qui est fourni
  const stockData = data || items || [];
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Article</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unité</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Seuil Min</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {stockData && stockData.length > 0 ? stockData.map(item => (
            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                <div className="font-medium">{item.nom}</div>
                {item.sousCategorie && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">{item.sousCategorie}</div>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{item.code || '-'}</td>
              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{item.categorie || '-'}</td>
              <td className="px-4 py-3 text-sm text-right">
                <span className={`font-medium ${
                  item.quantite === 0 ? 'text-red-600' : 
                  item.quantite <= item.seuilMin ? 'text-yellow-600' : 
                  'text-green-600'
                }`}>
                  {item.quantite || 0}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{item.unite || '-'}</td>
              <td className="px-4 py-3 text-sm text-right text-gray-500 dark:text-gray-400">{item.seuilMin || 0}</td>
              <td className="px-4 py-3 text-sm">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  item.statut === 'En stock' ? 'bg-green-100 text-green-800' :
                  item.statut === 'Stock faible' ? 'bg-yellow-100 text-yellow-800' :
                  item.statut === 'Rupture de stock' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {item.statut || 'Inconnu'}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-gray-100">
                {item.prix ? `${item.prix.toFixed(2)} €` : '-'}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex space-x-2">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(item)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Modifier
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(item.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Supprimer
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {(!stockData || stockData.length === 0) && (
        <div className="text-center text-gray-500 dark:text-gray-400 py-6">Aucun article trouvé</div>
      )}
    </div>
  );
};

export default StockTable;


