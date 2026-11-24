import GlobalStyles from "@mui/material/GlobalStyles";
import { colors, cssVars, fonts, px } from "./tokens";

const brickWallSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${px(40)}" height="${px(20)}" viewBox="0 0 40 20">
  <rect width="40" height="20" fill="${colors.panelSolid}"/>
  <g fill="${colors.appBar}">
    <rect x="1" y="1" width="18" height="8"/>
    <rect x="21" y="1" width="18" height="8"/>
    <rect x="-19" y="11" width="18" height="8"/>
    <rect x="1" y="11" width="18" height="8"/>
    <rect x="21" y="11" width="18" height="8"/>
  </g>
  <path d="M0 0h40M0 10h40M0 20h40M20 0v10M0 10v10M40 10v10"
    fill="none" stroke="${colors.outline}" stroke-width="1"/>
</svg>`;
const brickWall = `url("data:image/svg+xml,${encodeURIComponent(brickWallSvg)}")`;

/** Render once inside <ThemeProvider>. Exposes tokens as CSS variables and sets pixel-art defaults. */
export function GameGlobalStyles() {
  return (
    <GlobalStyles
      styles={{
        ":root": cssVars,
        body: {
          fontFamily: fonts.body,
          color: colors.parchment,
          backgroundColor: colors.panelSolid,
          backgroundImage: brickWall,
          backgroundRepeat: "repeat",
        },
        img: { imageRendering: "pixelated" },
        ".MuiCardMedia-img": { objectFit: "contain" },
        "@media (prefers-reduced-motion: reduce)": {
          "*": { animation: "none !important", transition: "none !important" },
        },
      }}
    />
  );
}
