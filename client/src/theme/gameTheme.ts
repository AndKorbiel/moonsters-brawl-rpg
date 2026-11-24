import { createTheme } from "@mui/material/styles";
import { buttonStates, colors, fieldBorders, fonts, px } from "./tokens";
import type { ButtonStateColors } from "./tokens";

/** Cuts the four corner pixels of an element (retro "rounded" corners). */
export const pixelClip = (n = 1): string => {
  const c = px(n);
  return `polygon(0 ${c}, ${c} ${c}, ${c} 0, calc(100% - ${c}) 0, calc(100% - ${c}) ${c}, 100% ${c}, 100% calc(100% - ${c}), calc(100% - ${c}) calc(100% - ${c}), calc(100% - ${c}) 100%, ${c} 100%, ${c} calc(100% - ${c}), 0 calc(100% - ${c}))`;
};

/** Bevel: light edge top/left, dark edge bottom/right. */
const bevel = (s: ButtonStateColors) => ({
  backgroundColor: s.face,
  color: s.text,
  boxShadow: `inset ${px()} ${px()} 0 ${s.hi}, inset -${px()} -${px()} 0 ${s.sh}`,
});

const buttonSet = (set: typeof buttonStates.stone | typeof buttonStates.gold, textShadow: string) => ({
  ...bevel(set.normal),
  textShadow,
  "&:hover": { ...bevel(set.hover) },
  "&:active": { ...bevel(set.pressed), padding: `${px(2)} ${px(6)} 0` },
  "&.Mui-focusVisible": {
    boxShadow: `inset 0 0 0 ${px()} ${colors.ember}, inset ${px(2)} ${px(2)} 0 ${set.normal.hi}, inset -${px(2)} -${px(2)} 0 ${set.normal.sh}`,
  },
  "&.Mui-disabled": { ...bevel(set.disabled), textShadow: "none", opacity: 1 },
});

export const gameTheme = createTheme({
  shape: { borderRadius: 0 },
  palette: {
    mode: "dark",
    primary: { main: buttonStates.stone.normal.face, contrastText: colors.parchment },
    secondary: { main: colors.goldMid, contrastText: colors.ink },
    error: { main: colors.danger, light: colors.dangerText },
    success: { main: colors.success },
    background: { default: colors.outline, paper: colors.panelSolid },
    text: { primary: colors.parchment, secondary: colors.labelKey },
  },
  typography: {
    fontFamily: fonts.body,
    fontSize: 16,
    h4: { fontSize: 28, color: colors.gold, textShadow: `${px()} ${px()} 0 ${colors.textShadow}` },
    h5: { fontSize: 24, color: colors.gold, textShadow: `${px()} ${px()} 0 ${colors.textShadow}` },
    h6: { fontSize: 20, color: colors.gold, textShadow: `${px()} ${px()} 0 ${colors.textShadow}` },
    body1: { fontSize: 16 },
    body2: { fontSize: 14 },
    button: { textTransform: "none", fontWeight: 600, fontSize: 16 },
  },
  components: {
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: colors.panel,
          color: colors.parchment,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: `${px()} solid ${colors.outline}`,
          boxShadow: `inset 0 0 0 ${px()} ${colors.goldDark}`,
          clipPath: pixelClip(),
          color: colors.parchment,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: px(18),
          padding: `${px(1)} ${px(6)}`,
          border: `${px()} solid ${colors.outline}`,
          clipPath: pixelClip(),
          transition: "none",
          ...buttonSet(buttonStates.stone, `${px()} ${px()} 0 ${colors.textShadow}`),
        },
      },
      variants: [
        {
          // primary action (gold): <Button variant="contained" color="secondary">
          props: { color: "secondary" },
          style: buttonSet(buttonStates.gold, `0 ${px()} 0 ${buttonStates.gold.normal.hi}`),
        },
      ],
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: colors.inset,
          color: colors.parchment,
          caretColor: colors.ember,
          "& .MuiOutlinedInput-notchedOutline": { borderWidth: px(), borderColor: fieldBorders.default },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: fieldBorders.hover },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderWidth: px(), borderColor: fieldBorders.focus },
          "&.Mui-error .MuiOutlinedInput-notchedOutline": { borderColor: fieldBorders.error },
          "&.Mui-disabled .MuiOutlinedInput-notchedOutline": { borderColor: fieldBorders.disabled },
          "&.Mui-disabled": { color: buttonStates.stone.disabled.text },
        },
        input: { boxShadow: `inset ${px()} ${px()} 0 ${colors.insetShadow}` },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: colors.gold,
          "&.Mui-focused": { color: colors.ember },
          "&.Mui-error": { color: colors.dangerText },
          "&.Mui-disabled": { color: buttonStates.stone.disabled.text },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.appBar,
          backgroundImage: "none",
          // gold bottom edge: dark gold, gold, dark gold, outline (2px each)
          boxShadow: `0 ${px()} 0 ${colors.goldDark}, 0 ${px(2)} 0 ${colors.gold}, 0 ${px(3)} 0 ${colors.goldDark}, 0 ${px(4)} 0 ${colors.outline}`,
        },
      },
    },
    MuiLink: { styleOverrides: { root: { color: colors.gold } } },
    MuiTableCell: {
      styleOverrides: {
        root: { color: colors.parchment, borderBottom: `${px()} solid ${colors.plateHighlight}` },
        head: { color: colors.gold, fontWeight: 700 },
      },
    },
  },
});
