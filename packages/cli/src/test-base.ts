import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = path.join(__dirname, '../../../templates/base');

const requiredFiles = [
  'src/adapters/storage.ts',
  'src/types/walrus.ts',
  'src/types/index.ts',
  'src/utils/env.ts',
  'src/utils/format.ts',
  '.env.example',
  '.gitignore',
  'package.json',
  'tsconfig.json',
  'README.md',
];

let passed = 0;
let failed = 0;

console.log('🔍 Validating base template structure...\n');

for (const file of requiredFiles) {
  const fullPath = path.join(basePath, file);
  const exists = fs.existsSync(fullPath);

  if (exists) {
    console.log(`✓ ${file}`);
    passed++;
  } else {
    console.log(`✗ MISSING: ${file}`);
    failed++;
  }
}

console.log(`\n${passed}/${requiredFiles.length} files found`);

if (failed > 0) {
  console.error(`\n❌ Validation failed: ${failed} files missing`);
  process.exit(1);
} else {
  console.log('\n✅ Base layer validation passed!');
  process.exit(0);
}
