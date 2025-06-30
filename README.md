# Prepare Angular JSON.

**Prepare Angular JSON** is a lightweight CLI tool that generates a clean `angular.json` file from a commented `angular.jsonc`.  
It allows you to keep your Angular configuration files readable and well-documented, while staying fully compatible with the Angular CLI.

## ✨ Features

- ✅ Converts `angular.jsonc` (with comments) into valid `angular.json`
- ✅ Automatically adds `prepare-json` and `start` scripts to your `package.json`
- ✅ Validates JSON output before writing
- ✅ Ready for integration into CI/CD pipelines
- ✅ No runtime dependencies in your Angular app

## 🚀 Quick Start

### Install globally

```bash
npm install -g prepare-angular-json

```

### Run the tool

```
prepare-angular-json
```
This will:

- Create or update `angular.json` from `angular.jsonc`

- Add useful scripts to your `package.json` if needed

### Use it

```bash
pnpm start
#or
npm run start
```

## 🛠 What it does

The tool adds or updates these entries in your package.json:

```json
"scripts": {
  "prepare-json": "node prepare-angular-json.js",
  "start": "pnpm run prepare-json && ng serve"
}
```

And generates this file if not present:
```js
// prepare-angular-json.js
import { readFileSync, writeFileSync, existsSync } from 'fs';
import stripJsonComments from 'strip-json-comments';

const inputPath = './angular.jsonc';
const outputPath = './angular.json';

if (!existsSync(inputPath)) {
  console.error(`❌ File "${inputPath}" not found.`);
  process.exit(1);
}

try {
  const jsonWithComments = readFileSync(inputPath, 'utf8');
  const cleanedJson = stripJsonComments(jsonWithComments);
  JSON.parse(cleanedJson);
  writeFileSync(outputPath, cleanedJson);
  console.log(`✅ "${outputPath}" successfully created from "${inputPath}".`);
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
```
