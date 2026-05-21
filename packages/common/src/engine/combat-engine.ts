import type {
  ItemProperties,
  ItemTypeDef,
  EquipSlotDef,
  SpellDef,
} from "@realms/lexicons";
import type { ItemInstance } from "../types/item.js";

/** Subset of a server's GameSystem needed for equipment slot resolution. */
export interface EquipmentConfig {
  equipSlots: Record<string, EquipSlotDef>;
  itemTypes: Record<string, ItemTypeDef>;
}

/** Roll `count` dice with `sides` faces and return the sum. */
export function rollDice(count: number, sides: number): number {
  let total = 0;
  for (let i = 0; i < count; i++) {
    total += Math.floor(Math.random() * sides) + 1;
  }
  return total;
}

/**
 * Resolve the equip slot for an item, driven by server's system config.
 *
 * Priority:
 * 1. Explicit `properties.slot` if it's a valid slot ID
 * 2. Tag matching — if a tag matches a slot ID in the config
 * 3. Item type's `defaultSlot`
 * 4. null (not equippable)
 */
export function getEquipSlot(
  config: EquipmentConfig,
  type: string,
  properties?: ItemProperties,
  tags?: string[],
): string | null {
  const typeDef = config.itemTypes[type];

  if (!typeDef?.equippable) return null;

  if (properties?.slot && typeof properties.slot === "string") {
    if (config.equipSlots[properties.slot]) return properties.slot;
  }

  if (tags) {
    const validSlots = typeDef.equipSlots;
    for (const tag of tags) {
      if (config.equipSlots[tag]) {
        if (!validSlots || validSlots.includes(tag)) return tag;
      }
    }
  }

  if (typeDef.defaultSlot && config.equipSlots[typeDef.defaultSlot]) {
    return typeDef.defaultSlot;
  }

  return null;
}

/**
 * Build a map of alias -> slot ID from the equip slot config.
 * Includes the slot ID itself and its name (lowercased) as aliases.
 */
export function buildSlotAliases(config: EquipmentConfig): Record<string, string> {
  const aliases: Record<string, string> = {};
  for (const [slotId, def] of Object.entries(config.equipSlots)) {
    aliases[slotId.toLowerCase()] = slotId;
    aliases[def.name.toLowerCase()] = slotId;
    if (def.aliases) {
      for (const alias of def.aliases) {
        aliases[alias.toLowerCase()] = slotId;
      }
    }
  }
  return aliases;
}

/** Sum the `defense` property across all equipped items. */
export function getEquippedDefense(equipment: Record<string, ItemInstance>): number {
  let total = 0;
  for (const item of Object.values(equipment)) {
    const defense = item.properties?.defense;
    if (typeof defense === "number") total += defense;
  }
  return total;
}

/**
 * Shape returned by an attack resolution function.
 * Passed to format functions and used to apply damage.
 */
export interface AttackResult {
  hit: boolean;
  critical: boolean;
  roll: number;
  attackBonus: number;
  totalAttack: number;
  defense: number;
  damage: number;
  weaponName: string;
}

/**
 * Shape returned by a spell resolution function.
 * Passed to format functions and used to apply effects.
 */
export interface SpellResult {
  success: boolean;
  critical: boolean;
  roll: number;
  spellBonus: number;
  totalRoll: number;
  defense: number;
  amount: number;
  spellName: string;
  effect: SpellDef["effect"];
}
