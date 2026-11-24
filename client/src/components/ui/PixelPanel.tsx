import Paper, { PaperProps } from "@mui/material/Paper";
import { pixelClip } from "../../theme/gameTheme";
import { colors, px } from "../../theme/tokens";

/** Window frame from the mockups: 5 rings (outline, gold-dark, gold, gold-dark, outline), 2px each. */
const frameShadow = [colors.outline, colors.goldDark, colors.gold, colors.goldDark, colors.outline]
  .map((c, i) => `inset 0 0 0 ${px(i + 1)} ${c}`)
  .join(", ");

/** Use for every "window": character card, shop, inventory, fight log, opponent, main menu. */
export function PixelPanel({ sx, ...props }: PaperProps) {
  return (
    <Paper
      elevation={0}
      {...props}
      sx={[
        {
          position: "relative",
          padding: px(8), // 5 rings (10px) + breathing room
          boxShadow: frameShadow,
          clipPath: pixelClip(),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  );
}
