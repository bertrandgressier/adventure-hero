#!/usr/bin/env node

/**
 * Génère un changelog user-friendly à partir de CHANGELOG.md
 * 
 * Filtre uniquement les changements pertinents pour les utilisateurs finaux :
 * - feat: Nouvelles fonctionnalités
 * - fix: Corrections de bugs
 * - perf: Améliorations de performance
 * 
 * Exclut les changements techniques :
 * - chore, refactor, docs, test, ci, build
 */

const fs = require('fs');
const path = require('path');

const version = process.argv[2];

// Lire CHANGELOG.md complet
const changelogPath = path.join(__dirname, '..', 'CHANGELOG.md');
const changelog = fs.readFileSync(changelogPath, 'utf-8');

// Extraire la section de la dernière version
const versionMatch = changelog.match(/## \[([\d.]+)\][\s\S]*?(?=## \[|$)/);
if (!versionMatch) {
  console.log('Aucune version trouvée dans CHANGELOG.md');
  process.exit(0);
}

const versionSection = versionMatch[0];

// Filtrer les types de commits user-friendly
const userChanges = {
  '### ✨ Nouvelles fonctionnalités': [],
  '### 🐛 Corrections de bugs': [],
  '### ⚡ Améliorations de performance': [],
};

const lines = versionSection.split('\n');
let currentSection = null;

for (const line of lines) {
  // Détection des sections Features, Bug Fixes, Performance
  if (line.includes('### Features')) {
    currentSection = '### ✨ Nouvelles fonctionnalités';
  } else if (line.includes('### Bug Fixes')) {
    currentSection = '### 🐛 Corrections de bugs';
  } else if (line.includes('### Performance')) {
    currentSection = '### ⚡ Améliorations de performance';
  }
  
  // Capturer les items de la section courante
  if (currentSection && line.startsWith('* ')) {
    // Nettoyer le message : retirer les références techniques
    let message = line
      .replace(/\* \*\*[^:]+:\*\* /, '* ') // Retirer le scope
      .replace(/ \(\[[a-f0-9]+\].*?\)$/, '') // Retirer le hash de commit
      .replace(/^* /, '• '); // Remplacer * par •
    
    userChanges[currentSection].push(message);
  }
}

// Construire le changelog user-friendly
let userChangelog = `# 📝 Nouveautés - Version ${version}\n\n`;
userChangelog += `*${new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}*\n\n`;

let hasChanges = false;

for (const [section, items] of Object.entries(userChanges)) {
  if (items.length > 0) {
    hasChanges = true;
    userChangelog += `${section}\n\n`;
    items.forEach(item => {
      userChangelog += `${item}\n`;
    });
    userChangelog += '\n';
  }
}

if (!hasChanges) {
  userChangelog += "Cette version contient des améliorations techniques et des corrections mineures.\n\n";
}

userChangelog += `---\n\n`;
userChangelog += `Pour voir tous les détails techniques, consultez le [CHANGELOG complet](./CHANGELOG.md).\n`;

// Lire l'ancien changelog user si il existe
const userChangelogPath = path.join(__dirname, '..', 'CHANGELOG_USER.md');
let existingUserChangelog = '';

if (fs.existsSync(userChangelogPath)) {
  existingUserChangelog = fs.readFileSync(userChangelogPath, 'utf-8');
  // Retirer l'ancien header si présent
  existingUserChangelog = existingUserChangelog.replace(/^# 📝 Historique des nouveautés\n\n/, '');
}

// Ajouter la nouvelle version en haut
const finalUserChangelog = `# 📝 Historique des nouveautés\n\n${userChangelog}${existingUserChangelog}`;

// Écrire le changelog user
fs.writeFileSync(userChangelogPath, finalUserChangelog, 'utf-8');

console.log(`✅ CHANGELOG_USER.md généré avec succès pour la version ${version}`);
