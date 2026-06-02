import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const port = Number(process.env.PORT || 3000);
const rootDir = fileURLToPath(new URL('./dist', import.meta.url));
const indexFile = join(rootDir, 'index.html');

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

function resolveFilePath(urlPath) {
  const decodedPath = decodeURIComponent(urlPath.split('?')[0] || '/');
  const requestedPath = normalize(decodedPath).replace(/^(\.\.[/\\])+/, '');
  const filePath = join(rootDir, requestedPath);

  if (existsSync(filePath) && statSync(filePath).isFile()) {
    return filePath;
  }

  return indexFile;
}

const server = createServer((request, response) => {
  if (!existsSync(indexFile)) {
    response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Application build output was not found.');
    return;
  }

  const filePath = resolveFilePath(request.url || '/');
  const contentType = contentTypes[extname(filePath)] || 'application/octet-stream';

  response.writeHead(200, {
    'Content-Type': contentType,
    'Cache-Control': filePath === indexFile
      ? 'no-cache'
      : 'public, max-age=31536000, immutable'
  });

  createReadStream(filePath).pipe(response);
});

server.listen(port, '0.0.0.0', () => {
  console.log(`DHA Device Hub is listening on port ${port}`);
});
