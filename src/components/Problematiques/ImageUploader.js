import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  CameraIcon,
  PhotoIcon,
  CloudArrowUpIcon, 
  XMarkIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const ImageUploader = ({ onImagesChange, maxImages = 5 }) => {
  const [images, setImages] = useState([]);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Fonction pour démarrer la caméra
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowCamera(true);
    } catch (error) {
      console.error('Erreur lors du démarrage de la caméra:', error);
      alert('Impossible d\'accéder à la caméra. Vérifiez les permissions.');
    }
  };

  // Fonction pour arrêter la caméra
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  // Fonction pour capturer une photo
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const imageFile = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
          addImage(imageFile);
          
          if (images.length + 1 >= maxImages) {
            stopCamera();
          }
        }
      }, 'image/jpeg', 0.8);
    }
  };

  // Fonction pour ajouter une image
  const addImage = (file) => {
    if (images.length >= maxImages) {
      alert(`Maximum ${maxImages} images autorisées`);
      return;
    }

    const newImage = {
      id: Date.now() + Math.random(),
      file: file,
      url: URL.createObjectURL(file),
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`
    };

    const newImages = [...images, newImage];
    setImages(newImages);
    onImagesChange(newImages);
  };

  // Fonction pour supprimer une image
  const removeImage = (imageId) => {
    const newImages = images.filter(img => img.id !== imageId);
    setImages(newImages);
    onImagesChange(newImages);
  };

  // Fonction pour gérer le drop de fichiers
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach(file => {
      if (file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
        addImage(file);
      }
    });
  }, [images]);

  // Configuration de dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
    maxSize: 5 * 1024 * 1024,
    multiple: true,
    disabled: images.length >= maxImages
  });

  const canAddMore = images.length < maxImages;

  return (
    <div className="space-y-4">
      {/* En-tête avec compteur */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
          Images du problème ({images.length}/{maxImages})
        </h4>
        {canAddMore && (
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={startCamera}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <CameraIcon className="w-4 h-4 mr-2" />
              Prendre une photo
            </button>
            <button
              type="button"
              {...getRootProps()}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <input {...getInputProps()} />
              <PhotoIcon className="w-4 h-4 mr-2" />
              Choisir des images
            </button>
          </div>
        )}
      </div>

      {/* Interface de la caméra */}
      {showCamera && (
        <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-64 object-cover rounded-lg"
            />
            <canvas ref={canvasRef} className="hidden" />
            
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={capturePhoto}
                className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                disabled={!canAddMore}
              >
                📸 Capturer
              </button>
              <button
                onClick={stopCamera}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Arrêter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Zone de drop pour les images */}
      {!showCamera && canAddMore && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragActive
              ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }`}
        >
          <input {...getInputProps()} />
          <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isDragActive
                ? 'Déposez les images ici...'
                : 'Glissez-déposez des images ici, ou cliquez pour sélectionner'
              }
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              JPG, PNG, GIF, WebP jusqu'à 5MB
            </p>
          </div>
        </div>
      )}

      {/* Affichage des images */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image) => (
            <div key={image.id} className="relative group">
              <img
                src={image.url}
                alt={image.name}
                className="w-full h-32 object-cover rounded-lg border"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg">
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
                  <button
                    onClick={() => window.open(image.url, '_blank')}
                    className="p-1 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                    title="Voir en grand"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeImage(image.id)}
                    className="p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                    title="Supprimer"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="text-xs text-white bg-black bg-opacity-70 px-2 py-1 rounded">
                    {image.name}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message d'information */}
      <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
        <p>💡 <strong>Conseils :</strong></p>
        <ul className="mt-1 space-y-1">
          <li>• Prenez des photos claires du problème pour faciliter le diagnostic</li>
          <li>• Vous pouvez capturer jusqu'à {maxImages} images</li>
          <li>• Formats supportés : JPG, PNG, GIF, WebP (max 5MB)</li>
          <li>• Utilisez la caméra pour les problèmes sur place</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageUploader;
