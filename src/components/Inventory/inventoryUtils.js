// Utility functions for inventory management

export const getStockStatusColor = (item) => {
  if (item.quantite === 0) return 'text-red-600 bg-red-100';
  if (item.quantite <= item.quantite_min) return 'text-orange-600 bg-orange-100';
  return 'text-green-600 bg-green-100';
};

export const getCategoryColor = (category) => {
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

export const selectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: 'white',
    borderColor: state.isFocused ? '#f59e0b' : '#d1d5db',
    borderWidth: '1px',
    borderRadius: '0.5rem',
    boxShadow: state.isFocused ? '0 0 0 1px #f59e0b' : 'none',
    '&:hover': {
      borderColor: '#f59e0b'
    }
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#f59e0b' : state.isFocused ? '#fef3c7' : 'white',
    color: state.isSelected ? 'white' : '#374151',
    '&:hover': {
      backgroundColor: state.isSelected ? '#f59e0b' : '#fef3c7'
    }
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: '0.5rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#374151'
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#9ca3af'
  })
};

export const categories = [
  'Mobilier', 'Équipement', 'Linge', 'Produits', 
  'Électronique', 'Décoration', 'Autre'
];

export const statuses = [
  'Disponible', 'En rupture', 'En commande', 'Hors service'
]; 