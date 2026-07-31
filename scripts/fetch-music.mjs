// Epidemic Sound music node — licensed tracks straight into the reel.
//
// The owner's 30-day token from epidemicsound.com/account/api-keys is an
// MCP-server key (www.epidemicsound.com/a/mcp-service/mcp, Apollo GraphQL
// bridge) — NOT a partner-content-api key; those return 401 for it. We speak
// MCP JSON-RPC directly: initialize -> tools/call.
//
// Usage (EPIDEMIC_TOKEN=... always required):
//   node scripts/fetch-music.mjs search "warm minimal beat" [--vocals]
//   node scripts/fetch-music.mjs get <recordingId> [--fit <sec>] [--name <slug>] [--set <scriptId>]
//   node scripts/fetch-music.mjs voices [ru]
//
//   search — top candidates (instrumental by default) with preview URLs
//   get    — download MP3 into public/audio/ugc/<slug>.mp3 (gitignored:
//            licensed asset, belongs to the ES subscription, not the repo).
//            --fit N runs EditRecording (their AI re-arranger, max 300s) so
//            the track natively fits the reel length — no hard fade-cut.
//            --set writes script.audio = { music, volume } into
//            src/data/ugc-scripts.json for that script (render.mjs prefers
//            per-script audio over meta.audio).
//   voices — ES voice-artist TTS roster (candidate RU VO source)
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const MCP = 'https://www.epidemicsound.com/a/mcp-service/mcp';
const TOK = process.env.EPIDEMIC_TOKEN;
if (!TOK) {
  console.error('EPIDEMIC_TOKEN missing (30-day key from epidemicsound.com/account/api-keys)');
  process.exit(1);
}

const args = process.argv.slice(2);
const cmd = args[0] || 'search';
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : null;
};

let sid = null;
let seq = 0;
async function rpc(body, expectResult = true) {
  const headers = {
    Authorization: `Bearer ${TOK}`,
    'Content-Type': 'application/json',
    Accept: 'application/json, text/event-stream',
  };
  if (sid) headers['mcp-session-id'] = sid;
  const r = await fetch(MCP, { method: 'POST', headers, body: JSON.stringify(body) });
  sid = r.headers.get('mcp-session-id') || sid;
  const text = await r.text();
  if (!expectResult) return null;
  const datas = text.split('\n').filter((l) => l.startsWith('data: ')).map((l) => l.slice(6));
  return JSON.parse(datas.length ? datas[datas.length - 1] : text);
}
async function call(name, callArgs) {
  const r = await rpc({ jsonrpc: '2.0', id: ++seq, method: 'tools/call', params: { name, arguments: callArgs } });
  if (r.error) throw new Error(`${name}: ${JSON.stringify(r.error).slice(0, 300)}`);
  const c = r.result?.content?.[0];
  const out = c?.type === 'text' ? JSON.parse(c.text) : r.result;
  if (out?.errors) throw new Error(`${name}: ${JSON.stringify(out.errors).slice(0, 300)}`);
  return out;
}
await rpc({
  jsonrpc: '2.0', id: ++seq, method: 'initialize',
  params: { protocolVersion: '2025-03-26', capabilities: {}, clientInfo: { name: 'mitoderm-music', version: '1.0' } },
});
await rpc({ jsonrpc: '2.0', method: 'notifications/initialized' }, false);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function download(url, dest) {
  for (let i = 0; i < 4; i++) {
    if (i > 0) await sleep(2000 * 2 ** i);
    try {
      const r = await fetch(url);
      if (r.ok) {
        const buf = Buffer.from(await r.arrayBuffer());
        if (buf.length > 10000) { fs.writeFileSync(dest, buf); return buf.length; }
      }
    } catch { /* proxy flake — curl fallback below */ }
    try {
      const { execFileSync } = await import('node:child_process');
      execFileSync('curl', ['-sS', '-f', '-m', '180', '-o', dest, url], { stdio: 'pipe' });
      const n = fs.statSync(dest).size;
      if (n > 10000) return n;
    } catch { /* retry */ }
  }
  throw new Error('download failed');
}

if (cmd === 'search') {
  const term = args[1] && !args[1].startsWith('--') ? args[1] : 'warm minimal beat aesthetic';
  const res = await call('SearchRecordings', {
    query: { term },
    filter: { vocals: args.includes('--vocals') ? undefined : false },
    sort: { by: 'POPULARITY', order: 'DESCENDING' },
    first: 8,
  });
  const nodes = res.data?.recordings?.nodes ?? [];
  for (const n of nodes) {
    const rec = n.recording ?? n;
    const artist = (rec.credits ?? []).find((c) => c.role === 'MAIN_ARTIST')?.artist?.name ?? '?';
    console.log(`${rec.id}`);
    console.log(`   ${rec.title} — ${artist} · ${rec.bpm}bpm · ${Math.round((rec.audioFile?.durationInMilliseconds ?? 0) / 1000)}s`);
    console.log(`   preview: ${rec.audioFile?.lqmp3Url ?? '—'}`);
  }
  if (!nodes.length) console.log('no results:', JSON.stringify(res).slice(0, 300));
}

