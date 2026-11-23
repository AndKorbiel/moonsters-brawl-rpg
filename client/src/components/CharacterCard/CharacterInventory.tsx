import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

import { useDispatch } from "react-redux";

import {
  calculateStatsFromItem,
  dropItem,
} from "../../redux/actions/character";
import { STAT_LABELS } from "../../constants/statLabels";
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
    const itemWithReverseStats = item.stats.map((stat) => ({
      ...stat,
      value: -stat.value,
    }));

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
              <CardActions
                className="inventory-drop-actions"
                disableSpacing
                sx={{
                  position: "absolute",
                  inset: 0,
                  flexDirection: "column",
                  alignItems: "stretch",
                  gap: 0.25,
                  overflow: "hidden",
                  backgroundColor: "rgba(0, 0, 0, 0.78)",
                  color: "white",
                  opacity: 0,
                  pointerEvents: "none",
                  padding: 0.5,
                  transition: "opacity 150ms ease-in-out",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flex: "1 1 auto",
                    minHeight: 0,
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: 0.25,
                    overflowY: "auto",
                  }}
                >
                  <Typography
                    variant="caption"
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      lineHeight: 1.15,
                      mb: 1,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {item.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    align="center"
                    sx={{ lineHeight: 1.15 }}
                  >
                    Price: {item.price} gold
                  </Typography>
                  <Typography
                    variant="caption"
                    align="center"
                    sx={{ lineHeight: 1.15 }}
                  >
                    Rarity:{" "}
                    {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
                  </Typography>
                  {item.stats.map((stat) => (
                    <Typography
                      variant="caption"
                      align="center"
                      key={stat.name}
                      sx={{ lineHeight: 1.15 }}
                    >
                      +{stat.value} {STAT_LABELS[stat.name]}
                    </Typography>
                  ))}
                </Box>
                {allowDrop && (
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    startIcon={<HighlightOffIcon />}
                    onClick={() => handleDropItem(item)}
                    sx={{
                      alignSelf: "center",
                      flexShrink: 0,
                      minHeight: 22,
                      minWidth: 0,
                      marginTop: 0.25,
                      paddingX: 0.75,
                      paddingY: 0,
                      fontSize: "0.625rem",
                      lineHeight: 1,
                      "& .MuiButton-startIcon": {
                        marginLeft: 0,
                        marginRight: 0.25,
                      },
                      "& .MuiSvgIcon-root": { fontSize: "0.75rem" },
                    }}
                  >
                    Drop item
                  </Button>
                )}
              </CardActions>
            </Grid>
          );
        })}
      </Grid>
    </CardContent>
  );
};
