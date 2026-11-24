---
description: Restyle one screen according to docs/design (style only, no logic changes)
agent: agent
---
Restyle the screen **${input:screen:character-creation | shop | top-bar | main-menu | inventory | fight}** of this app.

1. Read `docs/design/README.md`, `docs/design/tokens.md` and `docs/design/screens/${input:screen}.md`. Look at the matching mockup in `docs/design/mockups/` (it may be attached).
2. Open the files named in the spec and the theme files `client/src/theme/*` and `client/src/components/ui/*`. Reuse `PixelPanel` and `StatPlate`; create small shared components only if a spec asks for them (e.g. `LifeBar`).
3. Before editing, write a short plan: files to change, tokens you will use, `App.scss` rules that become obsolete.
4. Implement the layout, all states and sizes from the spec using `px()` and `colors` only. Do not change logic, props, text, Redux or tests.
5. Remove the `App.scss` rules that your change made obsolete.
6. Run `npm run typecheck` and `npm test` in `client/`, fix what you broke.
7. Finish with a summary: changed files, removed SCSS rules, any deviation from the spec and why, and anything you could not verify visually.
