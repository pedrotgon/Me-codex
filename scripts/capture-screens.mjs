import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const scriptPath = path.join(__dirname, 'capture-screens.ts');

const result = spawnSync('npx', ['tsx', `"${scriptPath}"`], {
  stdio: 'inherit',
  shell: true,
});

process.exit(result.status ?? 0);
