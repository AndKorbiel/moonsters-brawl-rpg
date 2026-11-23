import { describe, expect, it } from "vitest";
import { items, parseItemCatalog } from "../data/items";

describe("item catalog", () => {
  it("includes three rare items per type that each boost all three stats", () => {
    const rareItems = items.filter((item) => item.rarity === "rare");
    const types = ["armor", "off-hand", "weapon", "magic"];
    const expectedStats = ["attack", "defense", "life"];

    expect(rareItems).toHaveLength(12);

    types.forEach((type) => {
      const itemsOfType = rareItems.filter((item) => item.type === type);

      expect(itemsOfType).toHaveLength(3);
      itemsOfType.forEach((item) => {
        expect(item.stats.map((stat) => stat.name).sort()).toEqual(
          expectedStats,
        );
      });
    });
  });

  it("rejects unknown item types", () => {
    expect(() =>
      parseItemCatalog([
        {
          id: 0,
          name: "Unknown",
          image: "unknown.png",
          price: 1,
          rarity: "common",
          type: "unknown",
          stats: [{ name: "attack", value: 1 }],
        },
      ]),
    ).toThrow("Invalid item catalog");
  });

  it("rejects unknown item rarities", () => {
    expect(() =>
      parseItemCatalog([
        {
          id: 0,
          name: "Unknown",
          image: "unknown.png",
          price: 1,
          rarity: "legendary",
          type: "weapon",
          stats: [{ name: "attack", value: 1 }],
        },
      ]),
    ).toThrow("Invalid item catalog");
  });

  it("accepts up to three distinct stat bonuses per item", () => {
    const parsed = parseItemCatalog([
      {
        id: 0,
        name: "Arcane Armor",
        image: "guard.png",
        price: 60,
        rarity: "rare",
        type: "armor",
        stats: [
          { name: "defense", value: 50 },
          { name: "life", value: 30 },
          { name: "attack", value: 10 },
        ],
      },
    ]);

    expect(parsed[0].stats).toHaveLength(3);
    expect(() =>
      parseItemCatalog([
        {
          id: 1,
          name: "Overloaded Guard",
          image: "guard.png",
          price: 90,
          rarity: "rare",
          type: "off-hand",
          stats: [
            { name: "attack", value: 10 },
            { name: "defense", value: 10 },
            { name: "life", value: 10 },
            { name: "attack", value: 5 },
          ],
        },
      ]),
    ).toThrow("Invalid item catalog");
  });

  it("rejects duplicate stat names", () => {
    expect(() =>
      parseItemCatalog([
        {
          id: 0,
          name: "Duplicated Guard",
          image: "guard.png",
          price: 30,
          rarity: "magic",
          type: "off-hand",
          stats: [
            { name: "defense", value: 10 },
            { name: "defense", value: 5 },
          ],
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
      rarity: "common",
      type: "weapon",
      stats: [{ name: "attack", value: 1 }],
    };

    expect(() => parseItemCatalog([item, item])).toThrow(
      "Duplicate item id: 0",
    );
  });
});
