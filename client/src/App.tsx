import "./styles/App.scss";
import Grid from "@mui/material/Grid";
import { ThemeProvider } from "@mui/material/styles";
import { gameTheme } from "./theme/gameTheme";
import { GameGlobalStyles } from "./theme/GameGlobalStyles";

import { lazy, Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeShop } from "./redux/actions/shop";
import { GAME_STATUS, START_GAME } from "./redux/constants/game";

import { MainMenu } from "./modules/MainMenu";
import { AppState } from "./types";

const Navbar = lazy(() =>
  import("./components/Navbar").then(({ Navbar }) => ({
    default: Navbar,
  })),
);
const CharacterCardContainer = lazy(() =>
  import("./modules/CharacterCard").then(({ CharacterCardContainer }) => ({
    default: CharacterCardContainer,
  })),
);
const InventoryCard = lazy(() =>
  import("./modules/InventoryCard").then(({ InventoryCard }) => ({
    default: InventoryCard,
  })),
);
const FightScreenCard = lazy(() =>
  import("./modules/FightScreenCard").then(({ FightScreenCard }) => ({
    default: FightScreenCard,
  })),
);
const OpponentCard = lazy(() =>
  import("./modules/OpponentCard").then(({ OpponentCard }) => ({
    default: OpponentCard,
  })),
);
const ShopCard = lazy(() =>
  import("./modules/ShopCard").then(({ ShopCard }) => ({
    default: ShopCard,
  })),
);
const About = lazy(() =>
  import("./components/MainMenu/About").then(({ About }) => ({
    default: About,
  })),
);
const HighScore = lazy(() =>
  import("./components/MainMenu/HighScore").then(({ HighScore }) => ({
    default: HighScore,
  })),
);
const LoadGame = lazy(() =>
  import("./components/MainMenu/LoadGame").then(({ LoadGame }) => ({
    default: LoadGame,
  })),
);
const Login = lazy(() =>
  import("./components/Login").then(({ Login }) => ({
    default: Login,
  })),
);
const SaveGame = lazy(() =>
  import("./components/MainMenu/SaveGame").then(({ SaveGame }) => ({
    default: SaveGame,
  })),
);

export default function App() {
  const dispatch = useDispatch();
  const game = useSelector((state: AppState) => state.game);
  const { menuOptions, statusCode } = game;

  useEffect(() => {
    if (statusCode === GAME_STATUS.CHARACTER_SCREEN && !game.gameStarted) {
      dispatch(initializeShop());
      dispatch({ type: START_GAME });
    }
  }, [dispatch, game.gameStarted, statusCode]);

  if (!menuOptions) return <h1>Loading...</h1>;

  return (
    <ThemeProvider theme={gameTheme}>
      <GameGlobalStyles />
      <Suspense fallback={null}>
        <Navbar status={statusCode} />
      </Suspense>

      <div className="App">
        <Grid
          container
          sx={{ maxWidth: 1536 }}
          spacing={2}
          className="main-cont centered"
        >
          <Suspense
            fallback={
              <Grid size={12}>
                <h1>Loading...</h1>
              </Grid>
            }
          >
            {statusCode === GAME_STATUS.MAIN_MENU && (
              <Grid size={12}>
                <MainMenu options={menuOptions} />
              </Grid>
            )}

            {statusCode === GAME_STATUS.CHARACTER_SCREEN && (
              <>
                <Grid size={{ xs: 12, md: 4, lg: 3 }}>
                  <CharacterCardContainer />
                </Grid>
                <Grid size={{ xs: 12, md: 2, lg: 3 }}>
                  <InventoryCard />
                </Grid>
                <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                  <ShopCard />
                </Grid>
              </>
            )}

            {statusCode === GAME_STATUS.FIGHT_SCREEN && (
              <>
                <Grid size={{ xs: 12, md: 4, lg: 3 }}>
                  <CharacterCardContainer />
                </Grid>
                <Grid size={{ xs: 12, md: 4, lg: 6 }}>
                  <FightScreenCard />
                </Grid>
                <Grid size={{ xs: 12, md: 4, lg: 3 }}>
                  <OpponentCard />
                </Grid>
              </>
            )}

            {statusCode === GAME_STATUS.SAVE_GAME && (
              <Grid size={12}>
                <SaveGame />
              </Grid>
            )}
            {statusCode === GAME_STATUS.LOAD_GAME && (
              <Grid size={12}>
                <LoadGame />
              </Grid>
            )}
            {statusCode === GAME_STATUS.ABOUT && (
              <Grid size={12}>
                <About />
              </Grid>
            )}
            {statusCode === GAME_STATUS.HIGH_SCORE && (
              <Grid size={12}>
                <HighScore />
              </Grid>
            )}
            {statusCode === GAME_STATUS.LOGIN && (
              <Grid size={12}>
                <Login />
              </Grid>
            )}
          </Suspense>
        </Grid>
      </div>
    </ThemeProvider>
  );
}
