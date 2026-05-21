import type { Direction } from "@realms/lexicons";

/** Maps shorthand and full direction strings to canonical Direction values. */
export const DIRECTION_ALIASES: Record<string, Direction> = {
  n: "north",
  s: "south",
  e: "east",
  w: "west",
  u: "up",
  d: "down",
  ne: "northeast",
  nw: "northwest",
  se: "southeast",
  sw: "southwest",
  north: "north",
  south: "south",
  east: "east",
  west: "west",
  up: "up",
  down: "down",
  northeast: "northeast",
  northwest: "northwest",
  southeast: "southeast",
  southwest: "southwest",
};

/** Maps each Direction to its opposite, used for two-way exit linking. */
export const OPPOSITE_DIRECTION: Record<Direction, Direction> = {
  north: "south",
  south: "north",
  east: "west",
  west: "east",
  up: "down",
  down: "up",
  northeast: "southwest",
  northwest: "southeast",
  southeast: "northwest",
  southwest: "northeast",
};

/** Resolve a direction string (shorthand or full) to a canonical Direction, or undefined if unrecognized. */
export function resolveDirection(input: string): Direction | undefined {
  return DIRECTION_ALIASES[input.toLowerCase()];
}

/** Type guard — returns true if the string is a valid canonical Direction. */
export function isDirection(input: string): input is Direction {
  return resolveDirection(input) !== undefined;
}
