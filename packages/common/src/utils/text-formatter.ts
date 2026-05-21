/**
 * ANSI terminal formatting helpers for MUD-style text output.
 * All functions wrap text in escape codes and reset at the end.
 */
// ANSI color codes for terminal output
const ANSI = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  italic: "\x1b[3m",
  underline: "\x1b[4m",

  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",

  bgBlack: "\x1b[40m",
  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m",
  bgYellow: "\x1b[43m",
  bgBlue: "\x1b[44m",
} as const;

/** Wrap text in bold. */
export function bold(text: string): string {
  return `${ANSI.bold}${text}${ANSI.reset}`;
}

/** Wrap text in dim/faint style. */
export function dim(text: string): string {
  return `${ANSI.dim}${text}${ANSI.reset}`;
}

/** Wrap text in any named ANSI color. */
export function color(text: string, c: keyof typeof ANSI): string {
  return `${ANSI[c]}${text}${ANSI.reset}`;
}

/** Format a room title (bold cyan). */
export function roomTitle(title: string): string {
  return `${ANSI.bold}${ANSI.cyan}${title}${ANSI.reset}`;
}

/** Format a list of exit directions as `[Exits: ...]`. */
export function exitList(directions: string[]): string {
  const exits = directions.map((d) => `${ANSI.yellow}${d}${ANSI.reset}`);
  return `[Exits: ${exits.join(", ")}]`;
}

/** Format narrative/description text (white). */
export function narrative(text: string): string {
  return `${ANSI.white}${text}${ANSI.reset}`;
}

/** Format an error message (red). */
export function error(text: string): string {
  return `${ANSI.red}${text}${ANSI.reset}`;
}

/** Format a system/server message (dim cyan). */
export function system(text: string): string {
  return `${ANSI.dim}${ANSI.cyan}${text}${ANSI.reset}`;
}

/** Format a player's name (bold green). */
export function playerName(name: string): string {
  return `${ANSI.bold}${ANSI.green}${name}${ANSI.reset}`;
}

/** Format an NPC's name (bold yellow). */
export function npcName(name: string): string {
  return `${ANSI.bold}${ANSI.yellow}${name}${ANSI.reset}`;
}

/** Strip all ANSI escape codes from a string. */
export function stripAnsi(text: string): string {
  // eslint-disable-next-line no-control-regex
  return text.replace(/\x1b\[[0-9;]*m/g, "");
}
