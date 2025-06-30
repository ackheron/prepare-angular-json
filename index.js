#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import stripJsonComments from 'strip-json-comments';

const root = process.cwd();
const pkgPath = join(root, 'package.json');
const scriptPath = join(root, 'prepare-angular-json.js');

// --- 1. Vérifier que package.json existe
if (!existsSync(pkgPath)) {
  console.error('❌ Aucun fichier package.json trouvé. Êtes-vous dans un projet Node/Angular ?');
  process.exit(1);
}

// --- 2. Lire le package.json
const pkgRaw = readFileSync(pkgPath, 'utf8');
const pkg = JSON.parse(pkgRaw);

// --- 3. Modifier ou ajouter les scripts
pkg.scripts = pkg.scripts || {};
pkg.scripts['prepare-json'] = 'node prepare-angular-json.js';
pkg.scripts['start'] = 'pnpm run prepare-json && ng serve';

// --- 4. Écrire le nouveau package.json
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
console.log('✅ Scripts ajoutés au package.json : "prepare-json" et "start".');

// --- 5. Créer le fichier prepare-angular-json.js s’il n’existe pas
if (!existsSync(scriptPath)) {
  const template = `#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from 'fs';
import stripJsonComments from 'strip-json-comments';

const inputPath = './angular.jsonc';
const outputPath = './angular.json';

if (!existsSync(inputPath)) {
  console.error(\`❌ Le fichier "\${inputPath}" est introuvable.\`);
  process.exit(1);
}

try {
  const jsonWithComments = readFileSync(inputPath, 'utf8');
  const cleanedJson = stripJsonComments(jsonWithComments);
  JSON.parse(cleanedJson);
  writeFileSync(outputPath, cleanedJson);
  console.log(\`✅ "\${outputPath}" généré avec succès à partir de "\${inputPath}".\`);
} catch (error) {
  console.error('❌ Erreur :', error.message);
  process.exit(1);
}
`;

  writeFileSync(scriptPath, template);
  console.log('✅ Fichier prepare-angular-json.js généré.');
} else {
  console.log('ℹ️ Fichier prepare-angular-json.js déjà présent.');
}

console.log('✨ Configuration terminée.');

