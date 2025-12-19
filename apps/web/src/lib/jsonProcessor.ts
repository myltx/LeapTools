export type JsonProcessorOptions = {
  indent: number;
  sortKeys: boolean;
  escapeUnicode: boolean;
};

function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj).sort((a, b) => a.localeCompare(b));
    const next: Record<string, unknown> = {};
    for (const k of keys) next[k] = sortKeysDeep(obj[k]);
    return next;
  }
  return value;
}

function escapeUnicodeJson(text: string) {
  return text.replace(/[\u007F-\uFFFF]/g, (c) => {
    return `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`;
  });
}

export function runJsonProcessor(input: string, options: JsonProcessorOptions) {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const parsed = JSON.parse(trimmed) as unknown;
  const processed = options.sortKeys ? sortKeysDeep(parsed) : parsed;

  const space = options.indent === 0 ? 0 : options.indent;
  const json = JSON.stringify(processed, null, space);

  return options.escapeUnicode ? escapeUnicodeJson(json) : json;
}