if (cmd === 'get') {
  const recId = args[1];
  if (!recId) { console.error('usage: get <recordingId> [--fit <sec>] [--name <slug>] [--set <scriptId>]'); process.exit(1); }
  const fitSec = flag('fit') ? Number(flag('fit')) : null;
  const name = flag('name') || recId.slice(0, 8);
  const outDir = path.join(root, 'public/audio/ugc');
  fs.mkdirSync(outDir, { recursive: true });
  const dest = path.join(outDir, `${name}.mp3`);

  let assetUrl;
  // reuse an already-completed edit: --edit <jobId>:<editId>
  const existingEdit = flag('edit');
  if (existingEdit) {
    const [jobId, editId] = existingEdit.split(':');
    const dl = await call('DownloadRecordingEdit', { input: { jobId, editId } });
    assetUrl = dl.data?.recordingEditDownload?.assetUrl ?? dl.data?.downloadRecordingEdit?.assetUrl;
  } else if (fitSec) {
    // EditRecording: ES re-arranges the composition to the target length —
    // musically coherent ending instead of a fade-out chop.
    const job = await call('EditRecording', {
      id: recId,
      input: { targetDurationMs: Math.round(fitSec * 1000), loopable: false, downloadAudioFormat: 'MP3' },
    });
    let jobId = job.data?.recordingEdit?.id ?? job.data?.recordingEditCreateJob?.id ?? job.data?.editRecording?.id;
    if (!jobId) throw new Error(`no edit job id: ${JSON.stringify(job).slice(0, 300)}`);
    process.stdout.write(`[edit] job ${jobId} `);
    let editId = null;
    const deadline = Date.now() + 5 * 60 * 1000;
    while (!editId) {
      if (Date.now() > deadline) throw new Error('edit job timeout');
      await sleep(5000);
      const st = await call('PollEditRecordingJob', { id: jobId });
      const j = st.data?.recordingEditJob ?? {};
      if (j.status === 'FAILED') throw new Error('edit job failed');
      if (j.edit?.id) {
        editId = j.edit.id;
        console.log(`edit ${editId} (${(j.edit.durationMs / 1000).toFixed(1)}s)`);
      } else process.stdout.write('.');
    }
    console.log(`edit ${editId}`);
    const dl = await call('DownloadRecordingEdit', { input: { jobId, editId } });
    assetUrl = dl.data?.recordingEditDownload?.assetUrl ?? dl.data?.downloadRecordingEdit?.assetUrl;
  } else {
    const dl = await call('DownloadRecording', {
      id: recId,
      options: { fileType: 'MP3', stemType: 'FULL' },
    });
    assetUrl = dl.data?.recordingDownload?.assetUrl ?? dl.data?.downloadRecording?.assetUrl;
  }
  if (!assetUrl) throw new Error('no assetUrl in download response');
  const bytes = await download(assetUrl, dest);
  console.log(`[saved] ${path.relative(root, dest)} (${(bytes / 1e6).toFixed(2)} MB)`);

  const scriptId = flag('set');
  if (scriptId) {
    const dataPath = path.join(root, 'src/data/ugc-scripts.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const script = data.scripts.find((s) => s.id === scriptId);
    if (!script) throw new Error(`no script ${scriptId}`);
    script.audio = { music: `/audio/ugc/${name}.mp3`, volume: data.meta.audio?.volume ?? 0.35 };
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2) + '\n');
    console.log(`[set] ${scriptId}.audio.music = /audio/ugc/${name}.mp3`);
  }
}

// ES voice-artist TTS — 34-language roster (incl. ru); statuses go
// GENERATING -> DONE. Usage:
//   vo "<text>" --voice <voiceId> [--lang ru] [--out public/ugc-vo/<id>/ru/s1.mp3]
if (cmd === 'vo') {
  const text = args[1];
  if (!text) { console.error('usage: vo "<text>" --voice <voiceId> [--lang ru] [--out <path>]'); process.exit(1); }
  const voiceId = flag('voice') || 'f1c9cfec-1acb-4853-a88f-e80ddd64ef76'; // Alexandra
  const lang = flag('lang') || 'ru';
  const gen = await call('GenerateVoiceover', { input: { voiceId, text, languageCode: lang } });
  const genId = gen.data?.voiceoverGenerate?.id;
  if (!genId) throw new Error(`no generation id: ${JSON.stringify(gen).slice(0, 200)}`);
  process.stdout.write(`[vo] ${genId} `);
  const deadline = Date.now() + 3 * 60 * 1000;
  for (;;) {
    if (Date.now() > deadline) throw new Error('vo timeout');
    await sleep(4000);
    const st = await call('PollVoiceoverGenerationStatus', { id: genId });
    const s = st.data?.voiceoverGenerateStatus?.status;
    if (s === 'DONE') break;
    if (s === 'FAILED') throw new Error('vo generation failed');
    process.stdout.write('.');
  }
  const dl = await call('DownloadVoiceover', { input: { id: genId } });
  const url = dl.data?.voiceoverDownload?.url ?? dl.data?.voiceoverDownload?.assetUrl;
  if (!url) throw new Error('no voiceover url');
  const dest = path.join(root, flag('out') || `public/audio/ugc/vo-${genId.slice(0, 8)}.mp3`);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const bytes = await download(url, dest);
  console.log(`\n[saved] ${path.relative(root, dest)} (${(bytes / 1e3).toFixed(0)} KB)`);
}

if (cmd === 'voices') {
  const res = await call('ListVoices', { offset: 0, limit: 50 });
  const nodes = res.data?.voices?.nodes ?? res.data?.voices?.items ?? [];
  const lang = args[1] && !args[1].startsWith('--') ? args[1].toLowerCase() : null;
  for (const v of nodes) {
    const langs = JSON.stringify(v.languages ?? v.languageCodes ?? []);
    if (lang && !langs.toLowerCase().includes(lang)) continue;
    console.log(`${v.id} | ${v.name ?? v.title} | ${langs}`);
  }
  if (!nodes.length) console.log(JSON.stringify(res).slice(0, 800));
}
