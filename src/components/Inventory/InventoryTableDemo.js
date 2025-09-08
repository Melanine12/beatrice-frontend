import React, { useState } from 'react';
import ArticleDetailsModal from './ArticleDetailsModal';

// Données de démonstration
const demoArticle = {
  id: 1,
  nom: "Savon liquide pour les mains",
  description: "Savon liquide antibactérien pour la salle de bain",
  code_produit: "SAV001",
  categorie: "Produits",
  sous_categorie: "Produits de toilette",
  nature: "Consommable",
  quantite: 150,
  quantite_min: 50,
  unite: "bouteilles",
  prix_unitaire: 3.50,
  fournisseur: "Fournisseur ABC",
  numero_reference: "REF-SAV-001",
  emplacement: "Entrepôt principal - Zone A",
  chambre_id: null,
  statut: "Disponible",
  date_achat: "2025-08-15",
  date_expiration: "2026-08-15",
  qr_code_article: "SAV001-20250815-001",
  notes: "Produit de qualité premium, parfum frais",
  tags: JSON.stringify(["hygiène", "antibactérien", "salle de bain"])
};

const InventoryTableDemo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Démonstration du Modal de Détails
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Article de démonstration
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Nom
              </label>
              <p className="text-gray-900 dark:text-white">{demoArticle.nom}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Code produit
              </label>
              <p className="text-gray-900 dark:text-white font-mono">{demoArticle.code_produit}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Catégorie
              </label>
              <p className="text-gray-900 dark:text-white">{demoArticle.categorie}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Stock
              </label>
              <p className="text-gray-900 dark:text-white">{demoArticle.quantite} {demoArticle.unite}</p>
            </div>
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Voir les détails complets
          </button>
        </div>
      </div>
      
      {/* Modal de détails */}
      <ArticleDetailsModal
        article={demoArticle}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default InventoryTableDemo;
