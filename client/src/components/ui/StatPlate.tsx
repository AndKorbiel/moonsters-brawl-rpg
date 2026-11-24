import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { colors, px } from "../../theme/tokens";

type StatPlateProps = {
  /** file name in assets/images/pixel without extension, e.g. "icon-sword"; omit for none */
  icon?: "icon-sword" | "icon-shield" | "icon-heart";
  /** existing coin asset instead of a pixel icon */
  coin?: boolean;
  label?: string;
  value: string | number;
  width?: number | string;
};

/** Dark plate with optional icon: "Level: 1", "Attack: 10", coin + price. */
export function StatPlate({ icon, coin, label, value, width = "100%" }: StatPlateProps) {
  const src = coin ? "assets/images/gold-coins.svg" : icon ? `assets/images/pixel/${icon}.svg` : undefined;
  return (
    <Box
      sx={{
        width,
        minHeight: px(14),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: px(2),
        backgroundColor: colors.plate,
        border: `${px()} solid ${colors.outline}`,
        boxShadow: `inset 0 ${px()} 0 ${colors.plateHighlight}`,
      }}
    >
      {src && <Box component="img" src={src} alt="" aria-hidden="true" sx={{ height: px(9) }} />}
      <Typography component="span" variant="body1">
        {label && <>{label} </>}
        <Box component="span" sx={{ color: colors.gold }}>
          {value}
        </Box>
      </Typography>
    </Box>
  );
}
