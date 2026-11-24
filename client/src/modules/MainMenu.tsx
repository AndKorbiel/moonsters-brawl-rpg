import Button from "@mui/material/Button";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import { useDispatch } from "react-redux";
import { PixelPanel } from "../components/ui/PixelPanel";
import { colors, px } from "../theme/tokens";
import { setStatusCode } from "../redux/actions/game";
import { MenuOption } from "../types";

export function MainMenu({ options }: { options: MenuOption[] }) {
  const dispatch = useDispatch();

  return (
    <PixelPanel
      sx={{
        width: "100%",
        maxWidth: px(220),
        mx: "auto",
        boxSizing: "border-box",
        backgroundColor: colors.panel,
      }}
      className="centered text-centered main-menu"
      data-testid="main-menu"
    >
      <MenuList
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: px(10),
          p: `${px(8)} ${px(18)}`,
        }}
      >
        {options.map((option) => {
          return (
            <MenuItem
              key={option.value}
              sx={{
                position: "relative",
                overflow: "visible",
                justifyContent: "center",
                minHeight: 0,
                p: 0,
                "&::before, &::after": {
                  content: '""',
                  position: "absolute",
                  top: "50%",
                  width: px(5),
                  height: px(5),
                  backgroundColor: colors.ember,
                  clipPath: "polygon(0 0, 100% 50%, 0 100%)",
                  transform: "translateY(-50%)",
                  visibility: "hidden",
                  pointerEvents: "none",
                  zIndex: 1,
                },
                "&::before": { left: px(-12) },
                "&::after": {
                  right: px(-12),
                  transform: "translateY(-50%) rotate(180deg)",
                },
                "&:hover::before, &:hover::after": { visibility: "visible" },
              }}
            >
              <ListItemText>
                <Button
                  variant="text"
                  onClick={() => dispatch(setStatusCode(option.value))}
                  fullWidth
                  sx={{ minHeight: px(25), fontSize: 28 }}
                >
                  {option.label}
                </Button>
              </ListItemText>
            </MenuItem>
          );
        })}
      </MenuList>
    </PixelPanel>
  );
}
