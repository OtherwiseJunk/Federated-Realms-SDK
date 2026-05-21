import { describe, expect, test } from "bun:test";
import { parseCommand } from "./command-parser.js";

describe("parseCommand", () => {
  test("parses simple verb", () => {
    const cmd = parseCommand("look");
    expect(cmd.verb).toBe("look");
    expect(cmd.args).toEqual([]);
    expect(cmd.target).toBeUndefined();
  });

  test("parses verb with single arg", () => {
    const cmd = parseCommand("look sword");
    expect(cmd.verb).toBe("look");
    expect(cmd.args).toEqual(["sword"]);
    expect(cmd.target).toBe("sword");
  });

  test("parses verb with multiple args", () => {
    const cmd = parseCommand("whisper alice hello there");
    expect(cmd.verb).toBe("whisper");
    expect(cmd.args).toEqual(["alice", "hello", "there"]);
    expect(cmd.target).toBe("alice hello there");
  });

  test("handles empty input", () => {
    const cmd = parseCommand("");
    expect(cmd.verb).toBe("");
    expect(cmd.args).toEqual([]);
  });

  test("handles whitespace-only input", () => {
    const cmd = parseCommand("   ");
    expect(cmd.verb).toBe("");
    expect(cmd.args).toEqual([]);
  });

  test("trims whitespace", () => {
    const cmd = parseCommand("  look  sword  ");
    expect(cmd.verb).toBe("look");
    expect(cmd.args).toEqual(["sword"]);
  });

  test("converts verb to lowercase", () => {
    const cmd = parseCommand("LOOK");
    expect(cmd.verb).toBe("look");
  });

  describe("direction shortcuts", () => {
    test("n -> go north", () => {
      const cmd = parseCommand("n");
      expect(cmd.verb).toBe("go");
      expect(cmd.args).toEqual(["north"]);
    });

    test("s -> go south", () => {
      const cmd = parseCommand("s");
      expect(cmd.verb).toBe("go");
      expect(cmd.args).toEqual(["south"]);
    });

    test("e -> go east", () => {
      const cmd = parseCommand("e");
      expect(cmd.verb).toBe("go");
      expect(cmd.args).toEqual(["east"]);
    });

    test("w -> go west", () => {
      const cmd = parseCommand("w");
      expect(cmd.verb).toBe("go");
      expect(cmd.args).toEqual(["west"]);
    });

    test("u -> go up", () => {
      const cmd = parseCommand("u");
      expect(cmd.verb).toBe("go");
      expect(cmd.args).toEqual(["up"]);
    });

    test("d -> go down", () => {
      const cmd = parseCommand("d");
      expect(cmd.verb).toBe("go");
      expect(cmd.args).toEqual(["down"]);
    });

    test("ne -> go northeast", () => {
      const cmd = parseCommand("ne");
      expect(cmd.verb).toBe("go");
      expect(cmd.args).toEqual(["northeast"]);
    });

    test("north -> go north", () => {
      const cmd = parseCommand("north");
      expect(cmd.verb).toBe("go");
      expect(cmd.args).toEqual(["north"]);
    });

    test("go north -> go north", () => {
      const cmd = parseCommand("go north");
      expect(cmd.verb).toBe("go");
      expect(cmd.args).toEqual(["north"]);
    });

    test("go n -> resolves to go north", () => {
      const cmd = parseCommand("go n");
      expect(cmd.verb).toBe("go");
      expect(cmd.args).toEqual(["north"]);
    });
  });
});
