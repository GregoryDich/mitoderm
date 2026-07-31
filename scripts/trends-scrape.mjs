// The «10 блогеров» node: scrape chosen creators' top reels, transcribe,
// emit a structured trends JSON that feeds script-writing (outlier-remix,
// docs/virality-rubric.md pt 12).
//
//   Apify apify/instagram-scraper  ->  rank by videoPlayCount  ->  download
//   CDN videoUrl  ->  ffmpeg audio  ->  Groq whisper-large-v3-turbo  ->
//   src/data/trends/trends-<stamp>.json
//
// Costs (July 2026): Apify ~$1.50-2.70 per 1k results (free plan's $5/mo
// credit covers a full run); Groq $0.04/audio-hour (~$0.05 per 100 reels).
// IG CDN urls are short-lived — download immediately after the run.
//
// Usage:
//   APIFY_TOKEN=... GROQ_API_KEY=... node scripts/trends-scrape.mjs \
//     --creators user1,user2,... [--per-creator 30] [--top 5]
//   Without keys: dry-run — prints the exact API plan and exits 0.
//
// Default creator list is a placeholder niche set (exosomes/PDRN/med-spa) —
// override with --creators; the owner's curated list beats any default.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const args = process.argv.slice(2);
const opt = (name, dflt) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : dflt;
};

const CREATORS = opt(
  'creators',
  // Placeholder niche accounts — REPLACE with the owner's curated 10.
  'dr.dray,dermdoctor,skincarebyhyram,drshereeneidriss,thebeautyprofessor'
)
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const PER_CREATOR = Number(opt('per-creator', '30'));
const TOP = Number(opt('top', '5'));

const APIFY = process.env.APIFY_TOKEN;
const GROQ = process.env.GROQ_API_KEY;

const FFMPEG = path.join(
  root,
  'node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg'
);

// Dedicated reel actor (apify/instagram-reel-scraper) — cleaner than the
// general scraper for this job. NOTE (2026-07-31, live test): IG anti-bot
// blocks Apify's FREE-tier proxy pool in waves ("Empty or private data");
// auth+run+parse verified working — on a block, retry later or upgrade the
// Apify plan for residential proxies.
const ACTOR = 'apify~instagram-reel-scraper';
const apifyInput = {
  username: CREATORS,
  resultsLimit: PER_CREATOR,
};

if (!APIFY) {
  console.log('[dry] APIFY_TOKEN not set. Would run:');
  console.log(
    '  POST https://api.apify.com/v2/acts/${ACTOR}/run-sync-get-dataset-items?token=***'
  );
  console.log('  input:', JSON.stringify(apifyInput, null, 2));
  console.log(
    `  then: keep type==Video, rank by videoPlayCount desc, top ${TOP}/creator,`
  );
  console.log(
    '  download CDN videoUrl -> ffmpeg -vn audio.m4a -> Groq whisper-large-v3-turbo'
  );
  console.log('  emit: src/data/trends/trends-<stamp>.json');
  process.exit(0);
}

console.log(
  `[apify] scraping ${CREATORS.length} creators × ${PER_CREATOR} posts…`
);
const runRes = await fetch(
  `https://api.apify.com/v2/acts/${ACTOR}/run-sync-get-dataset-items?token=${APIFY}&timeout=300`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(apifyInput),
  }
);
if (!runRes.ok)
  throw new Error(`apify ${runRes.status}: ${await runRes.text()}`);
const items = await runRes.json();
console.log(`[apify] ${items.length} items`);

const reels = items
  .filter((it) => it.type === 'Video' && it.videoUrl)
  .map((it) => ({
    creator: it.ownerUsername,
    url: it.url,
    views: it.videoPlayCount ?? it.videoViewCount ?? 0,
    likes: it.likesCount ?? 0,
    comments: it.commentsCount ?? 0,
    caption: it.caption ?? '',
    hashtags: it.hashtags ?? [],
    duration: it.videoDuration ?? null,
    videoUrl: it.videoUrl,
    takenAt: it.timestamp ?? null,
  }));

// Top N per creator by views (outlier-remix source material).
const byCreator = new Map();
for (const r of reels) {
  const arr = byCreator.get(r.creator) ?? [];
  arr.push(r);
  byCreator.set(r.creator, arr);
}
const top = [...byCreator.entries()].flatMap(([, arr]) =>
  arr.sort((a, b) => b.views - a.views).slice(0, TOP)
);
console.log(`[rank] ${top.length} top reels across ${byCreator.size} creators`);

const tmp = path.join(root, '.trends-tmp');
fs.mkdirSync(tmp, { recursive: true });

async function transcribe(audioPath) {
  const form = new FormData();
  form.append('model', 'whisper-large-v3-turbo');
  form.append(
    'file',
    new Blob([fs.readFileSync(audioPath)], { type: 'audio/mp4' }),
    'audio.m4a'
  );
  const r = await fetch(
    'https://api.groq.com/openai/v1/audio/transcriptions',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${GROQ}` },
      body: form,
    }
  );
  if (!r.ok) throw new Error(`groq ${r.status}: ${await r.text()}`);
  return (await r.json()).text;
}

for (const [i, reel] of top.entries()) {
  const base = path.join(tmp, `r${i}`);
  try {
    process.stdout.write(
      `[${i + 1}/${top.length}] ${reel.creator} ${reel.views} views … `
    );
    const v = await fetch(reel.videoUrl);
    if (!v.ok) throw new Error(`cdn ${v.status}`);
    fs.writeFileSync(`${base}.mp4`, Buffer.from(await v.arrayBuffer()));
    execFileSync(FFMPEG, [
      '-y', '-i', `${base}.mp4`, '-vn', '-acodec', 'copy', `${base}.m4a`,
    ], { stdio: 'pipe' });
    reel.transcript = GROQ ? await transcribe(`${base}.m4a`) : null;
    console.log(GROQ ? 'transcribed' : 'downloaded (no GROQ_API_KEY)');
  } catch (e) {
    reel.transcript = null;
    reel.error = String(e.message).slice(0, 120);
    console.log(`SKIP: ${reel.error}`);
  } finally {
    for (const ext of ['.mp4', '.m4a'])
      fs.rmSync(base + ext, { force: true });
  }
}
fs.rmSync(tmp, { recursive: true, force: true });

const stamp = new Date().toISOString().slice(0, 10);
const outDir = path.join(root, 'src/data/trends');
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, `trends-${stamp}.json`);
fs.writeFileSync(
  outPath,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      creators: CREATORS,
      note: 'Outlier-remix source material (docs/virality-rubric.md pt 12): extract the CONTAINER (hook wording, structure, beat timing) from top transcripts — never the content.',
      reels: top.map(({ videoUrl, ...rest }) => rest),
    },
    null,
    2
  )
);
console.log(`[done] ${path.relative(root, outPath)} (${top.length} reels)`);
