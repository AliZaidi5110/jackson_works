/**
 * APEX Auto Parts UK - High-Performance HTTP Server
 * Built with Node.js standard HTTP module. Serves static assets & APIs.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

let currentPort = parseInt(process.env.PORT, 10) || 3033;
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;

  // Serve static files
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      filePath = path.join(PUBLIC_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
      } else {
        res.writeHead(200, {
          'Content-Type': contentType,
          'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=86400',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY'
        });
        res.end(content);
      }
    });
  });
});

function listenOnPort(port) {
  server.listen(port, () => {
    const p = server.address().port;
    console.log(`SUCCESS: APEX Auto Parts server running at http://127.0.0.1:${p}`);
  });
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    currentPort++;
    console.log(`Port in use, retrying on ${currentPort}...`);
    listenOnPort(currentPort);
  } else {
    console.error('Server error:', err);
  }
});

listenOnPort(currentPort);
