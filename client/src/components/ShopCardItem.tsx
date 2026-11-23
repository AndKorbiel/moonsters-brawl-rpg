import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Item, ItemRarity, ItemType } from "../types";
import { STAT_LABELS } from "../constants/statLabels";

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
    <Box sx={{ position: "relative", maxWidth: 345 }} className="centered">
      <Card
        sx={{
          maxWidth: 345,
          ...(sold && { filter: "grayscale(1)", opacity: 0.28 }),
        }}
      >
        <CardContent>
          <Typography variant="h6">{item.name}</Typography>
        </CardContent>

        <CardMedia component="img" height="140" image={item.image} />

        <CardContent>
          <Typography>Type: {ITEM_TYPE_LABELS[item.type]}</Typography>
          <Typography>Rarity: {ITEM_RARITY_LABELS[item.rarity]}</Typography>
          <Typography variant="h6" sx={{ lineHeight: "18px", mb: 2 }}>
            <Box
              component="img"
              src="assets/images/gold-coins.svg"
              alt=""
              aria-hidden="true"
              sx={{ width: 18, height: 18, verticalAlign: "bottom" }}
            />{" "}
            {item.price}
          </Typography>

          <Typography variant="h6">
            {item.stats.map((stat) => (
              <Typography key={stat.name} variant="body2">
                +{stat.value} {STAT_LABELS[stat.name]}
              </Typography>
            ))}
          </Typography>
        </CardContent>

        {sold ? (
          <CardActions sx={{ height: 52, boxSizing: "border-box" }} />
        ) : action ? (
          <CardActions sx={{ height: 52, boxSizing: "border-box" }}>
            <Button
              variant="contained"
              color="secondary"
              disabled={disabled}
              onClick={() => action(item)}
            >
              Buy this item
            </Button>
          </CardActions>
        ) : null}
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
            gap: 1,
            backgroundColor: "rgba(0, 0, 0, 0.65)",
            color: "white",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          <Typography
            variant="h4"
            sx={{ color: "error.light", fontWeight: "bold" }}
          >
            Sold
          </Typography>
          <Typography variant="body2">Restocks after next fight.</Typography>
        </Box>
      )}
    </Box>
  );
}
