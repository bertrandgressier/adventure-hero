# 🗡️ Adventure Tome - Le Jeu Dont Tu Es Le Héro

[![Déploiement](https://img.shields.io/badge/🚀_Démo_Live-dagda.chtibox.ovh-blue?style=for-the-badge)](https://dagda.chtibox.ovh/)
[![CI Status](https://img.shields.io/github/actions/workflow/status/bertrandgressier/adventure-tome/ci.yml?branch=main&style=for-the-badge&label=Tests)](https://github.com/bertrandgressier/adventure-tome/actions/workflows/ci.yml)
[![codecov](https://img.shields.io/codecov/c/github/bertrandgressier/adventure-tome?style=for-the-badge&logo=codecov)](https://codecov.io/gh/bertrandgressier/adventure-tome)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg?style=for-the-badge)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
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

## 📊 Couverture de code

[![Codecov Coverage](https://codecov.io/gh/bertrandgressier/adventure-tome/branch/main/graphs/sunburst.svg)](https://codecov.io/gh/bertrandgressier/adventure-tome)

La couverture de tests est automatiquement mesurée et rapportée sur chaque Pull Request. L'architecture Clean permet une couverture élevée avec **71 tests unitaires** couvrant la logique métier (Domain & Application layers).

## 📋 Prérequis

- Node.js 24+
- pnpm (recommandé)

## 🚀 Démarrage rapide

```bash
# Installer les dépendances
pnpm install

# Mode développement
pnpm dev

# Build production
pnpm build && pnpm start
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📱 Installation PWA

**Android (Chrome, Edge)** : Menu ⋮ → "Installer l'application"  
**iOS (Safari)** : Bouton Partager ⎋ → "Sur l'écran d'accueil" ➕

## 📖 Documentation

- [📋 Fonctionnalités complètes](./docs/FEATURES.md)
- [🏗️ Architecture technique](./docs/ARCHITECTURE.md)
- [📝 Format fiche personnage](./docs/CHARACTER_SHEET.md)
- [⚔️ Règles de combat](./docs/COMBAT.md)
- [🎨 Guide du thème](./docs/THEMING.md)
- [📘 Guide de migration Clean Architecture](./docs/MIGRATION_GUIDE.md)

## ☕ Soutenir le projet

Ce projet est **100% gratuit et open-source**. Si ce projet vous est utile ou si vous voulez soutenir ce jeu, vous pouvez m'offrir un café ☕

[![Donate](https://img.shields.io/badge/Donate-PayPal-blue.svg)](https://www.paypal.com/donate/?hosted_button_id=Q5EPDFZEEXQHJ)

Merci pour votre soutien ! ❤️

## � Licence

Ce projet est sous licence **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)**.

### ✅ Ce que vous POUVEZ faire

- Utiliser l'application pour un usage personnel
- Modifier le code source
- Créer des forks et contribuer via Pull Request
- Partager l'application en citant l'auteur

### ❌ Ce que vous NE POUVEZ PAS faire

- Utiliser l'application à des fins commerciales
- Vendre ou revendre l'application
- Intégrer l'application dans un produit commercial

### 💼 Usage commercial

Pour toute utilisation commerciale, veuillez me contacter pour obtenir une licence commerciale.

[![License: CC BY-NC-SA 4.0](https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

**Copyright © 2025 Bertrand Gressier** - Tous droits réservés pour l'usage commercial.
