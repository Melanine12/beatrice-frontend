import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  CloudArrowUpIcon, 
  DocumentIcon, 
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const FileUploader = ({ onFilesUploaded, existingFiles = [], onFileRemove }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const onDrop = useCallback(async (acceptedFiles) => {
    setUploading(true);
    const uploadedFiles = [];

    for (const file of acceptedFiles) {
      try {
        // Vérifier le type de fichier
        if (!file.type.includes('pdf') && !file.type.includes('document')) {
          throw new Error(`Type de fichier non supporté: ${file.type}`);
        }

        // Vérifier la taille (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          throw new Error('Fichier trop volumineux (max 10MB)');
        }

        // Simuler l'upload - à remplacer par votre API
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
        
        // Simulation d'un upload progressif
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 50));
          setUploadProgress(prev => ({ ...prev, [file.name]: i }));
        }

        const uploadedFile = {
          id: Date.now() + Math.random(),
          nom: file.name,
          taille: `${(file.size / 1024).toFixed(1)} KB`,
          type: file.type,
          url: URL.createObjectURL(file), // Temporaire pour l'exemple
          date_upload: new Date().toISOString(),
          status: 'success'
        };

        uploadedFiles.push(uploadedFile);
        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));

      } catch (error) {
        console.error(`Erreur lors de l'upload de ${file.name}:`, error);
        const failedFile = {
          id: Date.now() + Math.random(),
          nom: file.name,
          taille: `${(file.size / 1024).toFixed(1)} KB`,
          type: file.type,
          error: error.message,
          status: 'error'
        };
        uploadedFiles.push(failedFile);
      }
    }

    setUploading(false);
    setUploadProgress({});
    onFilesUploaded(uploadedFiles);
  }, [onFilesUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true
  });

  const handleFileRemove = (fileId) => {
    if (onFileRemove) {
      onFileRemove(fileId);
    }
  };

  const allFiles = [...existingFiles];

  return (
    <div className="space-y-4">
      {/* Zone de drop */}
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
              ? 'Déposez les fichiers ici...'
              : 'Glissez-déposez vos fichiers PDF ici ou cliquez pour sélectionner'
            }
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Formats acceptés: PDF, DOC, DOCX (max 10MB par fichier)
          </p>
        </div>
      </div>

      {/* Liste des fichiers */}
      {allFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            Fichiers uploadés ({allFiles.length})
          </h4>
          
          <div className="space-y-2">
            {allFiles.map((file) => (
              <div
                key={file.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  file.status === 'error'
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    : file.status === 'success'
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {file.status === 'error' ? (
                      <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
                    ) : file.status === 'success' ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    ) : (
                      <DocumentIcon className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {file.nom}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>{file.taille}</span>
                      <span>•</span>
                      <span>{new Date(file.date_upload).toLocaleDateString()}</span>
                      {file.status === 'error' && (
                        <>
                          <span>•</span>
                          <span className="text-red-600 dark:text-red-400">{file.error}</span>
                        </>
                      )}
                    </div>
                    
                    {/* Barre de progression */}
                    {uploadProgress[file.nom] !== undefined && (
                      <div className="mt-1">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                          <div
                            className="bg-primary-600 h-1 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress[file.nom]}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {uploadProgress[file.nom]}% uploadé
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {file.status === 'success' && (
                    <>
                      <button
                        onClick={() => window.open(file.url, '_blank')}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Voir le document"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = file.url;
                          link.download = file.nom;
                          link.click();
                        }}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        title="Télécharger"
                      >
                        ↓
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleFileRemove(file.id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    title="Supprimer"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Indicateur de chargement */}
      {uploading && (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
            Upload en cours...
          </span>
        </div>
      )}
    </div>
  );
};

export default FileUploader; 