# Coy Discover (SDE Intern Assignment, Part B)

A swipe-based "Discover" tab built as a standalone mobile-first app: **Next.js 14 (App Router) + API routes + JSON-file persistence**. No external auth: a single logged-in user is assumed.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # 9 backend logic tests (node:test, no extra deps)
npm run seed       # optional: regenerate data/profiles.json
```

Open it on a phone-sized viewport. The tab bar has a blank **Home** tab and the **Discover** tab, which contains **Swipe** and **Matches** views.

## Demo script

1. Swipe right (or tap the heart / press `→`) on profiles. About one in three of the 30 seeded profiles has already liked you, so matches show up within the first few swipes (the 2nd profile, Ananya, is one).
2. "It's a match!" appears only on a mutual like. Open the **Matches** view to list them.
3. Reload the page: swipes and matches persist, and swiped profiles never come back.
4. Swipe through everything to see the empty state, which has a "Reset demo data" button.

## Requirements checklist

| Requirement | Where |
|---|---|
| 30+ mock profiles (name, age, photo, bio, city/college, interests) | `scripts/seed.js` -> `data/profiles.json` (30 profiles, placeholder avatars from DiceBear with a gradient/initial fallback) |
| Some profiles already liked the user | `likedYou: true` on 10 profiles (server-side only) |
| One card at a time, drag on mobile, buttons on desktop | `components/Discover.js` (pointer-event drag, buttons, arrow keys) |
| Smooth animation + clear feedback | rotate/translate fly-off, LIKE / NOPE stamps that fade in with drag distance |
| Swiped profile never appears again | feed filters on persisted swipes, enforced server-side |
| Empty state | "You're all caught up" |
| Match only on mutual like, "It's a match!" screen, Matches view | `lib/logic.js`, overlay + Matches tab |
| Never reveal who liked the user unless mutual | `likedYou` is stripped from every API response (`publicProfile`) and covered by tests |
| `GET /feed`, `POST /swipe`, `GET /matches` | `app/api/*/route.js` (served under `/api/...`) |
| Persist across reloads | `data/state.json`, written atomically (temp file + rename) |

## API

- `GET /api/feed` -> `{ profiles: [...] }` unswiped profiles only.
- `POST /api/swipe` with `{ "profileId": "p02", "direction": "like" | "pass" }` -> `{ match: boolean, profile }`. Errors: `400` invalid input, `404` unknown profile, `409` already swiped.
- `GET /api/matches` -> `{ matches: [...] }` newest first.
- `POST /api/reset` -> demo helper that clears swipes and matches.

## Design decisions

- **Privacy by construction.** The only place that knows who liked the user is the server. Responses go through one `publicProfile()` function, so a leak would need to bypass it. The `/swipe` response says whether *this* swipe matched, which is the intended reveal, and nothing else.
- **Pure logic, thin routes.** `lib/logic.js` has no I/O, so it is unit tested directly. `lib/db.js` handles the JSON file. Routes only parse and respond.
- **Idempotent, tamper-resistant swipes.** A second swipe on the same profile returns `409` and changes nothing, so a pass cannot be flipped into a match by replaying requests. Input is validated.
- **Atomic persistence.** State is written to a temp file then renamed, so a crash cannot leave half-written JSON. Reads and writes are synchronous, so each request is atomic within the Node process.
- **UX details.** Next card visible behind the top one, keyboard support, swipe threshold with spring-back, failed requests restore the card with an error toast.

## Known trade-offs

- JSON-file storage suits a single local process, which fits the brief. In production this would be a database with a unique `(user_id, profile_id)` constraint for swipes and a transaction around swipe + match creation.
- File writes need a writable filesystem, so use `npm run dev` or `npm start` locally rather than a read-only serverless host.
- Placeholder photos load from DiceBear; offline, the gradient + initial fallback shows instead.
