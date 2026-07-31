// Shared fal.ai plumbing: queue submit + poll + robust download.
// Sync fal.run connections flake through the agent proxy; the queue
// survives it. Per fal billing docs, validation failures and 5xx are
// never charged — but a PAID output must never be lost to a transient
// download 503, hence retries with a curl fallback (curl succeeds where
// node-fetch 503s through this proxy — observed live).
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function falQueue(model, payload, key, { timeoutMin = 10 } = {}) {
  const submit = await fetch(`https://queue.fal.run/${model}`, {
    method: 'POST',
    headers: { Authorization: `Key ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!submit.ok)
    throw new Error(`fal submit ${submit.status}: ${await submit.text()}`);
  const { request_id, status_url, response_url } = await submit.json();
  process.stdout.write(`req=${request_id} `);

  const deadline = Date.now() + timeoutMin * 60 * 1000;
  for (;;) {
    if (Date.now() > deadline) throw new Error(`fal: ${timeoutMin}min poll timeout`);
    await sleep(4000);
    let st;
    try {
      const r = await fetch(status_url, { headers: { Authorization: `Key ${key}` } });
      st = await r.json();
    } catch {
      continue;
    }
    if (st.status === 'COMPLETED') break;
    if (st.status === 'FAILED' || st.status === 'CANCELLED')
      throw new Error(`fal: ${st.status}`);
    process.stdout.write('.');
  }
  const res = await fetch(response_url, { headers: { Authorization: `Key ${key}` } });
  return res.json();
}

const MAGIC = [
  [0x89, 0x50, 0x4e, 0x47], // png
  [0xff, 0xd8, 0xff], // jpeg
  [0x52, 0x49, 0x46, 0x46], // webp (RIFF)
  [0x00, 0x00, 0x00], // mp4 (ftyp box sizes vary; loose)
];
const looksBinary = (buf) =>
  buf.length > 1000 &&
  MAGIC.some((m) => m.every((b, i) => buf[i] === b));

export async function downloadWithRetry(url, attempts = 4) {
  for (let i = 0; i < attempts; i++) {
    if (i > 0) await sleep(2000 * 2 ** i);
    try {
      const v = await fetch(url);
      if (v.ok) {
        const buf = Buffer.from(await v.arrayBuffer());
        if (looksBinary(buf)) return buf;
        process.stdout.write('[bad body] ');
      } else process.stdout.write(`[dl ${v.status}] `);
    } catch {
      process.stdout.write('[dl err] ');
    }
    try {
      const tmp = path.join(os.tmpdir(), `fal-dl-${Date.now() % 1e6}-${i}`);
      execFileSync('curl', ['-sS', '-f', '-m', '180', '-o', tmp, url], { stdio: 'pipe' });
      const buf = fs.readFileSync(tmp);
      fs.rmSync(tmp, { force: true });
      if (looksBinary(buf)) return buf;
      process.stdout.write('[curl bad body] ');
    } catch {
      process.stdout.write('[curl err] ');
    }
  }
  throw new Error(`download failed after ${attempts} attempts: ${url.slice(0, 80)}`);
}
