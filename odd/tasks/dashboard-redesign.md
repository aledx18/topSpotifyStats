# Dashboard redesign (shadcn)
Objective: rebuild /user as the dashboard in the reference image using only shadcn components. Branch `feat/dashboard-redesign`, new PR stacked on `chore/update-dependencies`.
Delivery: ask-on-risk, work-unit commits. Test runner: `node --test` (native TS type stripping, no new deps) for pure stats logic; build + Biome + tsc + browser screenshot for UI.

## Specs
- S1 "quiero un diseño muy parecido a la imagen que te acabo de pasar" (reference: header with greeting + time range selector 4 semanas / 6 meses / Siempre; #1 artist hero; 4 stat cards; last played; Top canciones with rank change; Tus géneros with bars + "También escuchás"; Top 10 artistas; Escuchado recientemente timeline; ¿De qué época es tu música? bar chart; Índice mainstream; ¿Cuándo escuchás? 24h chart; "Tu resumen, listo para compartir" CTA; footer).
- S2 "añadi componentes de shadcn que quiero que priorices para hacer todo la app" — build the UI from shadcn components (card, badge, button, tabs, avatar, chart + any other needed).
- S3 "todos los componentes de ui que no uses borrarlos de ahora en mas solo usamos shadcn".
- S4 "dime si necesitas instalar algun componente mas de shadcn" — told the user: progress, separator, skeleton, toggle-group.
- S5 Data the API no longer provides → "Reemplazarlos (Recomendado)": minutes → minutes of the last 50 plays; mainstream index → % explicit tracks (popularity removed Feb 2026); genre blocks hide when Spotify returns no genres.
- S6 "que esto sea en una nueva pr".
- S7 "y luego revisa todo" — full review after implementation.
- S8 (derived, required by S1) Time range selector must work: the OAuth `code` is single-use, so the token is stored in an httpOnly cookie and data is refetched per `?range=`.

## Tasks
- [x] T1 S8 auth: proxy exchanges `code` → httpOnly cookies (access + refresh), refresh on expiry, redirect to clean /user. Route: inline. Risk: item 2 (credentials). Commit 8baa587. Evidence: curl probes (no cookie → login card; bad code → 307 without code, range kept; bad refresh → cookie cleared; bad access → "expired").
- [x] T2 S1,S5 data + stats. Route: inline. Commit 434abcc. Evidence: RED (module missing) → GREEN 13/13 `npm test`.
- [x] T3 S1,S2,S4 dashboard UI from shadcn. Route: inline. Commits 343ac2d, 42f220f. Evidence: desktop 1280px and mobile 390px screenshots with fixture data; fixed hidden explicit card, mobile header overflow.
- [x] T4 S1 share card `/api/card` (next/og, reads the session cookie). Route: inline. Commit 42f220f. Evidence: 401 without/with bad cookie.
- [x] T5 S3 delete unused components and dependencies. Route: inline. Commits 72ababf, 42f220f. Evidence: Biome 0 warnings, tsc ok per commit, `npm audit --omit=dev` 0.
- [x] T6 S7 review. Route: delegated independent verifier (T1 names item 2) + native review of auth commits 8baa587 and a33d522..4a86b1d (both approved). PR #2 opened, stacked on #1.

## Log
- L1 2026-10-22 user: "añadi componentes de shadcn que quiero que priorices para hacer todo la app ... [Image #1] quiero un diseño muy parecido a la imagen que te acabo de pasar ... todos los componentes de ui que  no uses borrarlos de ahora en mas solo usamos shadcn dime si necesitas instalar algun componente mas de shadcn" + "que esto sea en una nueva pr" + "y luego revisa todo".
- L2 Spotify Feb 2026 changelog: artist/track/album `popularity` and artist `followers` removed; `/me/top/{type}` and `/me/player/recently-played` still available; `genres` not listed but developers report it missing.
- L3 user chose "Reemplazarlos (Recomendado)" for missing-data blocks.
- L4 2026-10-22 implemented T1–T5 as 5 work-unit commits (72ababf, 8baa587, 434abcc, 343ac2d, 42f220f); each passes tsc in isolation. Toggle-group was installed then dropped in favor of the user's Tabs. Charts verified with animation disabled only for the headless screenshot (headless Chromium does not advance Recharts animation).
- L5 2026-10-22 independent verifier: S1 pass with blocker B1 (share card got no token refresh after the access cookie expired, downloaded a 401 body as .png); S2–S5, S8 pass; advisories: missing OAuth state (pre-existing at baseline), no refresh on 401 with a live cookie, generic text on ?error=auth, zero maxAge loop on tiny expires_in, empty-data gaps, unused URL constants. Fixed B1 (proxy matcher covers /api/card; recheck: /api/card with only sp_refresh now attempts the refresh and clears the bad cookie), the zero maxAge guard, unused constants and the empty top-artists card.
- L6 2026-10-22 native review of 8baa587 (risk, resilience, reliability): approved and acknowledged, 11 non-blocking findings. Acted on: refresh cookie now cleared only on 400/401 (not on 5xx/429/timeouts), 10 s token timeout, failures logged with status, token response validated, session logic extracted to src/lib/spotify/session.ts with 9 node:test cases (RED → GREEN 22/22); erasableSyntaxOnly enabled. Differential curl probes unchanged. Not acted on: OAuth state (pre-existing), refresh on 401 with a live access cookie.
