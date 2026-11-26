import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { CharacterState } from "../../types";
import { CharacterLocalState } from "../../modules";
import { STAT_LABELS } from "../../constants/statLabels";
import { StatPlate } from "../ui/StatPlate";
import { colors, px } from "../../theme/tokens";

type CharacterStatsProps = {
  character: CharacterState;
  handleStatsChange: (name: string, amount: number) => void;
  showGold: boolean;
  showLevel: boolean;
  points: CharacterLocalState["points"];
  stats: CharacterLocalState["stats"];
  compact?: boolean;
};

const statIcons = {
  attack: "icon-sword",
  defense: "icon-shield",
  life: "icon-heart",
} as const;

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

export const CharacterStats = ({
  character,
  points,
  stats,
  showGold,
  showLevel,
  handleStatsChange,
  compact = false,
}: CharacterStatsProps) => {
  return (
    <CardActions
      disableSpacing
      sx={{
        display: "block",
        p: 0,
        "& ul": {
          display: "flex",
          flexDirection: "column",
          alignItems: compact ? "flex-start" : "center",
          gap: compact ? 0 : px(5),
          width: "100%",
          m: 0,
          p: 0,
          listStyle: "none",
        },
        "& li": {
          width: "100%",
          m: 0,
          listStyle: "none",
        },
        "& .character-summary-row, & .character-points-row": {
          display: "flex",
          justifyContent: "center",
        },
        "& .character-stat-row": {
          display: compact ? "flex" : "grid",
          gridTemplateColumns: compact
            ? undefined
            : character.isEditing
              ? "auto minmax(0, 1fr) auto"
              : "minmax(0, 1fr)",
          alignItems: "center",
          justifyContent: compact ? "flex-start" : undefined,
          gap: px(4),
          minHeight: px(11),
        },
        "& .character-stat-controls": {
          display: "flex",
          alignItems: "center",
          gap: px(4),
        },
        "& .character-stat-controls .MuiButton-root": {
          width: px(22),
          minWidth: px(22),
          minHeight: px(20),
          px: px(1),
          fontSize: 20,
        },
        "& .character-stat-label": {
          display: "flex",
          alignItems: "center",
          justifyContent: compact ? "flex-start" : "center",
          gap: compact ? px(2) : px(4),
          minWidth: 0,
          color: colors.parchment,
          whiteSpace: "nowrap",
          ...(compact && { lineHeight: px(11) }),
        },
        "& .character-stat-label img": {
          width: px(9),
          height: px(9),
          flexShrink: 0,
        },
        [`@media (max-width: ${px(200)})`]: {
          "& .character-stat-row": { gap: px(2) },
          "& .character-stat-controls": { gap: px(1) },
          "& .character-stat-controls .MuiButton-root": {
            width: px(18),
            minWidth: px(18),
            px: px(1),
            fontSize: 16,
          },
          "& .character-stat-label": { gap: px(2), fontSize: 16 },
        },
      }}
    >
      <ul>
        {showLevel && (
          <li className="character-summary-row">
            <StatPlate label="Level:" value={character.level} width={px(96)} />
          </li>
        )}
        {showGold && (
          <li className="character-summary-row">
            <StatPlate coin width={px(96)}>
              <Typography variant="h6" sx={{ lineHeight: px(9) }}>
                {character.gold}
              </Typography>
            </StatPlate>
          </li>
        )}
        {character.isEditing && (
          <li className="character-points-row">
            <StatPlate width={px(124)}>
              <Typography
                component="span"
                variant="body1"
                aria-hidden="true"
                sx={{ color: colors.parchment }}
              >
                Points to spend
              </Typography>
              <Box
                component="span"
                aria-hidden="true"
                sx={{
                  width: px(15),
                  height: px(11),
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxSizing: "border-box",
                  border: `${px()} solid ${colors.ember}`,
                  backgroundColor: colors.emberBox,
                  color: colors.emberText,
                  lineHeight: 1,
                }}
              >
                {points}
              </Box>
              <Box component="span" sx={visuallyHiddenSx}>
                Points to spend: {points}
              </Box>
            </StatPlate>
          </li>
        )}

        {character.stats.map((el) => {
          const label = STAT_LABELS[el.name];
          const value = character.isEditing
            ? stats.filter((item) => item.name === el.name)[0].value
            : el.value;

          return (
            <li className="character-stat-row" key={el.name}>
              {character.isEditing && (
                <Box className="character-stat-controls">
                  <Button
                    variant="contained"
                    size="small"
                    aria-label={`Remove 5 ${label} points`}
                    disabled={
                      (stats?.find((stat) => stat.name === el.name)?.value ??
                        el.value) -
                        el.value <
                      5
                    }
                    onClick={() => handleStatsChange(el.name, -5)}
                  >
                    {"<<"}
                  </Button>
                  <Button
                    variant="contained"
                    name={el.name}
                    onClick={() => handleStatsChange(el.name, -1)}
                  >
                    -
                  </Button>
                </Box>
              )}

              <Typography variant="h6" className="character-stat-label">
                <Box
                  component="img"
                  src={`assets/images/pixel/${statIcons[el.name]}.svg`}
                  alt=""
                  aria-hidden="true"
                />
                <Box
                  component="span"
                  aria-hidden="true"
                  sx={{ color: colors.parchment }}
                >
                  {label}:{" "}
                </Box>
                <Box
                  component="span"
                  aria-hidden="true"
                  sx={{ color: colors.gold }}
                >
                  {value}
                </Box>
                <Box component="span" sx={visuallyHiddenSx}>
                  {`${label}: ${value}`}
                </Box>
              </Typography>

              {character.isEditing && (
                <Box className="character-stat-controls">
                  <Button
                    variant="contained"
                    name={el.name}
                    onClick={() => handleStatsChange(el.name, 1)}
                  >
                    +
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    aria-label={`Add 5 ${label} points`}
                    disabled={(points ?? 0) < 5}
                    onClick={() => handleStatsChange(el.name, 5)}
                  >
                    {">>"}
                  </Button>
                </Box>
              )}
            </li>
          );
        })}
      </ul>
    </CardActions>
  );
};
