# 📝 Historique des nouveautés

Bienvenue dans l'historique des nouveautés d'Adventure Tome ! 🗡️

Cette page liste uniquement les changements visibles pour vous, les aventuriers :

- ✨ Nouvelles fonctionnalités
- 🐛 Corrections de bugs
- ⚡ Améliorations de performance

Pour les détails techniques complets, consultez le [CHANGELOG.md](./CHANGELOG.md).

---

## Version 1.7.0
*17 novembre 2025*

### ✨ Nouvelles fonctionnalités

• Affichage fantomatique des personnages morts et simplification popup défaite
• Ajout composant BookTag pour identifier les 3 livres de la saga

---

## Version 1.6.0
*14 novembre 2025*

### ✨ Nouvelles fonctionnalités

• Ajout du lien de donation PayPal

---

## Version 1.5.1
*14 novembre 2025*

### 🐛 Corrections de bugs

• Retirer autoFocus du formulaire de combat pour mobile

---

## Version 1.5.0
*14 novembre 2025*

### ✨ Nouvelles fonctionnalités

• Suivi personnalisé des actions utilisateur (analytics)

---

## Version 1.4.4
*14 novembre 2025*

### 🐛 Corrections de bugs

• Déplacement de la lecture localStorage vers useState initializer
• Correction de l'état de lecture incorrect au premier chargement de la musique

---

## Version 1.4.3
*14 novembre 2025*

### 🐛 Corrections de bugs

• Simplification de l'implémentation Google Analytics
• Préservation de NEXT_PUBLIC_GA_ID dans .env.production

---

## Version 1.4.2
*14 novembre 2025*

### 🐛 Corrections de bugs

• Encapsulation de GoogleAnalytics dans Suspense pour useSearchParams

---

## Version 1.4.1
*14 novembre 2025*

### 🐛 Corrections de bugs

• Utilisation de NEXT_PUBLIC_GA_ID pour le suivi client

---

## Version 1.4.0
*14 novembre 2025*

### ✨ Nouvelles fonctionnalités

• Ajout du déclencheur manuel pour le workflow de release

### ⚡ Améliorations de performance

• Optimisation du cache de build CI

---

## Version 1.3.1
*14 novembre 2025*

### 🐛 Corrections de bugs

• Icône musique affichée correctement au démarrage

---

## Version 1.3.0
*14 novembre 2025*

### ✨ Nouvelles fonctionnalités

• Support Google Analytics avec injection runtime

### 🐛 Corrections de bugs

• Génération correcte des tags Docker avec version

---

## Version 1.2.0
*14 novembre 2025*

### ✨ Nouvelles fonctionnalités

• Ajout lien vers CHANGELOG depuis la version
• Release uniquement sur changements du code applicatif

---

## Version 1.1.1
*14 novembre 2025*

### 🐛 Corrections de bugs

• Séparation des workflows release et docker

---

## Version 1.1.0
*14 novembre 2025*

### ✨ Nouvelles fonctionnalités

• Ajout liens GitHub et signalement de bugs

### 🐛 Corrections de bugs

• Correction des titres en double et nettoyage
• Corrections UI et ESLint

---

## Version 1.0.0
*13 novembre 2025*

### ✨ Nouvelles fonctionnalités

• Création de personnage avec lancer de dés
• Sélection de talents et stats selon les règles correctes + mode manuel
• Stockage IndexedDB pour les personnages + affichage de la liste
• Thème dark sépia avec style médiéval
• Amélioration de la présentation de la liste de personnages
• Mise à jour de la création de personnage avec stats et sélection de talents corrects
• Mise en place semantic-release et CI/CD automatique

### 🐛 Corrections de bugs

• Application du thème dark au composant InstallPrompt
• Correction du nom de collection vers 'La Saga Dadga'
• Amélioration de la lisibilité des boutons avec police grasse et texte plus grand
• Bouton visible avec fond et bordure appropriés
• Recréation de la page de création de personnage
• Suppression du code dupliqué causant une erreur de parsing
• Suppression de l'équipement de départ (pas dans les règles du livre)
• Utilisation de couleur dorée explicite pour le fond du bouton
• Utilisation de texte noir pur sur bouton doré pour contraste maximum
