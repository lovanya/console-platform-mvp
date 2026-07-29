#!/usr/bin/env node
/**
 * Minimal static file server for production-like preview.
 * Serves any directory via HTTP without dependencies.
 * Supports gzip compression for text-based MIME types.
 *
 * Usage: node scripts/static-server.js <root-dir> <port>
 */

const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')
const zlib = require('node:zlib')

const root = path.resolve(process.argv[2])
const port = parseInt(process.argv[3], 10)

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.map': 'application/json; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

const COMPRESSIBLE = new Set(['.html', '.js', '.mjs', '.css', '.json', '.svg'])

if (!fs.existsSync(root)) {
  console.error(`Static root not found: ${root}`)
  process.exit(1)
}

function compress(data, acceptEncoding) {
  if (!acceptEncoding) return { data, encoding: null }

  // Prefer gzip (widely supported, decent ratio)
  // Brotli would be better but requires native dependency
  if (acceptEncoding.includes('gzip')) {
    return {
      data: zlib.gzipSync(data, { level: 9 }),
      encoding: 'gzip',
    }
  }
  if (acceptEncoding.includes('deflate')) {
    return { data: zlib.deflateSync(data), encoding: 'deflate' }
  }
  return { data, encoding: null }
}

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0])
  if (urlPath === '/' || urlPath === '') urlPath = '/index.html'

  // Prevent path traversal
  const filePath = path.normalize(path.join(root, urlPath))
  if (!filePath.startsWith(root)) {
    res.writeHead(403)
    res.end('Forbidden')
    return
  }

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      // SPA fallback: serve index.html for non-existent paths (no extension)
      if (!path.extname(urlPath)) {
        const indexPath = path.join(root, 'index.html')
        fs.readFile(indexPath, (err2, data) => {
          if (err2) {
            res.writeHead(404)
            res.end('Not found')
            return
          }
          const compressed = compress(data, req.headers['accept-encoding'])
          res.writeHead(200, {
            'Content-Type': MIME['.html'],
            'Content-Encoding': compressed.encoding || 'identity',
            'Cache-Control': 'no-cache',
            Vary: 'Accept-Encoding',
          })
          res.end(compressed.data)
        })
        return
      }
      res.writeHead(404)
      res.end('Not found')
      return
    }

    const ext = path.extname(filePath).toLowerCase()
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500)
        res.end('Server error')
        return
      }

      const mime = MIME[ext] || 'application/octet-stream'
      const headers = {
        'Content-Type': mime,
        'Cache-Control': 'no-cache',
        Vary: 'Accept-Encoding',
      }

      if (COMPRESSIBLE.has(ext)) {
        const compressed = compress(data, req.headers['accept-encoding'])
        if (compressed.encoding) {
          headers['Content-Encoding'] = compressed.encoding
        }
        res.writeHead(200, headers)
        res.end(compressed.data)
      } else {
        res.writeHead(200, headers)
        res.end(data)
      }
    })
  })
})

server.listen(port, () => {
  console.log(`Static server serving ${root} on http://localhost:${port} (gzip enabled)`)
})
