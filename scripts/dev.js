#!/usr/bin/env node
/**
 * Dev orchestrator — starts all three packages in the right order.
 *
 * Order:
 *   1. common: vite build (synchronous, populates dist/)
 *   2. common: vite preview (serves built dist on port 3002)
 *   3. ecs:    webpack serve (port 3001)
 *   4. shell:  rspack serve (port 3000)
 *
 * Why not just `pnpm --parallel -r dev`?
 *   common's dev script uses `vite build --watch & vite preview` with
 *   a shell `&` operator. Under pnpm's parallel runner, the `&`
 *   backgrounding is unreliable across forked shells. Building common
 *   synchronously first guarantees dist/ exists before preview starts.
 *
 * No external dependencies — uses Node's built-in child_process.
 */

const { spawn, spawnSync } = require('node:child_process')
const path = require('node:path')

const root = path.join(__dirname, '..')

const COLOR = {
  common: '\x1b[34m', // blue
  ecs: '\x1b[35m', // magenta
  shell: '\x1b[36m', // cyan
  reset: '\x1b[0m',
}

function colorize(name, str) {
  return `${COLOR[name]}${str}${COLOR.reset}`
}

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

function startProcess(name, cmd, args, cwd) {
  const child = spawn(cmd, args, {
    cwd,
    env: { ...process.env, FORCE_COLOR: '1' },
    shell: true,
  })

  pipeStream(child.stdout, name)
  pipeStream(child.stderr, name)

  child.on('exit', (code) => {
    console.log(colorize(name, `[${name}] exited with code ${code}`))
    if (code !== 0 && code !== null) {
      console.log(colorize('shell', `[orchestrator] ${name} crashed, killing others`))
      process.exit(1)
    }
  })

  return child
}

function buildCommonSync() {
  logHeader('Building common (Rspack) and billing (Vite) — populates dist/')

  const common = spawnSync('npx', ['rspack', 'build', '--mode', 'production'], {
    cwd: path.join(root, 'packages/common'),
    stdio: 'inherit',
    shell: true,
  })
  if (common.status !== 0) {
    console.error('common build failed, aborting')
    process.exit(1)
  }

  const billing = spawnSync('npx', ['vite', 'build'], {
    cwd: path.join(root, 'packages/billing'),
    stdio: 'inherit',
    shell: true,
  })
  if (billing.status !== 0) {
    console.error('billing build failed, aborting')
    process.exit(1)
  }
}

function main() {
  buildCommonSync()

  logHeader('Starting all dev servers')

  const procs = {
    common: startProcess(
      'common',
      'npx',
      ['rspack', 'serve', '--mode', 'development'],
      path.join(root, 'packages/common'),
    ),
    ecs: startProcess(
      'ecs',
      'npx',
      ['webpack', 'serve', '--mode', 'development'],
      path.join(root, 'packages/ecs'),
    ),
    shell: startProcess(
      'shell',
      'npx',
      ['rspack', 'serve', '--mode', 'development'],
      path.join(root, 'packages/shell'),
    ),
    billing: startProcess(
      'billing',
      'npx',
      ['vite', 'preview', '--port', '3003'],
      path.join(root, 'packages/billing'),
    ),
  }

  logHeader('All servers started')
  console.log(colorize('common', `  common:  http://localhost:3002`))
  console.log(colorize('ecs', `  ecs:     http://localhost:3001`))
  console.log(colorize('billing', `  billing: http://localhost:3003`))
  console.log(colorize('shell', `  shell:   http://localhost:3000  ← open this`))
  console.log('\n  Press Ctrl+C to stop all servers.\n')

  const cleanup = () => {
    console.log('\nShutting down...')
    Object.values(procs).forEach((p) => p.kill('SIGTERM'))
    setTimeout(() => process.exit(0), 500)
  }

  process.on('SIGINT', cleanup)
  process.on('SIGTERM', cleanup)
}

main()
