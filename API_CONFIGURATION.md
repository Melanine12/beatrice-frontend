# 🔧 Configuration de l'API - Frontend Hôtel Beatrice

## 📍 **Changement d'URL : Production → Localhost**

L'API frontend a été modifiée pour pointer vers **localhost:5002** au lieu de **beatrice-backend.onrender.com** afin de corriger certains bugs.

## 🚀 **Configuration Actuelle**

### **Mode Développement (FORCÉ)**
- **Base URL:** `http://localhost:5002/api`
- **Socket URL:** `http://localhost:5002`
- **Timeout:** 10 secondes

### **Mode Production (DÉSACTIVÉ)**
- **Base URL:** `https://beatrice-backend.onrender.com/api`
- **Socket URL:** `https://beatrice-backend.onrender.com`
- **Timeout:** 15 secondes

## 📁 **Fichiers Modifiés**

### **1. Configuration API (`src/config/api.js`)**
```javascript
// Forcer le mode développement pour corriger les bugs
const isDevelopment = true; // Force le mode développement
```

### **2. Service API (`src/services/api.js`)**
```javascript
import { API_BASE_URL, API_TIMEOUT } from '../config/api';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || API_BASE_URL,
  timeout: API_TIMEOUT,
  // ...
});
```

### **3. Notifications (`src/contexts/NotificationContext.js`)**
```javascript
import { SOCKET_URL } from '../config/api';

const socket = io(process.env.REACT_APP_API_BASE?.replace('/api','') || SOCKET_URL);
```

### **4. Package.json**
```json
{
  "proxy": "http://localhost:5002"
}
```

### **5. Script de démarrage (`start.sh`)**
```bash
if curl -s "http://localhost:5002/api/health" > /dev/null 2>&1; then
```

## 🔄 **Comment Changer de Configuration**

### **Pour Revenir en Production :**

1. **Modifier `src/config/api.js` :**
```javascript
// Commenter la ligne forcée
// const isDevelopment = true;

// Décommenter la détection automatique
const isDevelopment = process.env.NODE_ENV === 'development' || 
                     process.env.REACT_APP_ENV === 'development' ||
                     window.location.hostname === 'localhost' ||
                     window.location.hostname === '127.0.0.1';
```

2. **Modifier `package.json` :**
```json
{
  "proxy": "https://beatrice-backend.onrender.com"
}
```

### **Pour Forcer une URL Spécifique :**

Créer un fichier `.env.local` (ignoré par Git) :
```bash
REACT_APP_API_URL=http://localhost:5002/api
```

## 🧪 **Test de Configuration**

### **Script de Test :**
```bash
cd frontend
node test-api-config.js
```

### **Test Manuel avec curl :**
```bash
# Test de l'API
curl -v http://localhost:5002/api/auth/me

# Test de santé
curl -v http://localhost:5002/api/health
```

## ⚠️ **Prérequis**

### **Backend Local :**
1. **Démarrer le backend :**
```bash
cd backend
npm start
```

2. **Vérifier le port :**
```bash
lsof -i :5002
# ou
netstat -an | grep 5002
```

3. **Vérifier les logs :**
```bash
tail -f backend/logs/app.log
```

## 🐛 **Bugs Corrigés**

- ✅ **Connexion API** : Retour vers localhost pour éviter les timeouts
- ✅ **WebSocket** : Connexion locale pour les notifications en temps réel
- ✅ **Proxy** : Configuration correcte pour le développement
- ✅ **Timeout** : Réduction du timeout pour le développement local

## 📝 **Notes Importantes**

1. **Le mode développement est FORCÉ** pour corriger les bugs
2. **Tous les endpoints pointent vers localhost:5002**
3. **Les WebSockets utilisent aussi localhost**
4. **Le proxy est configuré pour localhost**
5. **Les timeouts sont optimisés pour le développement local**

## 🔍 **Dépannage**

### **Si l'API ne répond pas :**
1. Vérifier que le backend est démarré
2. Vérifier le port 5002
3. Vérifier les logs du backend
4. Tester avec curl ou Postman

### **Si les WebSockets ne fonctionnent pas :**
1. Vérifier la configuration Socket.IO
2. Vérifier les logs du backend
3. Tester la connexion WebSocket

---

*Configuration mise à jour le 28 août 2025 - Hôtel Beatrice System*
