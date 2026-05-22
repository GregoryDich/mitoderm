import fs from 'node:fs/promises';
import path from 'node:path';
import type { Product } from '@/products';

const FILE_PATH = 'src/data/products.json';

/** Read the canonical product list directly from the JSON file. We avoid
 *  the typed `products` import here because that one is cached by Node's
 *  module cache and won't reflect writes during a dev session. */
export async function readProducts(): Promise<Product[]> {
  const abs = path.join(process.cwd(), FILE_PATH);
  const raw = await fs.readFile(abs, 'utf8');
  return JSON.parse(raw) as Product[];
}

interface GhConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
}

function readGhEnv(): GhConfig | null {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';
  if (!token || !owner || !repo) return null;
  return { token, owner, repo, branch };
}

async function writeViaGithub(
  json: string,
  message: string,
  gh: GhConfig
): Promise<void> {
  const api = `https://api.github.com/repos/${gh.owner}/${gh.repo}/contents/${FILE_PATH}`;
  const headers = {
    Authorization: `Bearer ${gh.token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'content-type': 'application/json',
  };
  // Fetch current SHA — required to update an existing file via the
  // Contents API.
  const cur = await fetch(`${api}?ref=${encodeURIComponent(gh.branch)}`, {
    headers,
    cache: 'no-store',
  });
  if (!cur.ok) {
    throw new Error(
      `GitHub GET failed: ${cur.status} ${await cur.text().catch(() => '')}`
    );
  }
  const { sha } = (await cur.json()) as { sha: string };
  const put = await fetch(api, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      message,
      content: Buffer.from(json, 'utf8').toString('base64'),
      sha,
      branch: gh.branch,
    }),
  });
  if (!put.ok) {
    throw new Error(
      `GitHub PUT failed: ${put.status} ${await put.text().catch(() => '')}`
    );
  }
}

/** Persist the product list. In dev (or wherever GITHUB_TOKEN is unset),
 *  writes to the local JSON file. On Vercel / serverless with the GH env
 *  vars set, commits to the repo via the GitHub Contents API — Vercel will
 *  redeploy automatically. */
export async function writeProducts(
  products: Product[],
  message: string
): Promise<{ persisted: 'local' | 'github' }> {
  const json = JSON.stringify(products, null, 2) + '\n';
  const gh = readGhEnv();
  if (gh) {
    await writeViaGithub(json, message, gh);
    return { persisted: 'github' };
  }
  const abs = path.join(process.cwd(), FILE_PATH);
  await fs.writeFile(abs, json, 'utf8');
  return { persisted: 'local' };
}
