# Mitoderm — Full Improvements Plan (A → F, in order)

## Context
The site is a premium, single-page-per-route React + Tailwind app (react-router) for the Mitoderm brand: a home page (hero, philosophy, product-line showcase, science, line-based catalog, partner CTA), plus Specialists, Journal, and Events pages. The user asked to implement, in order, every improvement I previously proposed: multilingual, trust content, detail pages + SEO, Supabase-backed data/forms, quality/accessibility polish, and a clean logo lockup.

An i18n foundation was already started but a partial rollback left the codebase **inconsistent**: `src/app/i18n/i18n.tsx`, `src/app/i18n/dictionary.ts`, `src/app/components/LanguageSwitcher.tsx`, the image-based `src/app/components/Logo.tsx`, and CSS helper classes (`focus-ring`, `nav-link`, `btn-outline-gold`, `footer-link`) exist and `App.tsx` wraps everything in `LanguageProvider`; `Hero/Philosophy/Science` already use `useLang()`. But `src/app/data/products.ts`, `Navbar.tsx`, `ProductCatalog.tsx`, and `ProductShowcase.tsx` were reverted to English/plain-string versions. The app runs but is only half-translated and shows no language switcher. **Step A must reconcile this first.**

## A. Multilingual (EN / RU / HE + RTL)
Foundation to reuse (already present): `src/app/i18n/i18n.tsx` (`LanguageProvider`, `useLang` → `{ lang, dir, setLang, t, tr }`, localStorage persistence, sets `document.dir`/`lang`), `src/app/i18n/dictionary.ts` (trilingual UI strings), `src/app/components/LanguageSwitcher.tsx`.

1. **Convert data to `Localized`** in `src/app/data/products.ts`: wrap `subtitle/tagline/description/highlights[]/badge` on products and `name/kicker/description` on lines with `L(en, ru, he)` returning `Record<Lang,string>`. Keep brand `name` (e.g. "V Tech System") as a plain string. Add trilingual content for all 8 products + 6 lines.
2. **Re-apply i18n to reverted components**, resolving data via `tr()` and UI via `t()`:
   - `Navbar.tsx`: translate links via dict keys, mount `<LanguageSwitcher/>` (desktop + mobile), swap inline JS hover handlers for `.nav-link` / `.btn-outline-gold` classes.
   - `ProductShowcase.tsx`: `tr()` for subtitle/tagline/description/highlights/badge/line name; `t()` for kicker/title/"learn more"; link "learn more" to `/product/:id` (used by step C).
   - `ProductCatalog.tsx`: `t()`/`tr()` throughout; convert cards from modal to `<Link to="/product/:id">` (step C); use logical props (`ps-`, `border-s`, `start-`, `text-start`) for RTL.
3. **Localize the three pages** (`Specialists.tsx`, `Journal.tsx`, `Events.tsx`) and `PageHeader.tsx`: page copy via new dict keys; make data arrays (specialists, articles, events) carry `Localized` fields for user-facing text (city/country/clinic, article title/excerpt, event title/description/type/location). Add missing dict keys to `dictionary.ts`.
4. **RTL**: `LanguageProvider` already sets `document.dir`. Audit fixed `left/right`, `pl/pr`, `ml/mr`, `text-left` usages in all components and switch to logical equivalents so Hebrew mirrors correctly. Keep the `LanguageSwitcher` dropdown using `end-0`.

Representative files: `src/app/data/products.ts`, `src/app/components/{Navbar,ProductShowcase,ProductCatalog,Footer,CTA,PageHeader}.tsx`, `src/app/pages/{Specialists,Journal,Events}.tsx`, `src/app/i18n/dictionary.ts`.

## B. Trust block (results / testimonials / certifications)
New home section component `src/app/components/Trust.tsx`, inserted in `src/app/pages/Home.tsx` between `Science` and `ProductCatalog`. Contents (all trilingual via dict/Localized):
- Before/After style results row (use existing `ImageWithFallback` + Unsplash imagery via the unsplash MCP tool), with a subtle disclaimer line.
- 3–4 cosmetologist testimonials (quote, name, clinic, portrait).
- A certifications/standards strip (icon + label chips: clinical-grade, sterile, professional-only, etc.).
Reuse brand tokens and the alternating dark/gold aesthetic already established.

