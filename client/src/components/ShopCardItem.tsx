import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Item, ItemRarity, ItemType } from "../types";
import { STAT_LABELS } from "../constants/statLabels";
import { PixelPanel } from "./ui/PixelPanel";
import { StatPlate } from "./ui/StatPlate";
import { colors, itemRarityColors, px } from "../theme/tokens";

const ITEM_TYPE_LABELS: Record<ItemType, string> = {
  [ItemType.ARMOR]: "Armor",
  [ItemType.MAGIC]: "Magic",
  [ItemType.OFF_HAND]: "Off-hand",
  [ItemType.WEAPON]: "Weapon",
};

const ITEM_RARITY_LABELS: Record<ItemRarity, string> = {
  [ItemRarity.COMMON]: "Common",
  [ItemRarity.MAGIC]: "Magic",
  [ItemRarity.RARE]: "Rare",
};

const visuallyHiddenSx = {
  position: "absolute",
  width: px(1),
  height: px(1),
  m: px(-1),
  p: 0,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
} as const;

type ShopCardItemProps = {
  item: Item;
  action?: (item: Item) => void;
  disabled: boolean;
  sold?: boolean;
};

export function ShopCardItem({
  item,
  action,
  disabled,
  sold = false,
}: ShopCardItemProps) {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: px(172),
        height: "100%",
        mx: "auto",
      }}
      className="centered"
    >
      <Card
        sx={{
          width: "100%",
          height: "100%",
          minHeight: px(195),
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: px(2),
          p: px(6),
          ...(sold && { filter: "grayscale(1)", opacity: 0.45 }),
          ...(!sold && {
            "&:hover, &:focus-within": {
              boxShadow: `inset 0 0 0 ${px()} ${colors.ember}`,
            },
          }),
        }}
      >
        <Typography
          variant="body1"
          align="center"
          sx={{
            width: "100%",
            minHeight: px(12),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: colors.gold,
            lineHeight: px(12),
            overflowWrap: "anywhere",
          }}
        >
          {item.name}
        </Typography>

        <Box
          aria-hidden="true"
          sx={{
            width: "100%",
            height: px(),
            backgroundColor: colors.goldDark,
            boxShadow: `0 ${px()} 0 ${colors.outline}`,
          }}
        />

        <PixelPanel
          sx={{
            width: px(50),
            height: px(50),
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 0,
            backgroundColor: colors.inset,
          }}
        >
          <CardMedia
            component="img"
            image={item.image}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              imageRendering: "pixelated",
            }}
          />
        </PixelPanel>

        <Typography
          component="p"
          variant="body1"
          align="center"
          sx={{ width: "100%", lineHeight: px(9) }}
        >
          <Box component="span" aria-hidden="true" sx={{ color: colors.labelKey }}>
            Type:{" "}
          </Box>
          <Box component="span" aria-hidden="true" sx={{ color: colors.parchment }}>
            {ITEM_TYPE_LABELS[item.type]}
          </Box>
          <Box component="span" sx={visuallyHiddenSx}>
            Type: {ITEM_TYPE_LABELS[item.type]}
          </Box>
        </Typography>

        <Typography
          component="p"
          variant="body1"
          align="center"
          sx={{ width: "100%", lineHeight: px(9) }}
        >
          <Box component="span" aria-hidden="true" sx={{ color: colors.labelKey }}>
            Rarity:{" "}
          </Box>
          <Box
            component="span"
            aria-hidden="true"
            sx={{ color: itemRarityColors[item.rarity] }}
          >
            {ITEM_RARITY_LABELS[item.rarity]}
          </Box>
          <Box component="span" sx={visuallyHiddenSx}>
            Rarity: {ITEM_RARITY_LABELS[item.rarity]}
          </Box>
        </Typography>

        <Box sx={{ lineHeight: px(9) }}>
          <StatPlate coin value={item.price} width={px(44)} />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            gap: px(1),
            textAlign: "center",
          }}
        >
          {item.stats.map((stat) => (
            <Typography
              key={stat.name}
              variant="h6"
              sx={{ color: colors.success, lineHeight: px(12) }}
            >
              +{stat.value} {STAT_LABELS[stat.name]}
            </Typography>
          ))}
        </Box>

        {action && !sold && (
          <Button
            variant="contained"
            color="secondary"
            disabled={disabled}
            onClick={() => action(item)}
            fullWidth
            sx={{ mt: "auto", minHeight: px(18), flexShrink: 0 }}
          >
            Buy this item
          </Button>
        )}
      </Card>

      {sold && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: px(2),
            backgroundColor: colors.panel,
            color: colors.parchment,
            textAlign: "center",
            pointerEvents: "none",
            p: px(6),
          }}
        >
          <Typography variant="h5" sx={{ color: colors.dangerText }}>
            Sold
          </Typography>
          <Typography variant="body2">
            Restocks after next fight.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
