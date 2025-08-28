import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

const QRCodeGenerator = ({ article, onQRCodeGenerated }) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (article && article.qr_code_article) {
      generateQRCode(article.qr_code_article);
    }
  }, [article]);

  const generateQRCode = async (data) => {
    if (!data) return;
    
    try {
      setLoading(true);
      setError('');
      
      const qrCodeDataUrl = await QRCode.toDataURL(data, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      setQrCodeDataUrl(qrCodeDataUrl);
      
      if (onQRCodeGenerated) {
        onQRCodeGenerated(qrCodeDataUrl);
      }
    } catch (err) {
      console.error('Erreur lors de la génération du QR code:', err);
      setError('Erreur lors de la génération du QR code');
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeDataUrl) return;
    
    const link = document.createElement('a');
    link.download = `qr-code-${article?.nom || 'article'}.png`;
    link.href = qrCodeDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printQRCode = () => {
    if (!qrCodeDataUrl) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code - ${article?.nom || 'Article'}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              padding: 20px; 
            }
            .qr-container { 
              border: 1px solid #ccc; 
              padding: 20px; 
              display: inline-block; 
              margin: 20px; 
            }
            .qr-code { 
              max-width: 200px; 
              height: auto; 
            }
            .article-info { 
              margin-top: 15px; 
              font-size: 14px; 
            }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <img src="${qrCodeDataUrl}" alt="QR Code" class="qr-code" />
            <div class="article-info">
              <strong>${article?.nom || 'Article'}</strong><br>
              ${article?.code_produit ? `Code: ${article.code_produit}<br>` : ''}
              ${article?.categorie ? `Catégorie: ${article.categorie}<br>` : ''}
              ${article?.emplacement ? `Emplacement: ${article.emplacement}` : ''}
            </div>
          </div>
          <div class="no-print">
            <button onclick="window.print()">Imprimer</button>
            <button onclick="window.close()">Fermer</button>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (!article) {
    return (
      <div className="text-center text-gray-500 p-4">
        Aucun article sélectionné
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-6 max-w-sm mx-auto">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          QR Code de l'article
        </h3>
        
        {loading && (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        {error && (
          <div className="text-red-600 text-sm mb-4">
            {error}
          </div>
        )}
        
        {qrCodeDataUrl && !loading && (
          <div className="space-y-4">
            <div className="border-2 border-gray-200 rounded-lg p-4 inline-block">
              <img 
                src={qrCodeDataUrl} 
                alt="QR Code" 
                className="w-48 h-48 mx-auto"
              />
            </div>
            
            <div className="text-sm text-gray-600 space-y-2">
              <div><strong>Article:</strong> {article.nom}</div>
              {article.code_produit && (
                <div><strong>Code produit:</strong> {article.code_produit}</div>
              )}
              {article.categorie && (
                <div><strong>Catégorie:</strong> {article.categorie}</div>
              )}
              {article.emplacement && (
                <div><strong>Emplacement:</strong> {article.emplacement}</div>
              )}
            </div>
            
            <div className="flex space-x-2 justify-center">
              <button
                onClick={downloadQRCode}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Télécharger
              </button>
              <button
                onClick={printQRCode}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Imprimer
              </button>
            </div>
          </div>
        )}
        
        {!qrCodeDataUrl && !loading && !error && (
          <div className="text-gray-500 text-sm">
            Aucun QR code disponible pour cet article
          </div>
        )}
      </div>
    </div>
  );
};

export default QRCodeGenerator; 