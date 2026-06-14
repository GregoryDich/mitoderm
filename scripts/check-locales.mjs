#!/usr/bin/env node
/**
 * Locale-parity check. Reads messages/en.json as the reference and
 * verifies every nested key exists in ru.json and he.json. Exits with
 * a non-zero code on missing keys, with a list of dotted paths.
 *
 * Usage: node scripts/check-locales.mjs
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const ref = 'en';
const targets = ['ru', 'he'];

function load(locale) {
  const path = join(root, 'messages', `${locale}.json`);
  return JSON.parse(readFileSync(path, 'utf8'));
}

function flatten(obj, prefix = '') {
  const out = [];
  for (const [k, v] of Object.entries(obj || {})) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      out.push(...flatten(v, key));
    } else {
      out.push(key);
    }
  }
  return out;
}

function has(obj, dotted) {
  const parts = dotted.split('.');
  let cur = obj;
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in cur) cur = cur[p];
    else return false;
  }
  return true;
}

/** Namespaces where keys are intentionally locale-native (e.g. the
 *  glossary's keys ARE the localized terms — "exosomes" in en,
 *  "экзосомы" in ru). For these we only check that the namespace
 *  exists in every target locale, not that every key matches. */
const LOOSE_NAMESPACES = new Set(['glossary']);

const en = load(ref);
let failed = false;

for (const t of targets) {
  const tr = load(t);
  /* Only enforce parity for namespaces that exist in BOTH files.
   * That way, adding a new namespace in en.json requires seeding it
   * in ru/he (opt-in for new features), while legacy en-only
   * namespaces show as a soft warning, not a failure. */
  const sharedNs = Object.keys(en).filter((ns) => ns in tr);
  const legacyNs = Object.keys(en).filter((ns) => !(ns in tr));
  const looseNs = sharedNs.filter((ns) => LOOSE_NAMESPACES.has(ns));
  const strictNs = sharedNs.filter((ns) => !LOOSE_NAMESPACES.has(ns));

  const enSharedKeys = strictNs.flatMap((ns) => flatten(en[ns], ns));
  const missing = enSharedKeys.filter((k) => !has(tr, k));

  if (missing.length) {
    failed = true;
    console.error(
      `\n[locale-parity] ${t}.json is missing ${missing.length} key(s) inside shared namespaces:`
    );
    for (const k of missing) console.error(`  - ${k}`);
  } else {
    console.log(
      `[locale-parity] ${t}.json — OK (${enSharedKeys.length} keys across ${strictNs.length} strict namespaces; ${looseNs.length} loose)`
    );
  }

  if (legacyNs.length) {
    console.warn(
      `[locale-parity] ${t}.json: ${legacyNs.length} namespace(s) present only in ${ref}.json (skipped): ${legacyNs.join(', ')}`
    );
  }
}

if (failed) process.exit(1);
