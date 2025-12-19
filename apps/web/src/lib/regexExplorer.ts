export type RegexCompileResult =
  | { ok: true; regex: RegExp; normalizedFlags: string }
  | { ok: false; error: string };

export type RegexGroupMatch = {
  index: number;
  text: string;
};

export type RegexMatch = {
  index: number;
  match: string;
  groups: RegexGroupMatch[];
  namedGroups: Record<string, string>;
};

export type RegexMeta = {
  capturingGroups: number;
  namedGroups: string[];
};

const SUPPORTED_FLAGS = new Set(["g", "i", "m", "s", "u", "y", "d"]);

export function normalizeRegexFlags(flags: string) {
  const out: string[] = [];
  for (const ch of flags) {
    if (!SUPPORTED_FLAGS.has(ch)) continue;
    if (out.includes(ch)) continue;
    out.push(ch);
  }
  return out.join("");
}

export function compileRegex(pattern: string, flags: string): RegexCompileResult {
  const normalizedFlags = normalizeRegexFlags(flags);
  try {
    const regex = new RegExp(pattern, normalizedFlags);
    return { ok: true, regex, normalizedFlags };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: msg };
  }
}

function withGlobalFlag(regex: RegExp) {
  if (regex.global) return regex;
  const flags = regex.flags.includes("g") ? regex.flags : `${regex.flags}g`;
  return new RegExp(regex.source, flags);
}

export function findRegexMatches(regex: RegExp, input: string, maxMatches = 200): RegexMatch[] {
  const r = withGlobalFlag(regex);
  const matches: RegexMatch[] = [];

  for (const m of input.matchAll(r)) {
    const full = m[0] ?? "";
    const index = m.index ?? -1;
    const groups: RegexGroupMatch[] = [];

    for (let i = 1; i < m.length; i++) {
      groups.push({ index: i, text: m[i] ?? "" });
    }

    matches.push({
      index,
      match: full,
      groups,
      namedGroups: (m.groups ?? {}) as Record<string, string>
    });

    if (matches.length >= maxMatches) break;
  }

  return matches;
}

export function analyzeRegexMeta(pattern: string): RegexMeta {
  let capturingGroups = 0;
  const namedGroups: string[] = [];

  let inClass = false;
  for (let i = 0; i < pattern.length; i++) {
    const ch = pattern[i] ?? "";

    if (ch === "\\") {
      i += 1;
      continue;
    }

    if (ch === "[" && !inClass) {
      inClass = true;
      continue;
    }

    if (ch === "]" && inClass) {
      inClass = false;
      continue;
    }

    if (inClass) continue;

    if (ch !== "(") continue;

    const next = pattern[i + 1] ?? "";
    if (next !== "?") {
      capturingGroups += 1;
      continue;
    }

    const next2 = pattern[i + 2] ?? "";
    if (next2 === ":") continue;
    if (next2 === "=") continue;
    if (next2 === "!") continue;

    if (next2 === "<") {
      const next3 = pattern[i + 3] ?? "";
      if (next3 === "=" || next3 === "!") continue;

      let j = i + 3;
      let name = "";
      while (j < pattern.length) {
        const cj = pattern[j] ?? "";
        if (cj === ">") break;
        name += cj;
        j++;
      }

      if (name) namedGroups.push(name);
      capturingGroups += 1;
      continue;
    }
  }

  return { capturingGroups, namedGroups: Array.from(new Set(namedGroups)) };
}

