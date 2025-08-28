import React from 'react';

const StockTable = ({ items, onEdit }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Article</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Stock initial</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Entrées</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Sorties</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Stock final</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unité</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Min</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {items.map(item => (
            <tr key={item.id}>
              <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{item.nom}</td>
              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{item.categorie || '-'}</td>
              <td className="px-4 py-3 text-sm text-right">
                {item.stock_initial}
              </td>
              <td className="px-4 py-3 text-sm text-right text-green-600">{item.entrees}</td>
              <td className="px-4 py-3 text-sm text-right text-red-600">{item.sorties}</td>
              <td className="px-4 py-3 text-sm text-right font-semibold">{item.stock_final}</td>
              <td className="px-4 py-3 text-sm">{item.unite || '-'}</td>
              <td className="px-4 py-3 text-sm text-right">{item.quantite_min}</td>
              <td className="px-4 py-3 text-sm">{item.statut}</td>
              <td className="px-4 py-3 text-right">
                {onEdit && (
                  <button
                    onClick={() => onEdit(item)}
                    className="text-primary-600 hover:text-primary-800 text-sm"
                  >
                    Modifier
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400 py-6">Aucun article</div>
      )}
    </div>
  );
};

export default StockTable;


