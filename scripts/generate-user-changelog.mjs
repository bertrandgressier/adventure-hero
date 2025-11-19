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

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const version = process.argv[2];

// Lire CHANGELOG.md complet
const changelogPath = path.join(__dirname, '..', 'CHANGELOG.md');
const changelog = fs.readFileSync(changelogPath, 'utf-8');

// Extraire la section de la version spécifique
// Supporte les titres H1 (#) et H2 (##) générés par semantic-release
const escapedVersion = version.replace(/\./g, '\\.');
// Utilisation de (?:^|\n) au lieu du flag 'm' pour éviter que $ ne matche la fin de ligne
const versionRegex = new RegExp(`(?:^|\\n)#+ \\[${escapedVersion}\\][\\s\\S]*?(?=\\n#+ \\[|$)`);
const versionMatch = changelog.match(versionRegex);

if (!versionMatch) {
  console.log(`Version ${version} non trouvée dans CHANGELOG.md`);
  process.exit(0);
}

const versionSection = versionMatch[0].trim();

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
    // Ignorer les scopes techniques
    if (/\*\*(ci|test|build|chore|refactor|style|docs|lint|analytics):\*\*/.test(line)) {
      continue;
    }

    // Nettoyer le message : retirer les références techniques
    let message = line
      .replace(/\*\*[^:]+:\*\* /, '') // Retirer le scope (ex: **analytics:** )
      .replace(/ \(\[[a-f0-9]+\].*?\)$/, '') // Retirer le hash de commit
      .replace(/^\* /, '- '); // Remplacer * par -
    
    userChanges[currentSection].push(message);
  }
}

// Construire la nouvelle entrée de version
let versionEntry = `## Version ${version}\n`;
versionEntry += `*${new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}*\n\n`;

let hasChanges = false;

for (const [section, items] of Object.entries(userChanges)) {
  if (items.length > 0) {
    hasChanges = true;
    versionEntry += `${section}\n\n`;
    items.forEach(item => {
      versionEntry += `${item}\n`;
    });
    versionEntry += '\n';
  }
}

if (!hasChanges) {
  versionEntry += "Cette version contient des améliorations techniques et des corrections mineures.\n\n";
}

versionEntry += `---\n\n`;

// Lire l'ancien changelog user si il existe
const userChangelogPath = path.join(__dirname, '..', 'CHANGELOG_USER.md');
let existingUserChangelog = '';

if (fs.existsSync(userChangelogPath)) {
  existingUserChangelog = fs.readFileSync(userChangelogPath, 'utf-8');
  
  // Trouver la position après le header (après la ligne ---)
  const headerEndMatch = existingUserChangelog.match(/---\n\n/);
  if (headerEndMatch) {
    const headerEnd = headerEndMatch.index + headerEndMatch[0].length;
    const header = existingUserChangelog.substring(0, headerEnd);
    const existingVersions = existingUserChangelog.substring(headerEnd);
    
    // Vérifier si cette version existe déjà
    const versionPattern = new RegExp(`## Version ${version.replace(/\./g, '\\.')}\\n[\\s\\S]*?(?=\\n## Version |$)`);
    const existingVersionMatch = existingVersions.match(versionPattern);
    
    if (existingVersionMatch) {
      const existingVersionContent = existingVersionMatch[0];
      
      // Comparer le contenu (ignorer la date et les espaces de fin)
      const normalizeContent = (content) => 
        content
          .replace(/\*\d{1,2} \w+ \d{4}\*/g, '') // Retirer dates
          .trim();
      
      const existingNormalized = normalizeContent(existingVersionContent);
      const newNormalized = normalizeContent(versionEntry);
      
      if (existingNormalized === newNormalized) {
        console.log(`✅ Version ${version} déjà à jour dans CHANGELOG_USER.md`);
        process.exit(0);
      }
      
      // Le contenu a changé, remplacer la version existante
      console.log(`🔄 Mise à jour de la version ${version} dans CHANGELOG_USER.md`);
      const updatedVersions = existingVersions.replace(versionPattern, versionEntry.trimEnd() + '\n');
      const finalUserChangelog = header + updatedVersions;
      fs.writeFileSync(userChangelogPath, finalUserChangelog, 'utf-8');
    } else {
      // Nouvelle version, insérer après le header
      const finalUserChangelog = header + versionEntry + existingVersions;
      fs.writeFileSync(userChangelogPath, finalUserChangelog, 'utf-8');
    }
  } else {
    // Pas de header trouvé, créer un nouveau fichier complet
    const finalUserChangelog = createFullChangelog(versionEntry);
    fs.writeFileSync(userChangelogPath, finalUserChangelog, 'utf-8');
  }
} else {
  // Fichier n'existe pas, créer un nouveau
  const finalUserChangelog = createFullChangelog(versionEntry);
  fs.writeFileSync(userChangelogPath, finalUserChangelog, 'utf-8');
}

function createFullChangelog(versionEntry) {
  let changelog = '# 📝 Historique des nouveautés\n\n';
  changelog += 'Bienvenue dans l\'historique des nouveautés d\'Adventure Tome ! 🗡️\n\n';
  changelog += 'Cette page liste uniquement les changements visibles pour vous, les aventuriers :\n\n';
  changelog += '- ✨ Nouvelles fonctionnalités\n';
  changelog += '- 🐛 Corrections de bugs\n';
  changelog += '- ⚡ Améliorations de performance\n\n';
  changelog += 'Pour les détails techniques complets, consultez le [CHANGELOG.md](./CHANGELOG.md).\n\n';
  changelog += '---\n\n';
  changelog += versionEntry;
  return changelog;
}

console.log(`✅ CHANGELOG_USER.md généré avec succès pour la version ${version}`);
