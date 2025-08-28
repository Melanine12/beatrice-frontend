# 🏨 Hôtel Beatrice - Frontend React

Interface utilisateur React pour le système de gestion de l'Hôtel Beatrice.

## 🚀 Fonctionnalités

- **Dashboard** : Vue d'ensemble des activités
- **Gestion des Caisses** : Interface pour les caisses enregistreuses
- **Paiements Partiels** : Gestion des paiements différés
- **Génération de Rapports** : Bouton pour créer des PDF
- **Interface Responsive** : Compatible mobile et desktop
- **Thème Sombre/Clair** : Personnalisation de l'interface

## 🛠️ Technologies

- **Framework** : React 18+
- **Styling** : Tailwind CSS
- **Routing** : React Router DOM
- **HTTP Client** : Axios
- **Notifications** : React Hot Toast
- **Icônes** : Heroicons
- **Build Tool** : Create React App

## 📦 Installation

```bash
cd frontend
npm install
```

## 🔧 Configuration

Le frontend est configuré pour se connecter au backend sur `https://beatrice-backend.onrender.com`.

## 🚀 Démarrage

### Développement
```bash
npm start
```
L'application sera accessible sur `http://localhost:3000`

### Production
```bash
npm run build
npm run analyze
```

## 🧪 Tests

```bash
npm test
```

## 🎨 Structure des Composants

```
src/
├── components/          # Composants réutilisables
│   ├── Auth/           # Authentification
│   ├── CashRegisters/  # Gestion des caisses
│   ├── Expenses/       # Gestion des dépenses
│   ├── Inventory/      # Gestion de l'inventaire
│   ├── Layout/         # Layout principal
│   ├── Paiements/      # Gestion des paiements
│   ├── POS/            # Point de vente
│   ├── Problematiques/ # Gestion des problèmes
│   ├── Rooms/          # Gestion des chambres
│   ├── Suivi/          # Suivi des activités
│   └── UI/             # Composants UI génériques
├── contexts/            # Contextes React
├── hooks/               # Hooks personnalisés
├── pages/               # Pages de l'application
└── services/            # Services API
```

## 🔗 API Integration

Le frontend communique avec le backend via :
- **Base URL** : `https://beatrice-backend.onrender.com/api`
- **Proxy** : Configuré dans `package.json`
- **Authentification** : JWT stocké dans le localStorage

## 🎯 Fonctionnalités Principales

### Gestion des Caisses
- Création et modification de caisses
- Affichage des soldes en temps réel
- Historique des transactions
- Génération de rapports PDF

### Paiements Partiels
- Création de paiements partiels
- Choix entre paiement immédiat ou différé
- Impact sur les soldes de caisse
- Suivi des échéances

### Interface Utilisateur
- Design moderne avec Tailwind CSS
- Mode sombre/clair
- Interface responsive
- Notifications toast

---

**Hôtel Beatrice Frontend** v1.0.0
