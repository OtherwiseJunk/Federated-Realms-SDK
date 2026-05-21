import type { RoomRecord, Direction, RoomExit } from "@realms/lexicons";

/** An interactable feature within a room (e.g. a lever, shrine, or notice board). */
export interface RoomFeature {
  name: string;
  keywords: string[];
  description: string;
}

/** Live runtime state of a room, including its current occupants and items. */
export interface RoomState {
  id: string;
  title: string;
  description: string;
  area: string;
  coordinates: { x: number; y: number; z: number };
  exits: RoomExit[];
  flags: string[];
  players: EntityBrief[];
  npcs: EntityBrief[];
  items: ItemBrief[];
  features?: RoomFeature[];
}

/** Minimal entity reference used in room state (avoids circular deps with full session types). */
export interface EntityBrief {
  id: string;
  name: string;
  type: "player" | "npc";
}

/** Minimal item reference used in room state. */
export interface ItemBrief {
  id: string;
  name: string;
  quantity: number;
}

/** Convert a persisted RoomRecord (from AT Proto) into live RoomState with empty occupant lists. */
export function roomRecordToState(id: string, record: RoomRecord): RoomState {
  return {
    id,
    title: record.title,
    description: record.description,
    area: record.area,
    coordinates: record.coordinates,
    exits: record.exits ?? [],
    flags: record.flags ?? [],
    players: [],
    npcs: [],
    items: [],
  };
}

/** Find the exit in a given direction, or undefined if none exists. */
export function findExit(room: RoomState, direction: Direction): RoomExit | undefined {
  return room.exits.find((e) => e.direction === direction);
}

/** Check whether a room has a specific flag (e.g. 'safe', 'shop', 'pvp'). */
export function hasFlag(room: RoomState, flag: string): boolean {
  return room.flags.includes(flag);
}
