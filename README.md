# 🗡️ Adventure Tome - Le Jeu Dont Tu Es Le Héro

[![Déploiement](https://img.shields.io/badge/🚀_Démo_Live-dagda.chtibox.ovh-blue?style=for-the-badge)](https://dagda.chtibox.ovh/)
[![CI Status](https://img.shields.io/github/actions/workflow/status/bertrandgressier/adventure-tome/ci.yml?branch=main&style=for-the-badge&label=Tests)](https://github.com/bertrandgressier/adventure-tome/actions/workflows/ci.yml)
[![codecov](https://img.shields.io/codecov/c/github/bertrandgressier/adventure-tome?style=for-the-badge&token=YOUR_CODECOV_TOKEN)](https://codecov.io/gh/bertrandgressier/adventure-tome)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Donate](https://img.shields.io/badge/☕_Soutenir-PayPal-orange?style=for-the-badge)](https://www.paypal.com/donate/?hosted_button_id=Q5EPDFZEEXQHJ)

Application PWA mobile pour gérer vos personnages des livres "Le jeu dont tu es le héro" de la collection [La Saga de Dagda](https://www.lasagadedagda.fr/).

**[🎮 Lancer l'application](https://dagda.chtibox.ovh/)** | **[📖 Documentation](#-documentation)** | **[📝 Nouveautés](./CHANGELOG_USER.md)**

---

## 📖 Description

Adventure Tome est votre compagnon mobile pour vivre vos aventures épiques ! Créez et gérez vos héros, suivez votre progression, lancez les dés, combattez des créatures et explorez les mondes fantastiques des livres dont vous êtes le héro.

**Première implémentation** : La Harpe des Quatre Saisons

## ✨ Fonctionnalités

### 🎭 Gestion des personnages
- ✓ Créer et personnaliser vos héros
- ✓ Suivre Habileté, Endurance, Chance
- ✓ Gérer inventaire (or, provisions, équipement)
- ✓ Importer/Exporter vos personnages

### ⚔️ Système de jeu
- ✓ Combats automatisés avec calculs
- ✓ Lancer de dés (1 ou 2 dés)
- ✓ Sauvegarder votre position (paragraphe)
- ✓ Bloc-notes pour vos indices

### 📱 PWA Mobile
- ✓ Installation sur écran d'accueil
- ✓ Fonctionne hors ligne
- ✓ Stockage local (pas de serveur)
- ✓ Interface optimisée mobile
- ✓ Thème heroic fantasy

## 🛠️ Technologies

- **Next.js 16** - Framework React avec App Router
- **React 19** - Bibliothèque UI avec React Compiler
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Styling avec theming
- **shadcn/ui** - Composants UI
- **IndexedDB (idb)** - Stockage local
- **Vitest** - Framework de tests unitaires
- **Clean Architecture** - Séparation logique métier / présentation

## 📋 Prérequis

- Node.js 18+ 
- pnpm (recommandé)

## 🛠️ Installation

```bash
# Installer les dépendances
pnpm install
```

## 🎯 Démarrage

```bash
# Mode développement
pnpm dev

# Build production
pnpm build
pnpm start
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📱 Installation PWA

### Sur Android (Chrome, Edge)
1. Ouvrez l'application dans Chrome/Edge
2. Cliquez sur le bouton "Installer" qui apparaît
3. Ou utilisez le menu ⋮ → "Installer l'application"

### Sur iOS (Safari)
1. Ouvrez l'application dans Safari
2. Appuyez sur le bouton Partager ⎋
3. Sélectionnez "Sur l'écran d'accueil" ➕
4. Confirmez l'installation

## 📁 Structure du projet

```
adventure-tome/
├── app/                        # Présentation (Next.js)
│   ├── layout.tsx              # Layout principal
│   ├── page.tsx                # Page d'accueil
│   ├── manifest.ts             # Configuration PWA
│   ├── globals.css             # Styles + thème
│   ├── characters/             # Pages gestion personnages
│   └── components/             # Composants UI (legacy)
│       ├── ui/                 # shadcn/ui components
│       ├── character/          # Composants personnage
│       └── adventure/          # Composants aventure
├── src/                        # Clean Architecture
│   ├── domain/                 # Logique métier (PURE)
│   │   ├── entities/           # Character entity
│   │   ├── value-objects/      # Stats, Inventory, Progress
│   │   └── repositories/       # Interfaces (ports)
│   ├── application/            # Services orchestrateurs
│   │   └── services/           # CharacterService
│   ├── infrastructure/         # Adapters (DB, API)
│   │   └── repositories/       # IndexedDBCharacterRepository
│   └── presentation/           # React hooks + composants
│       ├── hooks/              # useCharacter
│       └── components/         # Composants refactorés
├── lib/                        # Utilitaires (legacy)
│   ├── storage/                # IndexedDB helpers
│   ├── game/                   # Logique de jeu
│   ├── utils/                  # Utilitaires
│   └── types/                  # Types TypeScript
├── tests/                      # Tests unitaires + intégration
│   ├── setup.ts                # Configuration Vitest
│   └── integration/            # Tests d'intégration
├── docs/                       # Documentation
│   ├── FEATURES.md             # Liste des fonctionnalités
│   ├── ARCHITECTURE.md         # Architecture technique
│   ├── CHARACTER_SHEET.md      # Structure fiche personnage
│   ├── COMBAT.md               # Règles de combat
│   ├── THEMING.md              # Guide du thème
│   ├── MIGRATION_GUIDE.md      # Guide migration Clean Architecture
│   └── AUDIT_ARCHITECTURE.md   # Audit complet
└── public/
    ├── icons/                  # Icônes PWA
    └── manifest.json           # Manifest statique
```

## 🔧 Technologies utilisées

- **Next.js** 16.0.1 - Framework React
- **React** 19.2.0 - Bibliothèque UI
- **TypeScript** 5 - Langage typé
- **Tailwind CSS** 4 - Framework CSS
- **Turbopack** - Build tool
- **ESLint** - Linter

## 📝 Configuration PWA

Le fichier `app/manifest.ts` configure les paramètres PWA :
- Nom de l'application
- Icônes (192x192, 512x512)
- Mode d'affichage (standalone)
- Couleurs du thème
- Orientation (portrait)

## 🎨 Personnalisation

### Modifier les icônes
Remplacez les fichiers dans `public/` :
- `icon-192x192.svg`
- `icon-512x512.svg`
- `apple-touch-icon.png`

### Modifier les couleurs
Dans `app/manifest.ts` et `public/manifest.json` :
```typescript
theme_color: "#000000"     // Couleur de la barre d'état
background_color: "#ffffff" // Couleur de fond au démarrage
```

## 📦 Build et déploiement

```bash
# Build pour production
pnpm build

# Démarrer en production
pnpm start
```
## 📖 Documentation

### Documentation projet
- [📋 Fonctionnalités](./docs/FEATURES.md) - Liste complète des features
- [🏗️ Architecture](./docs/ARCHITECTURE.md) - Structure technique
- [📝 Fiche personnage](./docs/CHARACTER_SHEET.md) - Format et règles
- [⚔️ Système de combat](./docs/COMBAT.md) - Règles et mécaniques de combat
- [🎨 Theming](./docs/THEMING.md) - Design system et thème

### 📐 Clean Architecture (Nouveau ✨)
- [🔍 Audit complet](./docs/AUDIT_ARCHITECTURE.md) - Analyse détaillée de l'architecture
- [📊 Recommandations](./docs/RECOMMENDATIONS.md) - Plan d'amélioration
- [🔄 Exemple de refactoring](./docs/REFACTORING_EXAMPLE.md) - Avant/après avec code
- [📐 Diagrammes](./docs/ARCHITECTURE_DIAGRAMS.md) - Visualisation
- [📘 Guide de migration](./docs/MIGRATION_GUIDE.md) - **Comment migrer vos composants** ⭐
- [🔒 Garantie de migration](./docs/MIGRATION_GUARANTEE.md) - **Aucune perte de données** ✅

### Avantages de la nouvelle architecture

**Avant** (architecture legacy) :
- Logique métier mélangée avec l'UI
- 21 useState dans un composant
- `updatedAt = new Date().toISOString()` dupliqué 20+ fois
- Impossible de tester sans mocker React + IndexedDB

**Après** (Clean Architecture) :
- Séparation claire: Domain → Application → Infrastructure → Presentation
- 71 tests unitaires pour la logique métier (0 dépendance UI)
- Single Source of Truth pour les règles métier
- Code réduit de 70% dans les composants refactorés
- **Aucune perte de données** - Migration garantie par 6 tests

**Composants pilotes** :
- `src/presentation/components/CharacterStatsRefactored.tsx` - Exemple complet (90 lignes vs 300)
- `src/presentation/components/EditableStatField.tsx` - Composant réutilisable
- `src/presentation/hooks/useCharacter.ts` - Hook React pour la logique

### Ressources externes
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [La Saga de Dagda](https://www.lasagadedagda.fr/)

## ☕ Soutenir le projet

Ce projet est **100% gratuit et open-source**. Si ce projet vous est utile ou si vous voulez soutenir ce jeu, vous pouvez m'offrir un café ☕

[![Donate](https://img.shields.io/badge/Donate-PayPal-blue.svg)](https://www.paypal.com/donate/?hosted_button_id=Q5EPDFZEEXQHJ)

Merci pour votre soutien ! ❤️

## 📖 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 📄 Licence

MIT
