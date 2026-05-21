import { resolveDirection } from "../utils/direction.js";

/** Normalized result of parsing a raw player input string. */
export interface ParsedCommand {
  verb: string;
  args: string[];
  target?: string;
  raw: string;
}

// Direction shortcuts that map to "go <direction>"
const DIRECTION_VERBS = new Set([
  "n",
  "s",
  "e",
  "w",
  "u",
  "d",
  "ne",
  "nw",
  "se",
  "sw",
  "north",
  "south",
  "east",
  "west",
  "up",
  "down",
  "northeast",
  "northwest",
  "southeast",
  "southwest",
]);

/**
 * Parse a raw input string into a normalized command. Direction shortcuts (n/s/e/w etc.) are
 * resolved automatically. Pass an `aliases` map to expand game-specific shorthand
 * (e.g. `{ k: 'kill', i: 'inventory' }`) before returning.
 */
// We parse the command into a standard structure, but we don't enforce strict verb/arg patterns here.
// The game logic will interpret the verb and args as needed, allowing servers to define their own
// command sets and parsing rules on top of this basic structure.
export function parseCommand(
  input: string,
  aliases: Record<string, string> = {},
): ParsedCommand {
  const raw = input.trim();
  if (!raw) {
    return { verb: "", args: [], raw };
  }

  const parts = raw.split(/\s+/);
  let verb = parts[0].toLowerCase();
  const args = parts.slice(1);

  // Handle direction shortcuts: "n" -> "go north"
  if (DIRECTION_VERBS.has(verb)) {
    const dir = resolveDirection(verb);
    if (dir) {
      return { verb: "go", args: [dir], target: dir, raw };
    }
  }

  // Handle "go <direction>"
  if (verb === "go" && args.length > 0) {
    const dir = resolveDirection(args[0]);
    if (dir) {
      return { verb: "go", args: [dir], target: dir, raw };
    }
  }

  // Apply caller-supplied aliases
  if (verb in aliases) {
    verb = aliases[verb];
  }

  const target = args.length > 0 ? args.join(" ") : undefined;
  return { verb, args, target, raw };
}
