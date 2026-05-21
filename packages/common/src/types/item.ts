import type { ItemDefinition, ItemProperties } from "@realms/lexicons";

/** A live instance of an item in a player's inventory or on the ground. */
export interface ItemInstance {
  instanceId: string;
  definitionId: string;
  name: string;
  quantity: number;
  properties?: ItemProperties;
}

/** Lookup map from definition ID to item definition. */
export type ItemRegistry = Map<string, ItemDefinition>;

/** Generate a collision-resistant unique ID for a new item instance. */
export function generateItemId(): string {
  return `item_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Instantiate an item from its definition, clamping quantity to the stack limit. */
export function createItemInstance(
  definitionId: string,
  definition: ItemDefinition,
  quantity: number = 1,
): ItemInstance {
  return {
    instanceId: generateItemId(),
    definitionId,
    name: definition.name,
    quantity: Math.min(quantity, definition.maxStack ?? (definition.stackable ? 99 : 1)),
    properties: definition.properties ? { ...definition.properties } : undefined,
  };
}
