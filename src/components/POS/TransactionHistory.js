import React, { useState } from 'react';
import { 
  ClockIcon, 
  DocumentTextIcon, 
  CreditCardIcon, 
  BanknotesIcon,
  EyeIcon,
  PrinterIcon
} from '@heroicons/react/24/outline';

const TransactionHistory = () => {
  const [transactions] = useState([
    {
      id: 1,
      timestamp: new Date('2024-01-15T10:30:00'),
      items: [
        { name: 'Café Expresso', quantity: 2, price: 3.50 },
        { name: 'Croissant', quantity: 1, price: 2.80 }
      ],
      total: 9.80,
      paymentMethod: 'card',
      cashier: 'Marie Dupont'
    },
    {
      id: 2,
      timestamp: new Date('2024-01-15T10:25:00'),
      items: [
        { name: 'Sandwich Jambon', quantity: 1, price: 6.50 },
        { name: 'Eau Minérale', quantity: 1, price: 2.00 }
      ],
      total: 8.50,
      paymentMethod: 'cash',
      cashier: 'Jean Martin'
    },
    {
      id: 3,
      timestamp: new Date('2024-01-15T10:20:00'),
      items: [
        { name: 'Café Latte', quantity: 1, price: 4.20 },
        { name: 'Pain au Chocolat', quantity: 2, price: 3.00 }
      ],
      total: 10.20,
      paymentMethod: 'card',
      cashier: 'Marie Dupont'
    }
  ]);

  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const getPaymentMethodIcon = (method) => {
    return method === 'card' ? (
      <CreditCardIcon className="w-5 h-5 text-blue-600" />
    ) : (
      <BanknotesIcon className="w-5 h-5 text-green-600" />
    );
  };

  const getPaymentMethodText = (method) => {
    return method === 'card' ? 'Carte' : 'Espèces';
  };

  const openTransactionDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailsModal(true);
  };

  const printReceipt = (transaction) => {
    // Ici vous pouvez implémenter la logique d'impression
    console.log('Impression du reçu:', transaction);
    alert('Fonction d\'impression à implémenter');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <ClockIcon className="w-6 h-6 mr-2 text-blue-600" />
          Historique des Transactions
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {transactions.length} transactions
        </span>
      </div>

      <div className="space-y-3">
        {transactions.map(transaction => (
          <div
            key={transaction.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            onClick={() => openTransactionDetails(transaction)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {getPaymentMethodIcon(transaction.paymentMethod)}
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {getPaymentMethodText(transaction.paymentMethod)}
                  </span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {formatTime(transaction.timestamp)} - {formatDate(transaction.timestamp)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {transaction.cashier}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {transaction.total.toFixed(2)}€
                </span>
                <EyeIcon className="w-5 h-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
              </div>
            </div>
            
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <DocumentTextIcon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {transaction.items.length} article(s)
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  printReceipt(transaction);
                }}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium flex items-center"
              >
                <PrinterIcon className="w-4 h-4 mr-1" />
                Imprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de détails de la transaction */}
      {showDetailsModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Détails de la Transaction
                </h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              {/* Informations de la transaction */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Informations</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">ID:</span>
                      <span className="font-medium text-gray-900 dark:text-white">#{selectedTransaction.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Date:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatDate(selectedTransaction.timestamp)} {formatTime(selectedTransaction.timestamp)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Caissier:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{selectedTransaction.cashier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Méthode:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {getPaymentMethodText(selectedTransaction.paymentMethod)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Résumé</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Articles:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{selectedTransaction.items.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Total:</span>
                      <span className="font-medium text-blue-600 dark:text-blue-400 text-lg">
                        {selectedTransaction.total.toFixed(2)}€
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Liste des articles */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Articles</h4>
                <div className="space-y-2">
                  {selectedTransaction.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          x{item.quantity}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {(item.price * item.quantity).toFixed(2)}€
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => printReceipt(selectedTransaction)}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <PrinterIcon className="w-5 h-5 mr-2" />
                  Imprimer le Reçu
                </button>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
