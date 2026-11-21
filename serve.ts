import { createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('./game', import.meta.url)));
const requestedPort = Number(process.argv[process.argv.indexOf('--port') + 1]);
const port = Number.isInteger(requestedPort) && requestedPort > 0 ? requestedPort : 8080;
const types: Record<string, string> = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
};

createServer((request, response) => {
  let pathname = '/';
  try {
    pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
  } catch {
    response.writeHead(400).end('Bad request');
    return;
  }
  if (pathname.endsWith('/')) pathname += 'index.html';
  const file = resolve(root, normalize(`.${pathname}`));
  if (file !== root && !file.startsWith(root + sep)) {
    response.writeHead(403).end('Forbidden');
    return;
  }
  try {
    const stat = statSync(file);
    if (!stat.isFile()) throw new Error('not a file');
    response.writeHead(200, {
      'cache-control': 'no-store',
      'content-length': stat.size,
      'content-type': types[extname(file).toLowerCase()] ?? 'application/octet-stream',
    });
    createReadStream(file).pipe(response);
  } catch {
    response.writeHead(404).end('Not found');
  }
}).listen(port, '127.0.0.1', () => console.log(`Field Notes is on http://localhost:${port}`));
