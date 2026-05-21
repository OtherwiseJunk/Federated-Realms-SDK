import type { NpcDefinition, NpcBehavior, Attributes } from "@realms/lexicons";

/** The behavioral state an NPC is currently in. */
export type NpcState = "idle" | "wandering" | "conversing" | "combat" | "fleeing" | "dead";

/** Live runtime instance of an NPC, derived from a definition and tracking current HP and position. */
export interface NpcInstance {
  instanceId: string;
  definitionId: string;
  name: string;
  behavior: NpcBehavior;
  state: NpcState;
  level: number;
  currentRoom: string;
  attributes?: Attributes;
  currentHp: number;
  maxHp: number;
}

/** Generate a collision-resistant unique ID for a new NPC instance. */
export function generateNpcId(): string {
  return `npc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Instantiate an NPC from its definition with the given max HP and starting room. */
export function createNpcInstance(
  definitionId: string,
  definition: NpcDefinition,
  roomId: string,
  maxHp: number,
): NpcInstance {
  return {
    instanceId: generateNpcId(),
    definitionId,
    name: definition.name,
    behavior: definition.behavior,
    state: "idle",
    level: definition.level ?? 1,
    currentRoom: roomId,
    attributes: definition.attributes ? { ...definition.attributes } : undefined,
    currentHp: maxHp,
    maxHp,
  };
}
