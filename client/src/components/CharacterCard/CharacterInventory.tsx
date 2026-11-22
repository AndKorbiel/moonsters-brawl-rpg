import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

import { useDispatch } from "react-redux";

import {
  calculateStatsFromItem,
  dropItem,
} from "../../redux/actions/character";
import { CharacterState, Item, ItemType } from "../../types";

type CharacterInventoryProps = {
  character: CharacterState;
  allowDrop: boolean;
};

export const CharacterInventory = ({
  character,
  allowDrop,
}: CharacterInventoryProps) => {
  const dispatch = useDispatch();
  const inventorySlots = [
    {
      type: ItemType.WEAPON,
      placeholder: "assets/images/wepon_placeholder.svg",
    },
    {
      type: ItemType.OFF_HAND,
      placeholder: "assets/images/off_hand_placeholder.svg",
    },
    {
      type: ItemType.ARMOR,
      placeholder: "assets/images/armor_placeholder.svg",
    },
    {
      type: ItemType.MAGIC,
      placeholder: "assets/images/magic_item_placeholder.svg",
    },
  ];

  const handleDropItem = (item: Item) => {
    dispatch(dropItem(item));
    const itemWithReverseStats = [
      { name: item.stats[0].name, value: -item.stats[0].value },
    ];

    dispatch(calculateStatsFromItem(itemWithReverseStats));
  };

  return (
    <CardContent id="character-inventory">
      <Typography gutterBottom variant="h5" component="div">
        Inventory
      </Typography>

      <Grid container spacing={2} className="inventory-cont">
        {inventorySlots.map((slot) => {
          const item = character.items.find(
            (characterItem) => characterItem.type === slot.type,
          );

          if (!item) {
            return (
              <Grid
                size={6}
                className={`inventory-box inventory-placeholder inventory-placeholder-${slot.type}`}
                key={slot.type}
                sx={{
                  aspectRatio: "1 / 1",
                  minWidth: 0,
                  overflow: "hidden",
                  padding: 0,
                  position: "relative",
                }}
              >
                <CardMedia
                  component="img"
                  image={slot.placeholder}
                  sx={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    display: "block",
                    objectFit: "cover !important",
                  }}
                />
              </Grid>
            );
          }

          return (
            <Grid
              size={6}
              className="inventory-box"
              key={item.id}
              sx={{
                position: "relative",
                "&:hover .inventory-drop-actions, &:focus-within .inventory-drop-actions":
                  {
                    opacity: 1,
                    pointerEvents: "auto",
                  },
              }}
            >
              <CardMedia
                component="img"
                image={item.image}
                sx={{ height: "100%", objectFit: "cover" }}
              />
              {allowDrop && (
                <CardActions
                  className="inventory-drop-actions"
                  sx={{
                    position: "absolute",
                    inset: 0,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.65)",
                    opacity: 0,
                    pointerEvents: "none",
                    transition: "opacity 150ms ease-in-out",
                  }}
                >
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<HighlightOffIcon />}
                    onClick={() => handleDropItem(item)}
                  >
                    Drop item
                  </Button>
                </CardActions>
              )}
            </Grid>
          );
        })}
      </Grid>
    </CardContent>
  );
};
