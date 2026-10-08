// Compiles and runs Java source files with the JDK on this computer. Used by java-runner.mjs and by the tests.
// files: { 'Main.java': '...', ... }   main: the class with public static void main
// Returns { ok, stage: 'compile' | 'run', stdout, stderr, timedOut, exitCode }.
import { spawn, spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const MAX_OUTPUT = 100_000

export const javaAvailable = () => spawnSync('javac', ['-version']).status === 0

function exec(cmd, args, { cwd, timeoutMs }) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { cwd })
    let stdout = ''
    let stderr = ''
    let timedOut = false
    const timer = setTimeout(() => {
      timedOut = true
      child.kill('SIGKILL')
    }, timeoutMs)
    child.stdout.on('data', (d) => { if (stdout.length < MAX_OUTPUT) stdout += d })
    child.stderr.on('data', (d) => { if (stderr.length < MAX_OUTPUT) stderr += d })
    child.on('error', (e) => { clearTimeout(timer); resolve({ stdout, stderr: String(e), timedOut, exitCode: -1 }) })
    child.on('close', (exitCode) => { clearTimeout(timer); resolve({ stdout, stderr, timedOut, exitCode }) })
  })
}

export async function runJava({ files, main = 'Main', timeoutMs = 5000 }) {
  const dir = mkdtempSync(join(tmpdir(), 'cram-java-'))
  try {
    for (const [name, code] of Object.entries(files)) {
      if (!/^[A-Za-z_][A-Za-z0-9_]*\.java$/.test(name)) return { ok: false, stage: 'compile', stdout: '', stderr: `Bad file name: ${name}`, timedOut: false, exitCode: 1 }
      writeFileSync(join(dir, name), code)
    }
    const compiled = await exec('javac', ['-encoding', 'UTF-8', '-d', dir, ...Object.keys(files)], { cwd: dir, timeoutMs: 20000 })
    if (compiled.exitCode !== 0) return { ok: false, stage: 'compile', ...compiled }
    const ran = await exec('java', ['-Xmx128m', '-cp', dir, main], { cwd: dir, timeoutMs })
    return { ok: ran.exitCode === 0 && !ran.timedOut, stage: 'run', ...ran }
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}
