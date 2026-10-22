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
- T1 S8 auth: proxy exchanges `code` → httpOnly cookies (access + refresh), refresh on expiry, redirect to clean /user. Route: inline. Risk: item 2 (credentials).
- T2 S1,S5 data + stats: Spotify client with time_range, pure stats module with node:test tests. Route: inline.
- T3 S1,S2,S4 dashboard UI from shadcn. Route: inline.
- T4 S1 share card: `/api/card` OG image (next/og) with top 5 artists/tracks/genres. Route: inline.
- T5 S3 delete unused components and dependencies. Route: inline.
- T6 S7 review: build, lint, tests, screenshot, independent verifier for T1, native review per commit. Route: delegated verifier.

## Log
- L1 2026-10-22 user: "añadi componentes de shadcn que quiero que priorices para hacer todo la app ... [Image #1] quiero un diseño muy parecido a la imagen que te acabo de pasar ... todos los componentes de ui que  no uses borrarlos de ahora en mas solo usamos shadcn dime si necesitas instalar algun componente mas de shadcn" + "que esto sea en una nueva pr" + "y luego revisa todo".
- L2 Spotify Feb 2026 changelog: artist/track/album `popularity` and artist `followers` removed; `/me/top/{type}` and `/me/player/recently-played` still available; `genres` not listed but developers report it missing.
- L3 user chose "Reemplazarlos (Recomendado)" for missing-data blocks.
