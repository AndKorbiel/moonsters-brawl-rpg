import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { useDispatch, useSelector } from "react-redux";
import { buyFromShop } from "../redux/actions/shop";
import { ShopCardItem } from "../components/ShopCardItem";
import { AppState, Item, ShopSlot } from "../types";

export function ShopCard() {
  const dispatch = useDispatch();
  const { slots, character } = useSelector((state: AppState) => ({
    slots: state.shop.slots,
    character: state.character,
  }));

  const canBuyItem = (item: Item) =>
    character.gold >= item.price &&
    !character.items.some((ownedItem) => ownedItem.type === item.type);

  const handleBuyAction = (slot: ShopSlot, item: Item) => {
    if (canBuyItem(item)) {
      dispatch(buyFromShop(slot.id, item));
    }
  };

  const emptyShop = slots.every((slot) => slot.item === null);

  return (
    <Paper sx={{ height: "100%" }}>
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid size={12}>
          <Typography
            variant="h4"
            align="center"
            gutterBottom={true}
            sx={{ mt: 2 }}
          >
            Welcome to the Magic Shop
          </Typography>
        </Grid>

        <Grid size={12}>
          <Grid container spacing={2}>
            {slots.map((slot) => (
              <Grid size={{ xs: 12, md: 4 }} key={slot.id}>
                {slot.item && (
                  <ShopCardItem
                    item={slot.item}
                    action={(item) => handleBuyAction(slot, item)}
                    disabled={!canBuyItem(slot.item)}
                  />
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
