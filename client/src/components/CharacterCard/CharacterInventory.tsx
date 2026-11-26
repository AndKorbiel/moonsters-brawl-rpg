import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

import { useDispatch } from "react-redux";
import { PixelPanel } from "../ui/PixelPanel";

import {
  calculateStatsFromItem,
  dropItem,
} from "../../redux/actions/character";
import { STAT_LABELS } from "../../constants/statLabels";
import { CharacterState, Item, ItemType } from "../../types";
import { colors, itemRarityColors, px } from "../../theme/tokens";

type CharacterInventoryProps = {
  character: CharacterState;
  allowDrop: boolean;
  compact?: boolean;
};

export const CharacterInventory = ({
  character,
  allowDrop,
  compact = false,
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
    <CardContent
      id="character-inventory"
      sx={{
        width: "100%",
        p: 0,
        "&:last-child": { pb: 0 },
      }}
    >
      <Typography
        variant={compact ? "h6" : "h5"}
        component="div"
        sx={
          compact
            ? { mb: px(2), color: colors.gold, fontSize: 16, lineHeight: px(8) }
            : { mb: px(4) }
        }
      >
        Inventory
      </Typography>

      {!compact && (
        <Box
          aria-hidden="true"
          sx={{
            width: "100%",
            height: px(),
            mb: px(8),
            backgroundColor: colors.goldDark,
            boxShadow: `0 ${px()} 0 ${colors.outline}`,
          }}
        />
      )}

      <Box
        className="inventory-cont"
        sx={{
          display: "grid",
          gridTemplateColumns: compact
            ? "repeat(4, minmax(0, 1fr))"
            : "repeat(2, minmax(0, 1fr))",
          gap: compact ? px(3) : px(8),
          width: "100%",
        }}
      >
        {inventorySlots.map((slot) => {
          const item = character.items.find(
            (characterItem) => characterItem.type === slot.type,
          );
          const label = {
            [ItemType.WEAPON]: "Weapon",
            [ItemType.OFF_HAND]: "Off-hand",
            [ItemType.ARMOR]: "Armor",
            [ItemType.MAGIC]: "Magic item",
          }[slot.type];
          const image = item?.image ?? slot.placeholder;
          if (compact) {
            const tooltipContent = item ? (
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: px(1) }}
              >
                <Typography
                  component="div"
                  variant="body2"
                  sx={{ fontWeight: "bold" }}
                >
                  {item.name}
                </Typography>
                <Typography component="div" variant="body2">
                  Rarity:{" "}
                  <Box
                    component="span"
                    sx={{ color: itemRarityColors[item.rarity] }}
                  >
                    {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
                  </Box>
                </Typography>
                <Typography component="div" variant="body2">
                  Type: {label}
                </Typography>
                {item.stats.map((stat) => (
                  <Typography component="div" variant="body2" key={stat.name}>
                    +{stat.value} {STAT_LABELS[stat.name]}
                  </Typography>
                ))}
              </Box>
            ) : (
              label
            );

            return (
              <Tooltip title={tooltipContent} key={slot.type}>
                <Box
                  aria-label={label}
                  className={`inventory-box ${
                    item
                      ? "inventory-equipped"
                      : `inventory-placeholder inventory-placeholder-${slot.type}`
                  }`}
                  sx={{
                    position: "relative",
                    minWidth: 0,
                    aspectRatio: "1 / 1",
                    overflow: "hidden",
                    backgroundColor: item ? colors.panelSolid : colors.inset,
                    ...(!item && {
                      boxShadow: `inset 0 0 0 ${px()} ${colors.outline}, inset 0 0 0 ${px(
                        2,
                      )} ${colors.inventoryEmptyFrame}, inset 0 0 0 ${px(
                        3,
                      )} ${colors.outline}`,
                    }),
                  }}
                >
                  {item ? (
                    <PixelPanel
                      sx={{
                        width: "100%",
                        height: "100%",
                        p: 0,
                        boxSizing: "border-box",
                        backgroundColor: colors.inset,
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={image}
                        alt=""
                        aria-hidden="true"
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          imageRendering: "pixelated",
                        }}
                      />
                    </PixelPanel>
                  ) : (
                    <CardMedia
                      component="img"
                      image={image}
                      alt=""
                      aria-hidden="true"
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center top",
                        opacity: 0.55,
                        filter: "grayscale(1) sepia(0.35)",
                        clipPath: "inset(0 0 16% 0)",
                      }}
                    />
                  )}
                </Box>
              </Tooltip>
            );
          }

          const slotContent = (
            <>
              <Box
                className="inventory-image-container"
                sx={{
                  position: "relative",
                  display: "flex",
                  flex: "1 1 auto",
                  minHeight: 0,
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  backgroundColor: item ? colors.panelSolid : colors.inset,
                  ...(!item && {
                    boxShadow: `inset ${px()} ${px()} 0 ${colors.insetShadow}`,
                  }),
                }}
              >
                <CardMedia
                  component="img"
                  image={image}
                  alt=""
                  aria-hidden="true"
                  sx={
                    item
                      ? {
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          imageRendering: "pixelated",
                        }
                      : {
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "center top",
                          opacity: 0.55,
                          filter: "grayscale(1) sepia(0.35)",
                          clipPath: "inset(0 0 16% 0)",
                        }
                  }
                />
                {item && (
                  <CardActions
                    className="inventory-drop-actions"
                    disableSpacing
                    sx={{
                      position: "absolute",
                      inset: 0,
                      flexDirection: "column",
                      alignItems: "stretch",
                      gap: px(2),
                      overflow: "hidden",
                      backgroundColor: colors.panel,
                      color: colors.parchment,
                      opacity: 0,
                      pointerEvents: "none",
                      p: px(2),
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flex: "1 1 auto",
                        minHeight: 0,
                        flexDirection: "column",
                        justifyContent: "center",
                        gap: px(2),
                        overflowY: "auto",
                      }}
                    >
                      <Typography
                        variant="body2"
                        align="center"
                        sx={{
                          fontWeight: "bold",
                          lineHeight: px(8),
                          mb: px(2),
                          overflowWrap: "anywhere",
                        }}
                      >
                        {item.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        align="center"
                        sx={{ lineHeight: px(8) }}
                      >
                        Price: {item.price} gold
                      </Typography>
                      <Typography
                        variant="body2"
                        align="center"
                        sx={{ lineHeight: px(8) }}
                      >
                        Rarity:{" "}
                        <Box
                          component="span"
                          sx={{ color: itemRarityColors[item.rarity] }}
                        >
                          {item.rarity.charAt(0).toUpperCase() +
                            item.rarity.slice(1)}
                        </Box>
                      </Typography>
                      {item.stats.map((stat) => (
                        <Typography
                          variant="body2"
                          align="center"
                          key={stat.name}
                          sx={{ lineHeight: px(8) }}
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
                          minHeight: px(20),
                          minWidth: 0,
                          mt: px(1),
                          px: px(2),
                          py: 0,
                          fontSize: 14,
                          lineHeight: 1,
                          "& .MuiButton-startIcon": {
                            ml: 0,
                            mr: px(2),
                          },
                          "& .MuiSvgIcon-root": { fontSize: px(6) },
                        }}
                      >
                        Drop item
                      </Button>
                    )}
                  </CardActions>
                )}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flex: "0 0 auto",
                  alignItems: "center",
                  justifyContent: "center",
                  height: px(12),
                  borderTop: `${px()} solid ${
                    item ? colors.goldDark : colors.inventoryLabelLine
                  }`,
                  backgroundColor: item
                    ? colors.panelSolid
                    : colors.inventoryLabel,
                }}
              >
                <Typography
                  component="span"
                  variant="h6"
                  sx={{
                    color: item ? colors.gold : colors.labelMuted,
                    fontSize: 20,
                    lineHeight: px(12),
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </Typography>
              </Box>
            </>
          );

          if (!item) {
            return (
              <Box
                className={`inventory-box inventory-placeholder inventory-placeholder-${slot.type}`}
                key={slot.type}
                sx={{
                  minWidth: 0,
                  overflow: "hidden",
                  aspectRatio: "33 / 40",
                  position: "relative",
                  backgroundColor: colors.inset,
                  boxShadow: `inset 0 0 0 ${px()} ${colors.outline}, inset 0 0 0 ${px(
                    2,
                  )} ${colors.inventoryEmptyFrame}, inset 0 0 0 ${px(
                    3,
                  )} ${colors.outline}`,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  {slotContent}
                </Box>
              </Box>
            );
          }

          return (
            <PixelPanel
              className="inventory-box"
              key={item.id}
              sx={{
                display: "flex",
                flexDirection: "column",
                minWidth: 0,
                overflow: "hidden",
                aspectRatio: "33 / 40",
                p: 0,
                boxSizing: "border-box",
                backgroundColor: colors.inset,
                border: `${px()} solid transparent`,
                "&:hover, &:focus-within": {
                  borderColor: colors.ember,
                },
                "&:hover .inventory-image-container, &:focus-within .inventory-image-container":
                  {
                    display: "contents",
                  },
                "&:hover .inventory-drop-actions, &:focus-within .inventory-drop-actions":
                  {
                    opacity: 1,
                    pointerEvents: "auto",
                  },
              }}
            >
              {slotContent}
              <Box
                aria-hidden="true"
                sx={{
                  position: "absolute",
                  inset: px(2),
                  pointerEvents: "none",
                  "&::before, &::after": {
                    position: "absolute",
                    width: px(2),
                    height: px(2),
                    backgroundColor: colors.gold,
                    boxShadow: `0 0 0 ${px()} ${colors.goldDark}`,
                    content: '""',
                  },
                  "&::before": {
                    top: 0,
                    left: 0,
                  },
                  "&::after": {
                    right: 0,
                    bottom: 0,
                  },
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: px(2),
                    height: px(2),
                    backgroundColor: colors.gold,
                    boxShadow: `0 0 0 ${px()} ${colors.goldDark}`,
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: px(2),
                    height: px(2),
                    backgroundColor: colors.gold,
                    boxShadow: `0 0 0 ${px()} ${colors.goldDark}`,
                  }}
                />
              </Box>
            </PixelPanel>
          );
        })}
      </Box>
    </CardContent>
  );
};
