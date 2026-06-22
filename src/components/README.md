# Components — organisation rule

The components tree groups by **surface**, not by atomic-design level.
The rule when adding something new:

| Folder | What lives here |
| - | - |
| `Admin/` | Anything mounted under `/admin/*` — tables, forms, dashboards. |
| `Analytics/` | Tracking + reporting. No UI surfaces; renders null. |
| `Blog/` | `/blog` index + `[slug]` view + article-level primitives. |
| `Catalog/` | The `/catalog` listing + filter logic + `CatalogIndexProvider`. |
| `Concerns/` | Homepage strip + `/concerns/[slug]` deep-dives. |
| `Consent/` | Cookie banner + the consent context. |
| `Contact/` | The public lead form lives here. |
| `Glossary/` | `/glossary` A–Z. |
| `Home/` | The homepage scaffold + its bespoke sections. |
| `InterestList/` | Wishlist drawer, toggle, provider. |
| `Layout/` | Header, Footer, scaffolding (`Modal`, `ScrollToTop`, `PromoBar`). |
| `Legal/` | Shared layout for `/privacy` and `/terms`. |
| `Lines/` | Homepage showcase + `/lines/[slug]`. |
| `Press/` | `PressStrip` on homepage. |
| `Product/` | PDP, hover-video media, key actives, before/after, sticky CTA. |
| `Pro/` | `/apply` and the partner/B2B entry flow. |
| `Protocols/` | `/protocols` aggregator. |
| `RecentlyViewed/` | Provider + strip. |
| `Regimen/` | Regimen quiz. |
| `Reveal/` (Shared/Reveal) | Generic in-view fade helper. |
| `Science/` | `/science` four-pillar page. |
| `Seo/` | `JsonLd` etc. — surfaces that emit `<script type="application/ld+json">`. |
| `Shared/` | Cross-surface primitives. Keep this folder thin — most things have a home above. |
| `Social/` | `SocialStrip` + admin viewers. |
| `Stories/` | Stories carousel + viewer. |
| `Waitlist/` | The Bio-Spicules waitlist form. |

## Principles

- **One folder = one surface.** A change to `/blog` should never touch a
  file outside `Blog/`, `Analytics/`, `Seo/` or `Layout/`.
- **Data lives in `src/data/*.json`**, types and helpers in the
  matching `src/*.ts` wrapper (`src/products.ts`, `src/posts.ts`,
  `src/concerns.ts`, `src/lib/glossary.ts`). Components import from
  those wrappers, not from `data/*` directly.
- **Server components by default.** Flip a file to `'use client'`
  only when it owns interactive state, an effect, or a browser API.
  See `Catalog/CatalogIndexProvider.tsx` for the pattern of moving
  heavy data computation to the server.
- **Never import `getCatalogItems` into a client component.**
  Use `useCatalogIndex()` instead — see the catalog-bundle leak
  fix noted in the plan and in the runbook.

## When to create a new folder

Only if:
1. The work doesn't fit into any of the surfaces above; **and**
2. You'd expect at least three files in the new folder within the
   coming weeks.

Otherwise put it in the closest existing surface — splitting too early
makes the tree harder to scan, not easier.
