/**
 * Utilitaires pour la gestion des images
 * Gère la compatibilité entre les anciennes images locales et les nouvelles images Cloudinary
 */

/**
 * Obtient l'URL de l'image en priorisant Cloudinary
 * @param {Object} image - Objet image avec chemin_fichier et cloudinary_data
 * @returns {string} URL de l'image
 */
export const getImageUrl = (image) => {
  // Si l'image a des données Cloudinary, utiliser l'URL sécurisée
  if (image.cloudinary_data && image.cloudinary_data.secure_url) {
    return image.cloudinary_data.secure_url;
  }
  
  // Si l'image a un public_id Cloudinary, construire l'URL
  if (image.public_id) {
    return `https://res.cloudinary.com/df5isxcdl/image/upload/v1/${image.public_id}`;
  }
  
  // Fallback sur l'ancien chemin local
  if (image.chemin_fichier) {
    // Si c'est déjà une URL complète, la retourner
    if (image.chemin_fichier.startsWith('http')) {
      return image.chemin_fichier;
    }
    
    // Sinon, construire l'URL relative
    return image.chemin_fichier;
  }
  
  // URL par défaut si rien n'est trouvé
  return '/placeholder-image.png';
};

/**
 * Obtient l'URL du thumbnail en priorisant Cloudinary
 * @param {Object} image - Objet image
 * @param {string} size - Taille du thumbnail ('small', 'medium', 'large')
 * @returns {string} URL du thumbnail
 */
export const getThumbnailUrl = (image, size = 'medium') => {
  // Si l'image a des données Cloudinary avec thumbnails
  if (image.cloudinary_data && image.cloudinary_data.thumbnails) {
    const thumbnail = image.cloudinary_data.thumbnails[size];
    if (thumbnail && thumbnail.url) {
      return thumbnail.url;
    }
    
    // Essayer d'autres tailles si la taille demandée n'existe pas
    const availableSizes = Object.keys(image.cloudinary_data.thumbnails);
    if (availableSizes.length > 0) {
      return image.cloudinary_data.thumbnails[availableSizes[0]].url;
    }
  }
  
  // Si pas de thumbnails Cloudinary, utiliser l'image principale
  return getImageUrl(image);
};

/**
 * Vérifie si une image est sur Cloudinary
 * @param {Object} image - Objet image
 * @returns {boolean} True si l'image est sur Cloudinary
 */
export const isCloudinaryImage = (image) => {
  return !!(image.cloudinary_data && image.cloudinary_data.secure_url);
};

/**
 * Obtient les métadonnées de l'image
 * @param {Object} image - Objet image
 * @returns {Object} Métadonnées de l'image
 */
export const getImageMetadata = (image) => {
  if (image.cloudinary_data) {
    return {
      width: image.cloudinary_data.width,
      height: image.cloudinary_data.height,
      format: image.cloudinary_data.format,
      bytes: image.cloudinary_data.bytes,
      created_at: image.cloudinary_data.created_at
    };
  }
  
  // Fallback sur les métadonnées locales
  if (image.metadata) {
    try {
      return typeof image.metadata === 'string' ? JSON.parse(image.metadata) : image.metadata;
    } catch (e) {
      return {};
    }
  }
  
  return {};
};

/**
 * Obtient la taille formatée de l'image
 * @param {Object} image - Objet image
 * @returns {string} Taille formatée (ex: "45.2 KB")
 */
export const getFormattedImageSize = (image) => {
  const metadata = getImageMetadata(image);
  const bytes = metadata.bytes || image.taille;
  
  if (!bytes) return 'N/A';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

/**
 * Obtient les dimensions de l'image
 * @param {Object} image - Objet image
 * @returns {Object} Dimensions {width, height}
 */
export const getImageDimensions = (image) => {
  const metadata = getImageMetadata(image);
  return {
    width: metadata.width,
    height: metadata.height
  };
};
