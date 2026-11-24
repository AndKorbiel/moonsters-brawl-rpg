# Moonster Brawl RPG – instructions for Copilot

Browser RPG: React 19, TypeScript, MUI v9 (Emotion engine), Redux, Vite, Vitest. The app lives in `client/`. Layout: `modules/` = screens connected to Redux, `components/` = presentational pieces, `theme/` = design tokens and MUI theme, `styles/App.scss` = legacy global rules.

## Current task: restyle the UI to a pixel-RPG look
Read `docs/design/README.md`, `docs/design/tokens.md` and the spec in `docs/design/screens/` for the screen you work on. Mockups are in `docs/design/mockups/`.

## Hard rules
- **Style only.** Do not change props, state, Redux, hooks, validation, DOM text, test ids or behavior. If a spec seems to require a logic change, stop and ask.
- Colors and sizes come only from `client/src/theme/tokens.ts` (`colors`, `px()`, `buttonStates`) or the MUI theme (`theme.palette`). No hex/rgb literals and no raw `px` numbers in components. If a value is missing, add it to `tokens.ts` first.
- Style with the `sx` prop and the theme. Do not add new SCSS rules and do not add `styled-components` (it is not a dependency). Existing Emotion `styled` usage may stay; do not extend it.
- Never target generated class names (`.css-xxxx-…`). Never fight the theme with `!important`; fix specificity by removing the old `App.scss` rule.
- Reuse `PixelPanel` (windows/frames) and `StatPlate` (plates). Do not copy-paste frame styles.

## MUI v9 API (your training data may be older)
- Use `slots` / `slotProps` instead of removed props such as `PaperProps`, `TransitionProps`, `TransitionComponent`, `componentsProps`.
- `Grid` is the new Grid: `<Grid size={{ xs: 12, md: 4 }}>`, never `item xs={…}`.
- Do not use system props directly on layout components (`<Box mt={2}>`); use `sx`.
- When unsure about an API, check https://mui.com/material-ui/ (v9) instead of guessing.

## Quality bar
- Implement every state in the spec: hover, pressed, focus-visible, disabled, empty/filled, sold.
- Keep keyboard focus clearly visible; keep `aria-*` and roles.
- Run `npm run typecheck` and `npm test` in `client/` before you finish. Verify visually at 360, 768, 1280, 1536 px.
- Keep changes small and reviewable: one screen per change. List removed `App.scss` rules in your summary.

## Text differences
Mockup text is drawn with a stand-in font and may differ slightly (shorter labels). Always keep the text that is already in the code.
