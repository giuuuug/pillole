---
name: Performance optimization - May 2026
description: Performance changes applied to reduce latency - fonts, pagination, search, service worker
type: project
---

Implemented a comprehensive performance refactor (May 2026):

**Why:** Chrome DevTools profiling showed 12s total time, 280KB Google Fonts causing FOUT (78ms style recalc + 49ms layout), and all pills loaded server-side on every navigation.

**Changes made:**
1. **Fonts**: Replaced Google Fonts CDN with `@fontsource-variable/newsreader` (self-hosted, eliminates external round-trip + FOUT)
2. **Data loading**: Layout server no longer loads pills. Each page fetches only what it needs:
   - Home: `pillService.findDaily()` + `pillService.count()` — 2 lightweight queries
   - Library: `pillService.listPaginated()` — first 30 pills only (no body field)
   - Search: `categoryService.list()` — categories only; results come via API on-demand
   - Profile: `pillService.listAllSummary()` — all pills but WITHOUT body field
3. **New domain type**: `PillSummary = Omit<PillWithCategory, 'body'>` — list views never receive the body HTML
4. **Repository**: Added `count`, `findByOffset`, `listSummaryPaginated`, `listAllSummary`, `searchSummary`, `countByFilters` methods
5. **API endpoints**: `/api/pills` (paginated list) and `/api/pills/search` (server-side search with ILIKE on title+excerpt+body)
6. **Service worker**: Stale-while-revalidate for HTML navigations (detect via `Accept: text/html` header)
7. **Library UX**: "Carica altre" button fetches next pages; grouped view lazy-loads all pills on tab switch
8. **Search UX**: 300ms debounced fetch to `/api/pills/search`; categories shown immediately from server

**How to apply:** When adding new pages that show pill lists, use `listPaginated` or `listAllSummary` (never `list`/`listByUser` which loads body). Body is only needed on pill detail page (`/pills/[id]`).
