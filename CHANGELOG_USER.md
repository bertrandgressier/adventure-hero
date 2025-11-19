# 📝 Historique des nouveautés

Bienvenue dans l'historique des nouveautés d'Adventure Tome ! 🗡️

Cette page liste uniquement les changements visibles pour vous, les aventuriers :

- ✨ Nouvelles fonctionnalités
- 🐛 Corrections de bugs
- ⚡ Améliorations de performance

Pour les détails techniques complets, consultez le [CHANGELOG.md](./CHANGELOG.md).

---

## Version 2.2.1
*19 novembre 2025*

### 🐛 Corrections de bugs

- correct user changelog generation regex for header levels
- improve character list design for mobile
- improve visual distinction for critical health and death states
- update character detail stats to match home screen design

---

## Version 2.2.0
*19 novembre 2025*

### ✨ Nouvelles fonctionnalités

- add character notebook feature with persistence
- improve user changelog generation and link

---

## Version 2.1.0
*19 novembre 2025*

### 🐛 Corrections de bugs

- translate error messages to French

### ✨ Nouvelles fonctionnalités

- allow changing book from paragraph section with dialog

---

## Version 2.0.0
*18 novembre 2025*

### ✨ Nouvelles fonctionnalités

- implémentation de Zustand pour la gestion d'état centralisée

---

## Version 1.7.0
*17 novembre 2025*

### ✨ Nouvelles fonctionnalités

- affichage fantomatique des personnages morts et simplification popup défaite
- ajout composant BookTag pour identifier les 3 livres de la saga

---

## Version 1.6.0
*14 novembre 2025*

### ✨ Nouvelles fonctionnalités

- ajout du lien de donation PayPal

---

## Version 1.5.1
*14 novembre 2025*

### 🐛 Corrections de bugs

- retirer autoFocus du formulaire de combat pour mobile

---

## Version 1.4.4
*14 novembre 2025*

### 🐛 Corrections de bugs

- prevent incorrect playing state on first load

---

## Version 1.4.3
*14 novembre 2025*

### 🐛 Corrections de bugs

- preserve NEXT_PUBLIC_GA_ID in .env.production

---

## Version 1.4.2
*14 novembre 2025*

### 🐛 Corrections de bugs

- wrap GoogleAnalytics in Suspense for useSearchParams

---

## Version 1.4.0
*14 novembre 2025*

### ⚡ Améliorations de performance

- optimize CI build caching

---

## Version 1.3.1
*14 novembre 2025*

### 🐛 Corrections de bugs

- icône musique affichée correctement au démarrage

---

## Version 1.3.0
*14 novembre 2025*

### 🐛 Corrections de bugs

- génération correcte des tags Docker avec version

### ✨ Nouvelles fonctionnalités

- support Google Analytics avec injection runtime

---

## Version 1.2.0
*14 novembre 2025*

### ✨ Nouvelles fonctionnalités

- ajout lien vers CHANGELOG depuis la version
- release uniquement sur changements du code applicatif

---

## Version 1.1.1
*14 novembre 2025*

### 🐛 Corrections de bugs

- séparation des workflows release et docker

---

## Version 1.1.0
*14 novembre 2025*

### 🐛 Corrections de bugs

- correction des titres en double et nettoyage
- corrections UI et ESLint

### ✨ Nouvelles fonctionnalités

- ajout liens GitHub et signalement de bugs

---

## Version 1.0.0
*13 novembre 2025*

### 🐛 Corrections de bugs

- apply dark theme to InstallPrompt component
- correct collection name to 'La Saga Dadga'
- improve button readability with bold font and larger text
- make button visible with proper background and border
- recreate character creation page from scratch
- remove duplicate code causing parsing error
- remove starting equipment (not in book rules)
- use explicit golden color for button background
- use pure black text on golden button for maximum contrast

### ✨ Nouvelles fonctionnalités

- add character creation page with dice rolling
- character creation with correct talents and stats rules + manual mode
- implement dark sepia theme with medieval styling
- improve character list presentation with better visibility
- IndexedDB storage for characters + display character list
- mise en place semantic-release et CI/CD automatique
- update character creation with correct stats and talent selection
