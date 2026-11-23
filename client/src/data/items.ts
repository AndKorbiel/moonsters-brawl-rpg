import { z } from "zod";
import itemCatalog from "./items.json";
import { ItemRarity, ItemType, type Item } from "../types";

export const itemSchema = z.strictObject({
  id: z.number().int().nonnegative(),
  name: z.string().trim().min(1),
  image: z.string().trim().min(1),
  price: z.number().int().nonnegative(),
  rarity: z.nativeEnum(ItemRarity),
  type: z.nativeEnum(ItemType),
  stats: z
    .array(
      z.strictObject({
        name: z.enum(["attack", "defense", "life"]),
        value: z.number(),
      }),
    )
    .min(1),
});

export const itemCatalogSchema = z
  .array(itemSchema)
  .superRefine((items, context) => {
    const ids = new Set<number>();

    items.forEach((item, index) => {
      if (ids.has(item.id)) {
        context.addIssue({
          code: "custom",
          path: [index, "id"],
          message: `Duplicate item id: ${item.id}`,
        });
      }
      ids.add(item.id);
    });
  });

export function parseItemCatalog(value: unknown): Item[] {
  const result = itemCatalogSchema.safeParse(value);

  if (!result.success) {
    throw new Error(
      `Invalid item catalog:\n${z.prettifyError(result.error)}`,
    );
  }

  return result.data;
}

export const items: Item[] = parseItemCatalog(itemCatalog);
