import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { GAME_OVER } from "../redux/constants/game";
import { buttonStates } from "../theme/tokens";
import App from "../App";

const renderApp = () =>
  render(
    <Provider store={store}>
      <App />
    </Provider>,
  );

const findShopHeading = () =>
  screen.findByText("Welcome to the Magic Shop", {}, { timeout: 5000 });

describe("App", () => {
  beforeEach(() => {
    store.dispatch({ type: GAME_OVER });
  });

  it("renders the title and main menu", async () => {
    renderApp();

    expect(await screen.findByText("Moonster Brawl RPG")).toBeInTheDocument();
    expect(screen.getByTestId("main-menu")).toBeInTheDocument();
  });

  it("opens the shop when starting a new game", async () => {
    renderApp();

    fireEvent.click(screen.getByRole("button", { name: /new game/i }));

    expect(await findShopHeading()).toBeInTheDocument();
    expect(screen.getByText("Inventory")).toBeInTheDocument();
    expect(store.getState().shop.slots).toHaveLength(3);
    expect(
      store.getState().shop.slots.every((slot) => slot.item !== null),
    ).toBe(true);
    expect(store.getState().character.gold).toBe(20);
  });

  it("keeps disabled shop buttons filled and visibly grey", async () => {
    renderApp();

    fireEvent.click(screen.getByRole("button", { name: /new game/i }));
    await findShopHeading();

    const rerollButton = screen.getByRole("button", { name: "Reroll stock" });
    fireEvent.click(rerollButton);

    expect(rerollButton).toBeDisabled();
    expect(rerollButton).toHaveClass("MuiButton-contained");
    expect(rerollButton).toHaveStyle({
      backgroundColor: buttonStates.stone.disabled.face,
    });
  });

  it("returns to the main menu from the menu button", async () => {
    renderApp();

    fireEvent.click(screen.getByRole("button", { name: /new game/i }));
    await findShopHeading();
    const stockBeforeMenu = store
      .getState()
      .shop.slots.map((slot) => slot.item?.id);
    fireEvent.click(await screen.findByRole("button", { name: /menu/i }));

    expect(screen.getByTestId("main-menu")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /resume/i }));
    await findShopHeading();
    expect(store.getState().shop.slots.map((slot) => slot.item?.id)).toEqual(
      stockBeforeMenu,
    );
  });
});
