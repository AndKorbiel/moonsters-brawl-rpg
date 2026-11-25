import GlobalStyles from "@mui/material/GlobalStyles";
import digitsFontUrl from "@fontsource/jersey-10/files/jersey-10-latin-400-normal.woff2?url";
import { colors, cssVars, fonts, px } from "./tokens";

const arrow = (direction: "up" | "down", color: string): string => {
  // 5x3 pixel triangle as an inline SVG (colors come from tokens)
  const path =
    direction === "up"
      ? "M2 0h1v1H2zM1 1h3v1H1zM0 2h5v1H0z"
      : "M0 0h5v1H0zM1 1h3v1H1zM2 2h1v1H2z";
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='5' height='3' shape-rendering='crispEdges'><path d='${path}' fill='${color}'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};

/**
 * Pixel scrollbar for every scrollable area (log, tables, the page itself).
 * Chrome/Edge/Safari: full bevelled look via ::-webkit-scrollbar.
 * Firefox: color-only fallback. NOTE: in Chrome, setting `scrollbar-color` or
 * `scrollbar-width` disables the ::-webkit-scrollbar styling, so the standard
 * properties are only applied where the webkit pseudo-elements are unsupported.
 */
const pixelScrollbar = {
  "*::-webkit-scrollbar": { width: px(6), height: px(6) },
  "*::-webkit-scrollbar-track": {
    backgroundColor: colors.inset,
    boxShadow: `inset ${px()} 0 0 ${colors.insetShadow}, inset -${px()} 0 0 ${colors.outline}`,
  },
  "*::-webkit-scrollbar-thumb": {
    backgroundColor: colors.goldMid,
    border: `${px()} solid ${colors.outline}`,
    boxShadow: `inset ${px()} ${px()} 0 ${colors.goldHighlight}, inset -${px()} -${px()} 0 ${colors.goldDark}`,
  },
  "*::-webkit-scrollbar-thumb:hover": { backgroundColor: colors.gold },
  "*::-webkit-scrollbar-thumb:active": {
    backgroundColor: colors.goldDark,
    boxShadow: `inset ${px()} ${px()} 0 ${colors.outline}`,
  },
  "*::-webkit-scrollbar-corner": { backgroundColor: colors.inset },
  // arrow buttons at both ends
  "*::-webkit-scrollbar-button:single-button": {
    display: "block",
    width: px(6),
    height: px(6),
    backgroundColor: colors.inset,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: `${px(5)} ${px(3)}`,
  },
  "*::-webkit-scrollbar-button:single-button:vertical:decrement": {
    backgroundImage: arrow("up", colors.goldMid),
  },
  "*::-webkit-scrollbar-button:single-button:vertical:increment": {
    backgroundImage: arrow("down", colors.goldMid),
  },
  "*::-webkit-scrollbar-button:single-button:hover": {
    backgroundColor: colors.plate,
  },
  "@supports not selector(::-webkit-scrollbar)": {
    "*": {
      scrollbarWidth: "auto",
      scrollbarColor: `${colors.goldMid} ${colors.inset}`,
    },
  },
};

/** Render once inside <ThemeProvider>. Exposes tokens as CSS variables and sets pixel-art defaults. */
export function GameGlobalStyles() {
  return (
    <GlobalStyles
      styles={{
        // Digits 0-9 only come from Jersey 10 (clear 2/5/8); all letters stay in Pixelify Sans.
        // "GameDigits" must be the first family in fonts.body (tokens.ts).
        // size-adjust 110% was tuned visually (docs: digit-align-test.html) so digits match the letter height.
        "@font-face": {
          fontFamily: "GameDigits",
          fontStyle: "normal",
          fontWeight: 400,
          fontDisplay: "swap",
          src: `url(${digitsFontUrl}) format("woff2")`,
          unicodeRange: "U+0030-0039",
          sizeAdjust: "110%",
        },
        ":root": cssVars,
        body: {
          fontFamily: fonts.body,
          color: colors.parchment,
          // Pixelify Sans has a "fi" ligature that renders as a different glyph ("first" -> "Arst")
          fontVariantLigatures: "none",
          fontFeatureSettings: '"liga" 0, "clig" 0, "calt" 0',
        },
        img: { imageRendering: "pixelated" },
        ".MuiCardMedia-img": { objectFit: "contain" },
        ...pixelScrollbar,
        "@media (prefers-reduced-motion: reduce)": {
          "*": { animation: "none !important", transition: "none !important" },
        },
      }}
    />
  );
}
