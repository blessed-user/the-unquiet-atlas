import {
  chmodSync,
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const root = fileURLToPath(new URL('.', import.meta.url));
const output = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function emptyDirectory(path: string): void {
  mkdirSync(path, { recursive: true });
  for (const name of readdirSync(path)) rmSync(join(path, name), { recursive: true, force: true });
}

function makeReadable(path: string): void {
  const stat = lstatSync(path);
  chmodSync(path, stat.isDirectory() ? 0o755 : 0o644);
  if (stat.isDirectory()) for (const name of readdirSync(path)) makeReadable(join(path, name));
}

emptyDirectory(output);
cpSync(join(root, 'game'), join(output, 'game'), { recursive: true });

const shots = join(root, 'screenshots');
if (!existsSync(shots)) throw new Error('screenshots/ is required');
cpSync(shots, join(output, 'screenshots'), { recursive: true });

writeFileSync(
  join(output, 'dossier.json'),
  buildDossier(output, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);

for (const name of readdirSync(output)) makeReadable(join(output, name));
