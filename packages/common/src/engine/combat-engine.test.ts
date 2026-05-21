import { describe, expect, test } from "bun:test";
import {
  rollDice,
  getEquipSlot,
  buildSlotAliases,
  getEquippedDefense,
} from "./combat-engine.ts";
import type { EquipmentConfig } from "./combat-engine.ts";

// ── Test config matching the default fantasy system.yml ──

const config: EquipmentConfig = {
  equipSlots: {
    mainHand: {
      name: "Main Hand",
      category: "weapon",
      aliases: ["weapon", "main hand", "mainhand"],
    },
    offHand: { name: "Off Hand", category: "weapon", aliases: ["shield", "off hand", "offhand"] },
    head: { name: "Head", category: "armor", aliases: ["helmet", "hat", "helm"] },
    body: { name: "Body", category: "armor", aliases: ["armor", "chest", "torso"] },
    feet: { name: "Feet", category: "armor", aliases: ["boots", "shoes"] },
    ring: { name: "Ring", category: "accessory", aliases: ["finger"] },
  },
  itemTypes: {
    weapon: { name: "Weapon", equippable: true, defaultSlot: "mainHand" },
    armor: {
      name: "Armor",
      equippable: true,
      defaultSlot: "body",
      equipSlots: ["head", "body", "feet", "offHand"],
    },
    accessory: { name: "Accessory", equippable: true, defaultSlot: "ring", equipSlots: ["ring"] },
    consumable: { name: "Consumable", stackable: true },
    material: { name: "Material", stackable: true },
    key: { name: "Key" },
  },
};

describe("dice", () => {
  test("rollDice returns correct range", () => {
    for (let i = 0; i < 100; i++) {
      const roll = rollDice(2, 6); // 2d6: 2-12
      expect(roll).toBeGreaterThanOrEqual(2);
      expect(roll).toBeLessThanOrEqual(12);
    }
  });
});

describe("equipment helpers", () => {
  test("getEquipSlot for weapons", () => {
    expect(getEquipSlot(config, "weapon", {}, ["melee"])).toBe("mainHand");
    expect(getEquipSlot(config, "weapon", {}, ["ranged"])).toBe("mainHand");
  });

  test("getEquipSlot for armor", () => {
    expect(getEquipSlot(config, "armor", { slot: "head" }, ["head"])).toBe("head");
    expect(getEquipSlot(config, "armor", { slot: "body" }, ["body"])).toBe("body");
    expect(getEquipSlot(config, "armor", {}, ["offHand"])).toBe("offHand");
    expect(getEquipSlot(config, "armor", {}, [])).toBe("body"); // default armor slot
  });

  test("getEquipSlot for armor via tags", () => {
    expect(getEquipSlot(config, "armor", {}, ["head"])).toBe("head");
    expect(getEquipSlot(config, "armor", {}, ["feet"])).toBe("feet");
  });

  test("getEquipSlot returns null for non-equippables", () => {
    expect(getEquipSlot(config, "consumable", {}, [])).toBeNull();
    expect(getEquipSlot(config, "material", {}, [])).toBeNull();
    expect(getEquipSlot(config, "key", {}, [])).toBeNull();
  });

  test("getEquipSlot returns null for unknown types", () => {
    expect(getEquipSlot(config, "cyberdeck", {}, [])).toBeNull();
  });

  test("getEquipSlot explicit slot in properties takes priority", () => {
    expect(getEquipSlot(config, "armor", { slot: "feet" }, ["head"])).toBe("feet");
  });

  test("getEquipSlot respects item type slot restrictions", () => {
    // Accessory can only go in "ring" — tag "head" won't match even though it's a valid slot
    expect(getEquipSlot(config, "accessory", {}, ["head"])).toBe("ring");
  });

  test("buildSlotAliases maps all aliases", () => {
    const aliases = buildSlotAliases(config);
    expect(aliases["weapon"]).toBe("mainHand");
    expect(aliases["mainhand"]).toBe("mainHand");
    expect(aliases["main hand"]).toBe("mainHand");
    expect(aliases["shield"]).toBe("offHand");
    expect(aliases["helmet"]).toBe("head");
    expect(aliases["armor"]).toBe("body");
    expect(aliases["boots"]).toBe("feet");
    expect(aliases["finger"]).toBe("ring");
    expect(aliases["mainhand"]).toBe("mainHand");
    expect(aliases["head"]).toBe("head");
    expect(aliases["ring"]).toBe("ring");
  });

  test("getEquippedDefense sums all armor", () => {
    const eq = {
      head: {
        instanceId: "1",
        definitionId: "cap",
        name: "Cap",
        quantity: 1,
        properties: { defense: 1 },
      },
      body: {
        instanceId: "2",
        definitionId: "armor",
        name: "Armor",
        quantity: 1,
        properties: { defense: 3 },
      },
      mainHand: {
        instanceId: "3",
        definitionId: "sword",
        name: "Sword",
        quantity: 1,
        properties: { damage: 5 },
      },
    };
    expect(getEquippedDefense(eq)).toBe(4); // 1 + 3
  });
});

describe("equipment with custom system", () => {
  const sciFiConfig: EquipmentConfig = {
    equipSlots: {
      cranial: { name: "Cranial Implant", category: "implant" },
      cyberdeck: { name: "Cyberdeck", category: "tech" },
      exosuit: { name: "Exosuit", category: "armor" },
    },
    itemTypes: {
      implant: {
        name: "Implant",
        equippable: true,
        defaultSlot: "cranial",
        equipSlots: ["cranial"],
      },
      tech: { name: "Tech", equippable: true, defaultSlot: "cyberdeck" },
      armor: { name: "Armor", equippable: true, defaultSlot: "exosuit" },
    },
  };

  test("sci-fi system resolves custom slots", () => {
    expect(getEquipSlot(sciFiConfig, "implant", {}, [])).toBe("cranial");
    expect(getEquipSlot(sciFiConfig, "tech", {}, [])).toBe("cyberdeck");
    expect(getEquipSlot(sciFiConfig, "armor", {}, [])).toBe("exosuit");
  });

  test("sci-fi system rejects fantasy types", () => {
    expect(getEquipSlot(sciFiConfig, "weapon", {}, [])).toBeNull();
  });
});
