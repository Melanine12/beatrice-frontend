import React, { useState } from 'react';
import { CalculatorIcon, BackspaceIcon } from '@heroicons/react/24/outline';

const POSCalculator = ({ onAmountChange, currentAmount = '' }) => {
  const [displayValue, setDisplayValue] = useState(currentAmount);

  const handleNumberClick = (number) => {
    if (displayValue === '0') {
      setDisplayValue(number.toString());
    } else {
      setDisplayValue(displayValue + number.toString());
    }
    onAmountChange(displayValue + number.toString());
  };

  const handleDecimalClick = () => {
    if (!displayValue.includes('.')) {
      const newValue = displayValue + '.';
      setDisplayValue(newValue);
      onAmountChange(newValue);
    }
  };

  const handleClear = () => {
    setDisplayValue('0');
    onAmountChange('0');
  };

  const handleBackspace = () => {
    if (displayValue.length > 1) {
      const newValue = displayValue.slice(0, -1);
      setDisplayValue(newValue);
      onAmountChange(newValue);
    } else {
      setDisplayValue('0');
      onAmountChange('0');
    }
  };

  const handleQuickAmount = (amount) => {
    setDisplayValue(amount.toString());
    onAmountChange(amount.toString());
  };

  const numbers = [
    [7, 8, 9],
    [4, 5, 6],
    [1, 2, 3],
    [0, '.', 'C']
  ];

  const quickAmounts = [5, 10, 20, 50, 100];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
          <CalculatorIcon className="w-5 h-5 mr-2 text-blue-600" />
          Calculatrice
        </h3>
        
        {/* Affichage */}
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-4">
          <div className="text-right text-2xl font-mono text-gray-900 dark:text-white">
            {displayValue || '0'}
          </div>
        </div>

        {/* Montants rapides */}
        <div className="grid grid-cols-5 gap-2 mb-4">
          {quickAmounts.map(amount => (
            <button
              key={amount}
              onClick={() => handleQuickAmount(amount)}
              className="px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors text-sm font-medium"
            >
              {amount}€
            </button>
          ))}
        </div>

        {/* Clavier numérique */}
        <div className="space-y-2">
          {numbers.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-2">
              {row.map((item, colIndex) => (
                <button
                  key={colIndex}
                  onClick={() => {
                    if (item === 'C') {
                      handleClear();
                    } else if (item === '.') {
                      handleDecimalClick();
                    } else {
                      handleNumberClick(item);
                    }
                  }}
                  className={`pos-calculator-button flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                    item === 'C'
                      ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Bouton retour arrière */}
        <button
          onClick={handleBackspace}
          className="w-full mt-3 py-3 px-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
        >
          <BackspaceIcon className="w-5 h-5 mr-2" />
          Retour
        </button>
      </div>
    </div>
  );
};

export default POSCalculator;
