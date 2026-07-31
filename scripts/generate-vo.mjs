// Voiceover node: scene vo texts -> per-scene mp3 via ElevenLabs TTS.
// Files land in public/ugc-vo/<scriptId>/<locale>/<sceneId>.mp3 and the
// Remotion engine picks them up automatically at render (scene-aligned).
//
// Usage:
//   ELEVENLABS_API_KEY=... node scripts/generate-vo.mjs <scriptId> [locale]
//   Optional: ELEVENLABS_VOICE_ID (default: Rachel, warm neutral female).
// Free tier (10k chars/mo) covers ~5 full script sets. Without a key: dry-run.
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const args = process.argv.slice(2);
const scriptId = args[0] || 'vtech-mechanism';
const locale = args[1] || 'en';
const KEY = process.env.ELEVENLABS_API_KEY;
const VOICE = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM'; // Rachel

const data = JSON.parse(
  fs.readFileSync(path.join(root, 'src/data/ugc-scripts.json'), 'utf8')
);
const script = data.scripts.find((s) => s.id === scriptId);
if (!script) {
  console.error(`no script ${scriptId}`);
  process.exit(1);
}

const outDir = path.join(root, 'public/ugc-vo', scriptId, locale);
fs.mkdirSync(outDir, { recursive: true });

let total = 0;
for (const sc of script.scenes) {
  const text = sc.vo?.[locale] ?? sc.vo?.en;
  if (!text) {
    console.log(`[skip] ${sc.id}: no vo text`);
    continue;
  }
  total += text.length;
  const out = path.join(outDir, `${sc.id}.mp3`);
  if (!KEY) {
    console.log(`[dry] ${sc.id} (${text.length} ch): "${text}"`);
    continue;
  }
  process.stdout.write(`[tts] ${sc.id} (${text.length} ch) … `);
  const r = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE}?output_format=mp3_44100_128`,
    {
      method: 'POST',
      headers: { 'xi-api-key': KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: { stability: 0.45, similarity_boost: 0.7, style: 0.25 },
      }),
    }
  );
  if (!r.ok) {
    console.log(`FAILED ${r.status}: ${(await r.text()).slice(0, 140)}`);
    continue;
  }
  fs.writeFileSync(out, Buffer.from(await r.arrayBuffer()));
  console.log(`saved ${path.relative(root, out)}`);
}
console.log(
  KEY
    ? `[done] ${total} chars used (free tier: 10k/mo)`
    : `[dry] would use ${total} chars. Set ELEVENLABS_API_KEY to generate.`
);
