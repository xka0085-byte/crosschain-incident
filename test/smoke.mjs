import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';
import path from 'node:path';

const cli = path.resolve('bin/crosschain-incident.mjs');
const dir = await mkdtemp(path.join(tmpdir(), 'crosschain-incident-'));
function run(file) { return new Promise(resolve => { const p = spawn(process.execPath, [cli, 'inspect', '--input', file, '--json']); let out = ''; p.stdout.on('data', x => out += x); p.on('close', code => resolve({ code, report: JSON.parse(out) })); }); }
try {
  const delivered = path.join(dir, 'delivered.json'); await writeFile(delivered, JSON.stringify({ protocol: 'demo', source: { status: 'delivered' }, destination: { status: 'executed' } }));
  const good = await run(delivered); assert.equal(good.code, 0); assert.equal(good.report.status, 'PASS');
  const failed = path.join(dir, 'failed.json'); await writeFile(failed, JSON.stringify({ source: { status: 'delivered' }, destination: { status: 'failed' } }));
  const bad = await run(failed); assert.equal(bad.code, 1); assert.ok(bad.report.findings.some(x => x.code === 'DESTINATION_FAILED'));
  const bom = path.join(dir, 'bom.json'); await writeFile(bom, `﻿${JSON.stringify({ source: { status: 'delivered' }, destination: { status: 'confirmed' } })}`, 'utf8');
  const bomResult = await run(bom); assert.equal(bomResult.code, 0); assert.equal(bomResult.report.status, 'PASS');
  const invalid = path.join(dir, 'invalid.json'); await writeFile(invalid, '{');
  const invalidResult = await run(invalid); assert.equal(invalidResult.code, 2); assert.equal(invalidResult.report.status, 'UNKNOWN');
  console.log('crosschain-incident smoke tests passed');
} finally { await rm(dir, { recursive: true, force: true }); }
