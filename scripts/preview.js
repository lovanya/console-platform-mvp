#!/usr/bin/env node
/**
 * Preview orchestrator — builds all packages and serves them like production.
 *
 * Order:
 *   1. common: vite build (production mode)
 *   2. ecs:    webpack build (production mode)
 *   3. shell:  rspack build (production mode)
 *   4. Serve all three:
 *      - common → vite preview (built-in static server) on port 3002
 *      - ecs    → static server on port 3001
 *      - shell  → static server on port 3000
 *
 * The Shell's webpack config uses isDev=false to decide remote URLs.
 * For local preview, we set NODE_ENV=production but the URLs still need
 * to point to localhost. Solution: override via env vars (see below).
 */

const { spawn, spawnSync } = require('node:child_process')
const path = require('node:path')

const root = path.join(__dirname, '..')

const COLOR = {
  common: '\x1b[34m',
  ecs: '\x1b[35m',
  shell: '\x1b[36m',
  reset: '\x1b[0m',
}

const colorize = (name, str) => `${COLOR[name]}${str}${COLOR.reset}`

function logHeader(msg) {
  console.log('\n' + colorize('shell', '━'.repeat(60)))
  console.log(colorize('shell', ` ${msg}`))
  console.log(colorize('shell', '━'.repeat(60)) + '\n')
}

function pipeStream(stream, name) {
  stream.on('data', (chunk) => {
    const lines = chunk.toString().split('\n')
    lines.forEach((line) => {
      if (line.trim()) {
        process.stdout.write(colorize(name, `[${name}] `) + line + '\n')
      }
    })
  })
}

function run(name, cmd, args, cwd, env = {}) {
  const child = spawn(cmd, args, {
    cwd,
    env: {
      ...process.env,
      ...env,
      // Local preview always uses localhost URLs (override production CDN URLs)
      PREVIEW_LOCAL: '1',
      FORCE_COLOR: '1',
    },
    shell: true,
  })
  pipeStream(child.stdout, name)
  pipeStream(child.stderr, name)
  child.on('exit', (code) => {
    if (code !== 0) {
      console.log(colorize(name, `[${name}] exited with code ${code}`))
    }
  })
  return child
}

function runSync(name, cmd, args, cwd) {
  console.log(colorize(name, `[${name}] starting...`))
  const result = spawnSync(cmd, args, {
    cwd,
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      // Force Shell to use localhost URLs (not CDN) for local preview
      PREVIEW_LOCAL: '1',
    },
  })
  if (result.status !== 0) {
    console.error(colorize(name, `[${name}] build failed with code ${result.status}`))
    process.exit(1)
  }
  console.log(colorize(name, `[${name}] build complete`))
}

function main() {
  logHeader('Building all packages (production mode)')

  // Build common — populates dist/ for vite preview
  runSync(
    'common',
    'npx',
    ['vite', 'build', '--mode', 'production'],
    path.join(root, 'packages/common'),
  )

  // Build ecs — populates dist/ for static server
  runSync('ecs', 'npx', ['webpack', '--mode', 'production'], path.join(root, 'packages/ecs'))

  // Build shell — populates dist/ for static server
  runSync(
    'shell',
    'npx',
    ['rspack', 'build', '--mode', 'production'],
    path.join(root, 'packages/shell'),
  )

  logHeader('Starting preview servers')

  // Common: use vite preview (built-in static server, handles dist/ correctly)
  const _commonServer = run(
    'common',
    'npx',
    ['vite', 'preview', '--port', '3002'],
    path.join(root, 'packages/common'),
  )

  // ECS: static server
  const _ecsServer = run(
    'ecs',
    'node',
    [path.join(root, 'scripts/static-server.js'), path.join(root, 'packages/ecs/dist'), '3001'],
    root,
  )

  // Shell: static server
  const shellServer = run(
    'shell',
    'node',
    [path.join(root, 'scripts/static-server.js'), path.join(root, 'packages/shell/dist'), '3000'],
    root,
  )

  logHeader('Preview running')
  console.log(colorize('common', `  common:  http://localhost:3002`))
  console.log(colorize('ecs', `  ecs:     http://localhost:3001`))
  console.log(colorize('shell', `  shell:   http://localhost:3000  ← open this`))
  console.log('\n  Press Ctrl+C to stop.\n')

  const cleanup = () => {
    console
      .log('\nShutting down...')
      [(_commonServer, _ecsServer, shellServer)].forEach((p) => p.kill('SIGTERM'))
    setTimeout(() => process.exit(0), 500)
  }

  process.on('SIGINT', cleanup)
  process.on('SIGTERM', cleanup)
}

main()
