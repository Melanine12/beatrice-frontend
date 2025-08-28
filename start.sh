#!/bin/bash

# Script de démarrage pour le Frontend Hôtel Beatrice
# Usage: ./start.sh [dev|build|test]

set -e

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
MODE=${1:-dev}
APP_NAME="beatrice-frontend"

# Fonction pour afficher les messages
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

# Fonction pour vérifier les prérequis
check_prerequisites() {
    log "Vérification des prérequis..."
    
    # Vérifier Node.js
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js n'est pas installé"
        exit 1
    fi
    
    # Vérifier npm
    if ! command -v npm &> /dev/null; then
        echo "❌ npm n'est pas installé"
        exit 1
    fi
    
    # Vérifier la version de Node.js
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        warn "Node.js version $NODE_VERSION détectée. Version 18+ recommandée."
    fi
    
    log "Prérequis vérifiés avec succès"
}

# Fonction pour installer les dépendances
install_dependencies() {
    log "Installation des dépendances..."
    
    if [ ! -d "node_modules" ]; then
        npm install
        log "Dépendances installées avec succès"
    else
        info "Dépendances déjà installées"
    fi
}

# Fonction pour démarrer en mode développement
start_dev() {
    log "Démarrage en mode développement..."
    
    # Vérifier que le backend est accessible
    info "Vérification de la connectivité avec le backend..."
    if curl -s "https://beatrice-backend.onrender.com/api/health" > /dev/null 2>&1; then
        log "✅ Backend accessible sur le port 5002"
    else
        warn "⚠️  Backend non accessible sur le port 5002"
        warn "Assurez-vous que le backend est démarré avant de lancer le frontend"
    fi
    
    # Démarrer l'application React
    npm start
}

# Fonction pour construire l'application
start_build() {
    log "Construction de l'application..."
    
    # Nettoyer les anciens builds
    if [ -d "build" ]; then
        rm -rf build
        info "Ancien build supprimé"
    fi
    
    # Construire l'application
    npm run build
    
    if [ $? -eq 0 ]; then
        log "✅ Application construite avec succès"
        info "Build disponible dans le dossier 'build/'"
        
        # Optionnel : démarrer un serveur local pour tester le build
        if command -v serve &> /dev/null; then
            info "Démarrage du serveur de test..."
            serve -s build -l 3001
        else
            info "Pour tester le build, installez 'serve' : npm install -g serve"
            info "Puis lancez : serve -s build -l 3001"
        fi
    else
        echo "❌ Erreur lors de la construction"
        exit 1
    fi
}

# Fonction pour exécuter les tests
start_test() {
    log "Exécution des tests..."
    npm test
}

# Fonction pour analyser le build
analyze_build() {
    log "Analyse du build..."
    
    if [ ! -d "build" ]; then
        warn "Build non trouvé. Construction de l'application..."
        npm run build
    fi
    
    npm run analyze
}

# Fonction pour nettoyer
clean_build() {
    log "Nettoyage des builds..."
    
    if [ -d "build" ]; then
        rm -rf build
        log "Build supprimé"
    fi
    
    if [ -d "node_modules" ]; then
        rm -rf node_modules
        log "Dépendances supprimées"
    fi
    
    if [ -f "package-lock.json" ]; then
        rm package-lock.json
        log "package-lock.json supprimé"
    fi
    
    log "Nettoyage terminé"
}

# Fonction principale
main() {
    log "=== Démarrage de $APP_NAME en mode $MODE ==="
    
    check_prerequisites
    install_dependencies
    
    case $MODE in
        "dev")
            start_dev
            ;;
        "build")
            start_build
            ;;
        "test")
            start_test
            ;;
        "analyze")
            analyze_build
            ;;
        "clean")
            clean_build
            ;;
        *)
            echo "Usage: $0 [dev|build|test|analyze|clean]"
            echo "  dev     - Mode développement (défaut)"
            echo "  build   - Construction de l'application"
            echo "  test    - Exécution des tests"
            echo "  analyze - Analyse du build"
            echo "  clean   - Nettoyage des builds et dépendances"
            exit 1
            ;;
    esac
    
    log "=== Opération terminée ===""
}

# Exécution du script
main
