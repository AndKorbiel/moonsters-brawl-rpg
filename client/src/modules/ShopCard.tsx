import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useDispatch, useSelector } from "react-redux";
import { buyFromShop, rerollShop } from "../redux/actions/shop";
import { ShopCardItem } from "../components/ShopCardItem";
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
    <Paper sx={{ height: "100%" }}>
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid size={12}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 2,
              mt: 2,
            }}
          >
            <Typography variant="h4" align="center">
              Welcome to the Magic Shop
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              disabled={rerollDisabled}
              onClick={handleReroll}
            >
              Reroll stock
            </Button>
          </Box>
        </Grid>

        <Grid size={12}>
          <Grid container spacing={2}>
            {slots.map((slot) => (
              <Grid size={{ xs: 12, md: 4 }} key={slot.id}>
                {slot.item ? (
                  <ShopCardItem
                    item={slot.item}
                    action={(item) => handleBuyAction(slot, item)}
                    disabled={!canBuyItem(slot.item)}
                  />
                ) : slot.soldItem ? (
                  <ShopCardItem
                    item={slot.soldItem}
                    disabled
                    sold
                  />
                ) : (
                  <Box
                    role="status"
                    sx={{
                      maxWidth: 345,
                      minHeight: 390,
                      height: "100%",
                      mx: "auto",
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                      textAlign: "center",
                      border: "1px dashed rgba(255, 255, 255, 0.35)",
                      borderRadius: 1,
                      backgroundColor: "rgba(0, 0, 0, 0.18)",
                      color: "rgba(255, 255, 255, 0.65)",
                    }}
                  >
                    <Typography variant="h6">Sold</Typography>
                    <Typography variant="body2">
                      Restocks after next fight.
                    </Typography>
                  </Box>
                )}
              </Grid>
            ))}
          </Grid>

          {emptyShop && (
            <Typography variant="h6" align="center">
              All items have been sold. Win the next fight to restock.
            </Typography>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}
