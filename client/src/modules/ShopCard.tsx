import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useDispatch, useSelector } from "react-redux";
import { buyFromShop, rerollShop } from "../redux/actions/shop";
import { ShopCardItem } from "../components/ShopCardItem";
import { PixelPanel } from "../components/ui/PixelPanel";
import { colors, px } from "../theme/tokens";
import { AppState, Item, ShopSlot } from "../types";

export function ShopCard() {
  const dispatch = useDispatch();
  const shop = useSelector((state: AppState) => state.shop);
  const character = useSelector((state: AppState) => state.character);
  const { slots } = shop;

  const canBuyItem = (item: Item) =>
    character.gold >= item.price &&
    !character.items.some((ownedItem) => ownedItem.type === item.type);

  const handleBuyAction = (slot: ShopSlot, item: Item) => {
    if (canBuyItem(item)) {
      dispatch(buyFromShop(slot.id, item));
    }
  };

  const handleReroll = () => {
    if (!shop.rerollUsedThisRound && !shop.purchaseMadeThisRound) {
      dispatch(rerollShop(shop));
    }
  };

  const rerollDisabled =
    shop.rerollUsedThisRound || shop.purchaseMadeThisRound;
  const emptyShop = slots.every((slot) => slot.item === null);

  return (
    <PixelPanel
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: colors.panel,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: px(8),
          width: "100%",
          flex: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "flex-end", sm: "space-between" },
            flexWrap: "wrap",
            gap: px(4),
            width: "100%",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              flex: "1 1 auto",
              minWidth: 0,
              width: { xs: "100%", sm: "auto" },
              textAlign: "left",
            }}
          >
            Welcome to the Magic Shop
          </Typography>
          <Button
            variant="contained"
            color="primary"
            disabled={rerollDisabled}
            onClick={handleReroll}
            sx={{
              width: px(70),
              minWidth: px(70),
              minHeight: px(18),
              flexShrink: 0,
            }}
          >
            Reroll stock
          </Button>
        </Box>

        <Grid container spacing={px(8)} sx={{ width: "100%" }}>
          {slots.map((slot) => (
            <Grid size={{ xs: 12, md: 4 }} key={slot.id}>
              {slot.item ? (
                <ShopCardItem
                  item={slot.item}
                  action={(item) => handleBuyAction(slot, item)}
                  disabled={!canBuyItem(slot.item)}
                />
              ) : slot.soldItem ? (
                <ShopCardItem item={slot.soldItem} disabled sold />
              ) : (
                <Card
                  role="status"
                  sx={{
                    maxWidth: px(172),
                    minHeight: px(195),
                    height: "100%",
                    mx: "auto",
                    p: px(6),
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: px(2),
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{ color: colors.dangerText }}
                  >
                    Sold
                  </Typography>
                  <Typography variant="body2">
                    Restocks after next fight.
                  </Typography>
                </Card>
              )}
            </Grid>
          ))}

          {emptyShop && (
            <Grid size={12}>
              <Typography
                variant="h6"
                align="center"
                sx={{ color: colors.parchment }}
              >
                All items have been sold. Win the next fight to restock.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </PixelPanel>
  );
}
