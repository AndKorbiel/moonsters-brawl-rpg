import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import { colors, px } from "../../theme/tokens";

type StatPlateBaseProps = {
  /** file name in assets/images/pixel without extension, e.g. "icon-sword"; omit for none */
  icon?: "icon-sword" | "icon-shield" | "icon-heart";
  /** existing coin asset instead of a pixel icon */
  coin?: boolean;
  width?: number | string;
};

type StatPlateProps = StatPlateBaseProps &
  (
    | { children: ReactNode; label?: never; value?: never }
    | {
        children?: never;
        label?: string;
        value: string | number;
      }
  );

/** Dark plate with optional icon: "Level: 1", "Attack: 10", coin + price. */
export function StatPlate(props: StatPlateProps) {
  const { icon, coin, width = "100%" } = props;
  const src = coin ? "assets/images/gold-coins.svg" : icon ? `assets/images/pixel/${icon}.svg` : undefined;
  const content =
    props.children ??
    (props.value !== undefined ? (
      <Typography component="span" variant="body1">
        {props.label && <>{props.label} </>}
        <Box component="span" sx={{ color: colors.gold }}>
          {props.value}
        </Box>
      </Typography>
    ) : null);

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
      {src && (
        <Box
          component="img"
          src={src}
          alt=""
          aria-hidden="true"
          sx={{ height: px(9), verticalAlign: "bottom" }}
        />
      )}
      {content}
    </Box>
  );
}
