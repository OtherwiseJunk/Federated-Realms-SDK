import type { ItemDefinition, ItemProperties } from "@realms/lexicons";

export interface ItemInstance {
  instanceId: string;
  definitionId: string;
  name: string;
  quantity: number;
  properties?: ItemProperties;
}

export type ItemRegistry = Map<string, ItemDefinition>;

export function generateItemId(): string {
  return `item_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

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
