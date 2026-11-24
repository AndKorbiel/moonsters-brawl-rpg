---
applyTo: "client/src/**/*.{ts,tsx,scss}"
---
# UI implementation rules (pixel-RPG theme)

## Tokens and sizing
- `import { colors, px, buttonStates } from "../theme/tokens"` (adjust the relative path). `px(1)` = 2px = one logical pixel of the mockups. Every border, gap, padding and control height must be a multiple via `px(n)`; font sizes only 14, 16, 20, 24, 28.
- Specs give sizes in logical units: `px(18)` for "18".

## Pixel look checklist
- Hard edges: `borderRadius: 0`, no blur shadows, no gradients (use flat fills; vertical gradients only where a spec says so), no opacity animations.
- Bevel = two inset shadows (light top/left, dark bottom/right) – see `gameTheme.ts` `bevel`. Frames = stacked inset shadows – see `PixelPanel`.
- Corner cut = `clipPath: pixelClip()`. A clipped element cuts everything outside its box (outlines, outer shadows, pseudo-elements). Draw focus rings with inset shadows and put outside decorations (arrows, studs) on a wrapper.
- Images: keep `imageRendering: "pixelated"` and `objectFit: "contain"`; do not scale to non-integer sizes if avoidable.
- No `text-transform: uppercase`, no letter-spacing, no italic.

## Styling mechanics
- Prefer theme `styleOverrides` / `variants` for anything shared (buttons, inputs, cards, table cells). Use `sx` only for layout and one-off details.
- `sx` arrays pattern when a component accepts `sx`: `sx={[base, ...(Array.isArray(sx) ? sx : [sx])]}`.
- Pseudo-states in `sx`: `"&:hover"`, `"&.Mui-focusVisible"`, `"&.Mui-disabled"`, `"&:active"`.
- Do not use `className` + SCSS for new styling. Existing utility classes (`centered`, `text-centered`, `padlr`) may stay.
- Respect existing responsive `Grid` sizes in `App.tsx`; windows are fluid, only control heights are fixed.

## States to implement for interactive elements
normal, hover, pressed (`:active`), focus-visible, disabled. For slots/cards additionally: empty, filled, sold (see the screen spec). Do not rely on color alone for state (also change shape/ring/text).

## Tests
Do not change queries or text that tests rely on. If a test breaks because of markup you added, wrap rather than replace existing elements.
