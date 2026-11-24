/**
 * Design tokens for the pixel-RPG look (see docs/design/tokens.md).
 * This file is the single source of truth: theme overrides, `sx` props and
 * the CSS variables exposed by <GameGlobalStyles /> all read from here.
 * Never hardcode hex colors or pixel sizes elsewhere.
 */

/** One "logical pixel" of the mockups, in CSS px. Mockups are drawn at 3x; the app uses 2. */
export const PX = 2;

/** `px(1)` -> "2px", `px(18)` -> "36px". All sizes should be multiples of PX. */
export const px = (n = 1): string => `${n * PX}px`;

export const colors = {
  outline: "#140a0a",
  panel: "rgba(24, 12, 16, 0.86)",
  panelSolid: "#180c10",
  appBar: "#28161a",
  inset: "#140a0d",
  insetShadow: "#080406",
  plate: "#34201c",
  plateHighlight: "#583c30",
  logBox: "#120a0d",

  gold: "#f0d27a",
  goldMid: "#c8963c",
  goldDark: "#7a5420",
  goldHighlight: "#ffeeaa",
  parchment: "#f0dcae",
  ink: "#2a1606",
  ember: "#e8731a",
  emberText: "#ffaa46",
  emberBox: "#461e0a",

  danger: "#b8402a",
  dangerText: "#e66050",
  damageText: "#ff8c60",
  success: "#8cd068",

  hpFull: "#78c460",
  hpEmpty: "#2c1a1c",

  labelKey: "#bea06e",
  labelMuted: "#aa9682",
  rarityCommon: "#b0b8b0",
  textShadow: "#0d0606",
} as const;

export type ButtonStateColors = {
  face: string;
  hi: string;
  sh: string;
  text: string;
};

export const buttonStates = {
  stone: {
    normal: { face: "#5a3b2e", hi: "#8a6246", sh: "#2a150f", text: "#f0dcae" },
    hover: { face: "#704a37", hi: "#a87a56", sh: "#2a150f", text: "#f0d27a" },
    pressed: { face: "#3f261e", hi: "#2a150f", sh: "#6e4e3a", text: "#c8963c" },
    disabled: { face: "#3a3030", hi: "#3a3030", sh: "#282020", text: "#7a6a62" },
  },
  gold: {
    normal: { face: "#c8963c", hi: "#fae496", sh: "#7a5420", text: "#2a1606" },
    hover: { face: "#dcaa4c", hi: "#ffeeaa", sh: "#7a5420", text: "#2a1606" },
    pressed: { face: "#aa7e30", hi: "#7a5420", sh: "#e6c46e", text: "#2a1606" },
    disabled: { face: "#60523c", hi: "#60523c", sh: "#463c2c", text: "#8c7c64" },
  },
} satisfies Record<string, Record<string, ButtonStateColors>>;

export const fieldBorders = {
  default: "#7a5420",
  hover: "#c8963c",
  focus: "#e8731a",
  error: "#b8402a",
  disabled: "#463c38",
} as const;

export const fonts = {
  body: '"Pixelify Sans", "Press Start 2P", monospace',
} as const;

/** Variables exposed on :root so SCSS and plain CSS can use the same values. */
export const cssVars: Record<string, string> = {
  "--game-px": px(1),
  "--game-outline": colors.outline,
  "--game-panel": colors.panel,
  "--game-gold": colors.gold,
  "--game-gold-mid": colors.goldMid,
  "--game-gold-dark": colors.goldDark,
  "--game-parchment": colors.parchment,
  "--game-ember": colors.ember,
  "--game-danger": colors.dangerText,
  "--game-success": colors.success,
};
