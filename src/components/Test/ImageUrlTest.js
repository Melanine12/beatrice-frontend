import React from 'react';
import { getImageUrl, getThumbnailUrl, getFormattedImageSize, isCloudinaryImage } from '../../utils/imageUtils';

const ImageUrlTest = () => {
  // Données de test simulées
  const testImages = [
    {
      id: 1,
      nom_fichier: 'test_local.png',
      chemin_fichier: '/uploads/problematiques/test_local.png',
      taille: 102400,
      type_mime: 'image/png'
    },
    {
      id: 2,
      nom_fichier: 'test_cloudinary.png',
      public_id: 'problematiques/21/problematique_21_6',
      cloudinary_data: {
        secure_url: 'https://res.cloudinary.com/df5isxcdl/image/upload/v1756410500/problematiques/21/problematique_21_6.png',
        url: 'http://res.cloudinary.com/df5isxcdl/image/upload/v1756410500/problematiques/21/problematique_21_6.png',
        format: 'png',
        width: 648,
        height: 366,
        bytes: 21620,
        created_at: '2025-08-28T19:48:20Z'
      }
    }
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Test des Utilitaires d'Images</h2>
      
      {testImages.map((image, index) => (
        <div key={image.id} className="mb-6 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">
            Image {index + 1}: {image.nom_fichier}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700">Données brutes:</h4>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(image, null, 2)}
              </pre>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700">Résultats des utilitaires:</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>URL de l'image:</strong>
                  <div className="text-blue-600 break-all">
                    {getImageUrl(image)}
                  </div>
                </div>
                
                <div>
                  <strong>URL du thumbnail:</strong>
                  <div className="text-green-600 break-all">
                    {getThumbnailUrl(image)}
                  </div>
                </div>
                
                <div>
                  <strong>Taille formatée:</strong>
                  <span className="text-purple-600">
                    {getFormattedImageSize(image)}
                  </span>
                </div>
                
                <div>
                  <strong>Est sur Cloudinary:</strong>
                  <span className={isCloudinaryImage(image) ? 'text-green-600' : 'text-red-600'}>
                    {isCloudinaryImage(image) ? 'Oui' : 'Non'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Affichage de l'image */}
          <div className="mt-4">
            <h4 className="font-medium text-gray-700 mb-2">Aperçu de l'image:</h4>
            <img
              src={getImageUrl(image)}
              alt={image.nom_fichier}
              className="max-w-xs h-auto border rounded"
              onError={(e) => {
                console.error('Erreur de chargement:', e.target.src);
                e.target.style.display = 'none';
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageUrlTest;
