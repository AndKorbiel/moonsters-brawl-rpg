import { describe, expect, it } from "vitest";
import { parseItemCatalog } from "../data/items";

describe("item catalog", () => {
  it("rejects unknown item types", () => {
    expect(() =>
      parseItemCatalog([
        {
          id: 0,
          name: "Unknown",
          image: "unknown.png",
          price: 1,
          type: "unknown",
          stats: [{ name: "attack", value: 1 }],
        },
      ]),
    ).toThrow("Invalid item catalog");
  });

  it("rejects duplicate item ids", () => {
    const item = {
      id: 0,
      name: "Sword",
      image: "sword.png",
      price: 1,
      type: "weapon",
      stats: [{ name: "attack", value: 1 }],
    };

    expect(() => parseItemCatalog([item, item])).toThrow(
      "Duplicate item id: 0",
    );
  });
});
