import GlobalStyles from "@mui/material/GlobalStyles";
import { colors, cssVars, fonts } from "./tokens";

/** Render once inside <ThemeProvider>. Exposes tokens as CSS variables and sets pixel-art defaults. */
export function GameGlobalStyles() {
  return (
    <GlobalStyles
      styles={{
        ":root": cssVars,
        body: { fontFamily: fonts.body, color: colors.parchment },
        img: { imageRendering: "pixelated" },
        ".MuiCardMedia-img": { objectFit: "contain" },
        "@media (prefers-reduced-motion: reduce)": {
          "*": { animation: "none !important", transition: "none !important" },
        },
      }}
    />
  );
}
