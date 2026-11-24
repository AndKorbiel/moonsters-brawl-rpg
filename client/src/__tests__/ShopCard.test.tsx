import { createStore } from "redux";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { initializeShop } from "../redux/actions/shop";
import { rootReducer } from "../redux/reducers";
import { ShopCard } from "../modules/ShopCard";
import { gameTheme } from "../theme/gameTheme";
import { buttonStates, colors } from "../theme/tokens";

describe("ShopCard", () => {
  it("shows three offers and clears the purchased slot", () => {
    const store = createStore(rootReducer);
    store.dispatch(initializeShop(() => 0));

    const { container } = render(
      <Provider store={store}>
        <ShopCard />
      </Provider>,
    );

    expect(
      screen.getByRole("heading", {
        level: 5,
        name: "Welcome to the Magic Shop",
      }),
    ).toBeInTheDocument();

    const initialGold = store.getState().character.gold;
    const firstItem = store.getState().shop.slots[0].item!;
    expect(
      screen.getAllByRole("button", { name: "Buy this item" }),
    ).toHaveLength(3);
    expect(screen.getByText("Type: Armor")).toBeInTheDocument();
    expect(screen.getByText("Type: Magic")).toBeInTheDocument();
    expect(screen.getByText(/^Type: (Weapon|Off-hand)$/)).toBeInTheDocument();
    expect(screen.getAllByText("Rarity: Common")).toHaveLength(3);
    const goldIcons = container.querySelectorAll(
      'img[src="assets/images/gold-coins.svg"]',
    );
    expect(goldIcons).toHaveLength(3);
    expect(screen.queryByText(/Price:/)).not.toBeInTheDocument();
    const itemImages =
      container.querySelectorAll<HTMLImageElement>(".MuiCardMedia-img");
    expect(itemImages).toHaveLength(3);
    itemImages.forEach((image) => {
      expect(image).toHaveStyle({
        objectFit: "contain",
        imageRendering: "pixelated",
      });
    });
    goldIcons.forEach((icon) => {
      expect(icon).toHaveStyle({
        height: '18px',
        verticalAlign: 'bottom',
      });
      expect(icon.parentElement).toHaveStyle({
        lineHeight: '18px',
        width: '88px',
        minHeight: '28px',
        backgroundColor: colors.plate,
      });
    });
    fireEvent.click(
      screen.getAllByRole("button", { name: "Buy this item" })[0],
    );

    expect(store.getState().character.gold).toBe(
      initialGold - firstItem.price,
    );
    expect(
      store.getState().shop.slots.filter((slot) => slot.item !== null),
    ).toHaveLength(2);
    expect(store.getState().character.items).toHaveLength(1);
    expect(
      screen.getByRole("heading", { name: "Sold", level: 5 }),
    ).toBeInTheDocument();
    const soldCard = Array.from(
      container.querySelectorAll<HTMLElement>(".MuiCard-root"),
    ).find((card) => card.textContent?.includes(firstItem.name));
    expect(soldCard).toHaveStyle({
      filter: "grayscale(1)",
      opacity: "0.45",
    });
  });

  it("shows disabled gold buy buttons when the character lacks enough gold", () => {
    const store = createStore(rootReducer);
    store.dispatch(initializeShop(() => 0));
    const state = store.getState();
    const poorStore = createStore(rootReducer, {
      ...state,
      character: { ...state.character, gold: 0 },
    });

    render(
      <ThemeProvider theme={gameTheme}>
        <Provider store={poorStore}>
          <ShopCard />
        </Provider>
      </ThemeProvider>,
    );

    const buyButtons = screen.getAllByRole("button", {
      name: "Buy this item",
    });
    expect(buyButtons).toHaveLength(3);
    buyButtons.forEach((button) => {
      expect(button).toBeDisabled();
      expect(button).toHaveStyle({
        backgroundColor: buttonStates.gold.disabled.face,
      });
    });
  });

  it("allows one reroll per round and disables it after a purchase", () => {
    const store = createStore(rootReducer);
    store.dispatch(initializeShop(() => 0));

    render(
      <Provider store={store}>
        <ShopCard />
      </Provider>,
    );

    const rerollButton = screen.getByRole("button", { name: "Reroll stock" });
    expect(rerollButton).toBeEnabled();
    fireEvent.click(rerollButton);
    expect(rerollButton).toBeDisabled();

    fireEvent.click(
      screen.getAllByRole("button", { name: "Buy this item" })[0],
    );
    expect(rerollButton).toBeDisabled();
  });

  it("disables reroll after an item is bought", () => {
    const store = createStore(rootReducer);
    store.dispatch(initializeShop(() => 0));

    render(
      <Provider store={store}>
        <ShopCard />
      </Provider>,
    );

    fireEvent.click(
      screen.getAllByRole("button", { name: "Buy this item" })[0],
    );

    expect(
      screen.getByRole("button", { name: "Reroll stock" }),
    ).toBeDisabled();
  });
});