## C. Detail pages + SEO
1. **Routes** in `src/app/routes.tsx`: add `product/:id`, `journal/:id`, `specialists/:id` (mirror existing children pattern).
2. **Pages**: `src/app/pages/ProductDetail.tsx` (hero image, line, tagline, description, highlights, related products from same line, consultation CTA), `src/app/pages/ArticleDetail.tsx` (full article body — add trilingual `body` to article data), `src/app/pages/SpecialistDetail.tsx` (profile, specialties, contact/book). Each reads its `:id` param, looks up data, and 404-falls-back to the list page.
3. **SEO helper**: lightweight `src/app/hooks/useDocumentMeta.ts` that sets `document.title` and the `<meta name="description">` per page/route and language (create/update the meta tag imperatively). Call it from every page including Home and the detail pages. (No SSR available in this environment, so this is client-side meta — the pragmatic option here.)
4. Wire existing list cards (catalog, journal, specialists) to link into these detail routes.

## D. Supabase (data + forms)
Requires the user to connect Supabase first. Steps:
1. Invoke the `make:supabase` skill and use the `supabase_connect` MCP card to have the user connect their project.
2. Create tables/seed for `specialists`, `events`, `articles`; move the currently-hardcoded arrays to fetch from Supabase (keep the local arrays as seed + fallback so the site still renders if unconnected).
3. Wire the partner/lead form (`CTA.tsx`), event registration (`Events.tsx`), and "apply to join" (specialists) to insert into a `leads` / `registrations` table.
This step is gated on the connection card; if the user declines, keep the current mock behavior.

## E. Quality & accessibility
- Replace remaining inline `onMouseEnter/onMouseLeave` hover handlers (Navbar done via classes; also `Footer.tsx`, buttons in `Specialists.tsx`, catalog filter) with the CSS classes already added in `theme.css` (`.nav-link`, `.btn-outline-gold`, `.footer-link`) or Tailwind `hover:` utilities.
- Add `loading="lazy"` (and `decoding="async"`) to all `<img>`/`ImageWithFallback` usages, and cap Unsplash URLs at a sensible `w=` for weight.
- Ensure `.focus-ring` (already in `theme.css`) is applied to all interactive elements; verify gold-on-dark text meets contrast (bump muted gold text opacity where borderline).

## F. Clean horizontal logo lockup
`src/app/components/Logo.tsx` currently crops the square PNG with `object-fit: cover` (fragile). Improve by: rendering the full lockup with `object-contain` inside a fixed-height, ratio-correct box so no cropping is needed, and expose `height`/`className`. If a tighter navbar mark is wanted, add an optional `compact` variant that shows the diamond mark + wordmark region. Keep white logo on the dark navbar/footer.

## Critical files
- `src/app/data/products.ts` (Localized migration)
- `src/app/i18n/dictionary.ts` (all new keys)
- `src/app/components/{Navbar,ProductShowcase,ProductCatalog,Footer,CTA,PageHeader,Logo,Trust}.tsx`
- `src/app/pages/{Home,Specialists,Journal,Events,ProductDetail,ArticleDetail,SpecialistDetail}.tsx`
- `src/app/routes.tsx`, `src/app/hooks/useDocumentMeta.ts`
- `src/styles/theme.css` (already has helper classes + focus ring)

## Verification
- Run the app in the preview surface (Vite dev server already running — do not start it).
- Switch EN/RU/HE via the navbar switcher: confirm every visible string changes, Hebrew flips to RTL (`document.dir = rtl`), and layout mirrors correctly with no clipped text.
- Navigate catalog/journal/specialist cards → confirm detail routes render, related items work, and back-to-list works; confirm `document.title` updates per page.
- Confirm the Trust section renders with imagery and testimonials.
- Keyboard-tab through nav, cards, and forms → visible gold focus ring everywhere.
- For Supabase: after connect, submit the partner form and an event registration → verify rows appear; with no connection, confirm graceful fallback to seed data.
