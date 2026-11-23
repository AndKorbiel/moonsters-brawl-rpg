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

    render(
      <Provider store={store}>
        <ShopCard />
      </Provider>,
    );

    const initialGold = store.getState().character.gold;
    const firstItem = store.getState().shop.slots[0].item!;
    expect(
      screen.getAllByRole("button", { name: "Buy this item" }),
    ).toHaveLength(3);
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
});
