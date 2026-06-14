# n8n → Mitoderm Social ingest

This document describes how to wire an n8n workflow that pulls new Instagram
posts and creates **draft** entries in `/admin/social` for editorial review.

> **Design principle.** Ingestion is automatic; publishing is manual. n8n
> never sets `isPublished=true` — every post lands as a draft, the owner
> reviews it in admin and clicks **Publish**. This is the hybrid model:
> automation does the boring work, the brand keeps editorial control.

## 1. Configure environment

Set the following in your hosting environment (Vercel → Settings → Environment Variables, or your `.env`):

```bash
# Required — bearer token n8n will send
SOCIAL_INGEST_TOKEN=<long random string, ≥ 32 chars>

# Optional but recommended — extra HMAC body signature
SOCIAL_INGEST_SECRET=<another long random string>

# Required for production posters to persist (already used by /admin)
GITHUB_TOKEN=ghp_…
GITHUB_OWNER=gregorydich
GITHUB_REPO=mitoderm
GITHUB_BRANCH=main
```

Generate good secrets:

```bash
openssl rand -hex 32
```

## 2. Test the endpoint

```bash
# Health probe — should return { ok: true, ready: true }
curl -H "Authorization: Bearer $SOCIAL_INGEST_TOKEN" \
     https://exoskin.co.il/api/integrations/social/ingest

# Create a draft (manual smoke test)
curl -X POST \
  -H "Authorization: Bearer $SOCIAL_INGEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
        "url": "https://www.instagram.com/reel/CxxxxxxxxxX/",
        "mediaType": "VIDEO",
        "thumbnailUrl": "https://scontent-fra.cdninstagram.com/v/…/poster.jpg",
        "caption": "Семинар по экзосомам — 15.03.2026",
        "postedAt": "2026-02-10T14:22:00Z"
      }' \
  https://exoskin.co.il/api/integrations/social/ingest
```

Expected response:

```json
{
  "ok": true,
  "action": "created",
  "id": "...",
  "kind": "seminar",
  "date": "2026-03-15",
  "posterUrl": "/social/.../poster.jpg",
  "reviewUrl": "/admin/social/.../edit"
}
```

Repeated calls with the same `url` return `{ action: "skipped_duplicate" }`,
so n8n can re-run safely.

## 3. n8n workflow

### 3.1 Trigger

Use **Schedule Trigger** every 15 minutes (or whatever cadence fits the
posting frequency).

### 3.2 Fetch Instagram media

You need an **Instagram Graph API** access token for a Business account
linked to a Facebook Page. Free tier is fine — < 200 calls/hour is plenty.

Add an **HTTP Request** node:

- Method: `GET`
- URL: `https://graph.facebook.com/v19.0/{IG_USER_ID}/media`
- Query parameters:
  - `fields`: `id,caption,media_type,media_url,thumbnail_url,permalink,timestamp`
  - `limit`: `5`
  - `access_token`: `={{ $credentials.instagramToken }}`

This returns the latest 5 posts.

### 3.3 Filter — skip already-ingested posts

Add a **Filter** node:

- Keep item if: `{{$json.media_type}}` ≠ `STORY` (stories aren't posts)

The ingest endpoint dedups by URL, so n8n doesn't need to track state — but
filtering at the n8n side is still cheaper.

### 3.4 Optional pre-filter: keyword whitelist

If you only want certain posts to surface as drafts (e.g. only Reels with
"#mitodermclinic" in the caption), add another **Filter** node:

- Keep item if: `{{$json.caption}}` contains `mitodermclinic`

This is fully optional — the ingest endpoint will already heuristically
classify by caption.

### 3.5 Map payload

Add a **Set** (or **Code**) node to shape the body the ingest endpoint
expects:

```javascript
return [{
  json: {
    url: $json.permalink,
    mediaType: $json.media_type,                 // VIDEO | IMAGE | CAROUSEL_ALBUM
    thumbnailUrl: $json.thumbnail_url || $json.media_url,
    caption: $json.caption,
    postedAt: $json.timestamp,
  }
}];
```

### 3.6 POST to ingest endpoint

Add an **HTTP Request** node:

- Method: `POST`
- URL: `https://exoskin.co.il/api/integrations/social/ingest`
- Authentication: **Header Auth** with
  - Name: `Authorization`
  - Value: `Bearer {{ $credentials.mitodermIngestToken }}`
- Body: JSON, `={{ $json }}`

(Optional — if you set `SOCIAL_INGEST_SECRET`, add a **Function** node
before this one that computes the HMAC and adds the `X-Mitoderm-Signature`
header.)

### 3.7 Notify (optional but useful)

If `$json.action === "created"`, send yourself a Telegram / email / Slack
ping with the `reviewUrl` so you can publish without opening the admin
yourself.

## 4. What happens on the site

| n8n action | What appears | Where |
| - | - | - |
| New `created` draft | Yellow "X drafts" badge on the **Social** nav | `/admin/social` |
| Owner clicks **Publish** | Card appears on homepage strip | `/` |
| Kind is `seminar`, date in future | Card appears in **Upcoming** section | `/seminars` |
| Kind is `seminar`, date in past | Card moves to **Past** section | `/seminars` |

## 5. Failure modes

| Symptom | Cause | Fix |
| - | - | - |
| 401 `unauthorized` | Token mismatch | Re-check the env var; n8n sends with `Authorization: Bearer …` |
| 400 `invalid_url` | URL isn't an instagram.com URL | Make sure n8n maps `permalink`, not `media_url` |
| 200 `skipped_duplicate` | Same URL came in twice | Expected — re-runs are safe |
| Poster missing on the card | `thumbnailUrl` not reachable | Upload manually in admin, or check IG CDN expiry on the URL |

Why download the poster ourselves rather than referencing the IG CDN URL?
Instagram CDN URLs have a short TTL (a few hours to days) and break
afterwards. The ingest endpoint downloads the image once and stores it
under `/public/social/<id>/poster.<ext>` so it lasts forever (and gets
served from our CDN).

## 6. Privacy / ToS notes

- The Instagram Graph API is the official, ToS-compliant path. Don't use
  unofficial scrapers — they break and risk account bans.
- We never display Instagram-CDN-hosted videos directly; clicks go to
  the original `permalink` on instagram.com, which is what IG's ToS expects.
- Posters are owner-uploaded copies of frames you control on your own
  business account, so there's no copyright issue.
