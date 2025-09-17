# Module Ressources Humaines

Ce module implémente un système complet de gestion des ressources humaines inspiré de Zoho People, organisé en 6 sections principales avec des onglets pour une navigation intuitive.

## Structure du Module

### 🏠 Tableau de Bord RH (`/rh`)
Page d'accueil du module avec vue d'ensemble, statistiques et accès rapide aux sections.

### 📋 Sections Principales

#### 1. Gestion des Employés (`/rh/gestion-employes`)
- **Dossier Personnel** - Gestion des informations personnelles et professionnelles des employés
- **Organigramme** - Visualisation de la structure hiérarchique de l'entreprise
- **Contrats & Documents** - Gestion des contrats et documents RH
- **Historique RH** - Suivi des évolutions de carrière

#### 2. Recrutement & Intégration (`/rh/recrutement-integration`)
- **Offres d'Emploi** - Gestion des postes ouverts
- **Candidatures** - Suivi des candidats
- **Processus de Recrutement** - Workflow de sélection
- **Intégration** - Onboarding des nouveaux employés

#### 3. Temps & Présences (`/rh/temps-presences`)
- **Pointage** - Suivi des heures de travail
- **Congés & Absences** - Gestion des demandes de congés avec workflow d'approbation
- **Planning** - Gestion des plannings
- **Heures Supplémentaires** - Suivi des heures sup

#### 4. Paie & Avantages (`/rh/paie-avantages`)
- **Bulletins de Paie** - Gestion de la paie
- **Avantages Sociaux** - Assurance, mutuelle, etc.
- **Remboursements** - Frais professionnels
- **Variables** - Primes et commissions

#### 5. Performance & Formation (`/rh/performance-formation`)
- **Évaluations** - Entretiens et évaluations avec système de notation
- **Objectifs** - Suivi des objectifs individuels
- **Formations** - Planification et suivi des formations
- **Compétences** - Gestion des compétences

#### 6. Communication RH (`/rh/communication-rh`)
- **Annonces** - Communication interne
- **Sondages** - Enquêtes de satisfaction
- **Événements** - Gestion des événements d'entreprise
- **Politiques RH** - Documentation des politiques

## Pages développées

### Pages complètes
- `DossierPersonnel.js` - Interface complète avec liste des employés et détails
- `Organigramme.js` - Visualisation interactive de l'organigramme
- `CongesAbsences.js` - Gestion complète des congés avec workflow d'approbation
- `Evaluations.js` - Système d'évaluation avec notation et suivi

### Pages en développement
Toutes les autres pages sont des placeholders avec un message "Page en cours de développement..." et peuvent être développées selon les besoins.

## Composants

### RHNavigation.js
Composant de navigation rapide vers toutes les fonctionnalités RH, organisé par catégories.

### RHDashboard.js
Tableau de bord RH avec :
- Statistiques clés (nombre d'employés, demandes en attente, etc.)
- Activités récentes
- Actions rapides

## Accès et permissions

Ce module est accessible uniquement aux utilisateurs avec le rôle **Superviseur RH** et les rôles supérieurs (Administrateur, Patron).

## Structure des fichiers

```
src/
├── pages/RH/
│   ├── DossierPersonnel.js
│   ├── Organigramme.js
│   ├── CongesAbsences.js
│   ├── Evaluations.js
│   ├── index.js (exports)
│   └── README.md
└── components/RH/
    ├── RHNavigation.js
    ├── RHDashboard.js
    └── index.js (exports)
```

## Prochaines étapes

1. Développer les pages placeholder selon les priorités
2. Intégrer avec l'API backend
3. Ajouter des fonctionnalités avancées (recherche, filtres, exports)
4. Implémenter les workflows d'approbation
5. Ajouter des notifications en temps réel
