import { createStore } from "redux";
import { Provider } from "react-redux";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { initializeShop } from "../redux/actions/shop";
import { rootReducer } from "../redux/reducers";
import { ShopCard } from "../modules/ShopCard";

describe("ShopCard", () => {
  it("shows three offers and clears the purchased slot", () => {
    const store = createStore(rootReducer);
    store.dispatch(initializeShop(() => 0));

    const { container } = render(
      <Provider store={store}>
        <ShopCard />
      </Provider>,
    );

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
    goldIcons.forEach((icon) => {
      expect(icon).toHaveStyle({
        height: '18px',
        verticalAlign: 'bottom',
      });
      expect(icon.parentElement).toHaveStyle({ lineHeight: '18px' });
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
