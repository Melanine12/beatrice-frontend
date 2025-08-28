import React, { useState, useEffect } from 'react';
import { 
  ShoppingCartIcon, 
  CreditCardIcon, 
  BanknotesIcon, 
  XMarkIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  CalculatorIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import './POS.css';

const POSInterface = () => {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountReceived, setAmountReceived] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [products] = useState([
    { id: 1, name: 'Café Expresso', price: 3.50, category: 'boissons', stock: 50 },
    { id: 2, name: 'Café Latte', price: 4.20, category: 'boissons', stock: 45 },
    { id: 3, name: 'Croissant', price: 2.80, category: 'pâtisseries', stock: 30 },
    { id: 4, name: 'Pain au Chocolat', price: 3.00, category: 'pâtisseries', stock: 25 },
    { id: 5, name: 'Sandwich Jambon', price: 6.50, category: 'sandwichs', stock: 20 },
    { id: 6, name: 'Sandwich Végétarien', price: 5.80, category: 'sandwichs', stock: 18 },
    { id: 7, name: 'Eau Minérale', price: 2.00, category: 'boissons', stock: 100 },
    { id: 8, name: 'Jus d\'Orange', price: 3.50, category: 'boissons', stock: 40 },
    { id: 9, name: 'Tarte aux Pommes', price: 4.50, category: 'pâtisseries', stock: 15 },
    { id: 10, name: 'Salade César', price: 8.90, category: 'salades', stock: 12 },
  ]);

  const categories = [
    { id: 'all', name: 'Tout', color: 'bg-gray-500' },
    { id: 'boissons', name: 'Boissons', color: 'bg-blue-500' },
    { id: 'pâtisseries', name: 'Pâtisseries', color: 'bg-yellow-500' },
    { id: 'sandwichs', name: 'Sandwichs', color: 'bg-green-500' },
    { id: 'salades', name: 'Salades', color: 'bg-purple-500' },
  ];

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getChange = () => {
    const total = getTotalAmount();
    const received = parseFloat(amountReceived) || 0;
    return Math.max(0, received - total);
  };

  const handlePayment = () => {
    if (paymentMethod === 'cash' && parseFloat(amountReceived) < getTotalAmount()) {
      alert('Le montant reçu doit être supérieur ou égal au total');
      return;
    }
    
    // Ici vous pouvez ajouter la logique pour enregistrer la transaction
    console.log('Transaction:', {
      cart,
      total: getTotalAmount(),
      paymentMethod,
      amountReceived: parseFloat(amountReceived) || 0,
      change: getChange(),
      timestamp: new Date()
    });
    
    // Réinitialiser le panier et fermer le modal
    setCart([]);
    setAmountReceived('');
    setShowPaymentModal(false);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Point de Vente
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Interface moderne pour la gestion des encaissements
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Section Produits */}
          <div className="lg:col-span-2">
            {/* Barre de recherche et filtres */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Rechercher un produit..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                        selectedCategory === category.id
                          ? `${category.color} text-white shadow-lg`
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Grille des produits */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="pos-product-card bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 cursor-pointer border border-gray-100 dark:border-gray-700"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg font-bold">
                        {product.name.charAt(0)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">
                      {product.name}
                    </h3>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {product.price.toFixed(2)}€
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Stock: {product.stock}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Panier */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <ShoppingCartIcon className="w-6 h-6 mr-2 text-blue-600" />
                  Panier
                </h2>
                {cart.length > 0 && (
                  <button
                    onClick={() => setCart([])}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Vider
                  </button>
                )}
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCartIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Votre panier est vide</p>
                </div>
              ) : (
                <>
                  {/* Articles du panier */}
                  <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                    {cart.map(item => (
                      <div key={item.id} className="pos-cart-item flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                            {item.name}
                          </h4>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">
                            {item.price.toFixed(2)}€ x {item.quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                          >
                            <MinusIcon className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium text-gray-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                          >
                            <PlusIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="w-8 h-8 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
                    <div className="flex justify-between items-center text-lg font-bold text-gray-900 dark:text-white">
                      <span>Total:</span>
                      <span className="text-2xl text-blue-600 dark:text-blue-400">
                        {getTotalAmount().toFixed(2)}€
                      </span>
                    </div>
                  </div>

                  {/* Bouton de paiement */}
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    disabled={cart.length === 0}
                    className="pos-payment-button w-full text-white font-bold py-4 px-6 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CreditCardIcon className="w-5 h-5 inline mr-2" />
                    Procéder au Paiement
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de paiement */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Paiement
                </h3>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Méthode de paiement */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Méthode de paiement
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      paymentMethod === 'cash'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <BanknotesIcon className="w-6 h-6 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Espèces</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <CreditCardIcon className="w-6 h-6 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Carte</span>
                  </button>
                </div>
              </div>

              {/* Montant reçu (pour espèces) */}
              {paymentMethod === 'cash' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Montant reçu
                  </label>
                  <input
                    type="number"
                    value={amountReceived}
                    onChange={(e) => setAmountReceived(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  {parseFloat(amountReceived) > 0 && (
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <p>Total: {getTotalAmount().toFixed(2)}€</p>
                      <p>Reçu: {parseFloat(amountReceived).toFixed(2)}€</p>
                      <p className="font-semibold text-green-600">
                        Monnaie: {getChange().toFixed(2)}€
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Résumé de la transaction */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Résumé</h4>
                <div className="space-y-2">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {item.name} x {item.quantity}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {(item.price * item.quantity).toFixed(2)}€
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-blue-600 dark:text-blue-400">
                        {getTotalAmount().toFixed(2)}€
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handlePayment}
                  disabled={paymentMethod === 'cash' && parseFloat(amountReceived) < getTotalAmount()}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POSInterface;
