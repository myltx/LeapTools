export type SqlFormatMode = "format" | "minify";

export type SqlFormatOptions = {
  mode: SqlFormatMode;
  indentSize: 2 | 4;
  uppercaseKeywords: boolean;
  breakAfterComma: boolean;
  newlineBeforeAndOr: boolean;
  stripComments: boolean;
};

type SqlTokenType = "word" | "string" | "comment" | "punct" | "operator" | "whitespace" | "other";

type SqlToken = {
  type: SqlTokenType;
  value: string;
};

const KEYWORD_PHRASES = [
  "LEFT OUTER JOIN",
  "RIGHT OUTER JOIN",
  "FULL OUTER JOIN",
  "CROSS JOIN",
  "LEFT JOIN",
  "RIGHT JOIN",
  "FULL JOIN",
  "INNER JOIN",
  "OUTER JOIN",
  "GROUP BY",
  "ORDER BY",
  "UNION ALL",
  "INSERT INTO",
  "DELETE FROM",
  "IS NOT",
  "IS NULL",
  "IS TRUE",
  "IS FALSE"
].sort((a, b) => b.length - a.length);

const BLOCK_KEYWORDS = new Set([
  "SELECT",
  "FROM",
  "WHERE",
  "GROUP BY",
  "HAVING",
  "ORDER BY",
  "LIMIT",
  "OFFSET",
  "VALUES",
  "SET",
  "INSERT INTO",
  "UPDATE",
  "DELETE FROM"
]);

const LINE_KEYWORDS = new Set([
  "JOIN",
  "LEFT JOIN",
  "RIGHT JOIN",
  "FULL JOIN",
  "INNER JOIN",
  "OUTER JOIN",
  "LEFT OUTER JOIN",
  "RIGHT OUTER JOIN",
  "FULL OUTER JOIN",
  "CROSS JOIN",
  "ON",
  "UNION",
  "UNION ALL"
]);

const LOGIC_KEYWORDS = new Set(["AND", "OR"]);

const SINGLE_KEYWORDS = new Set(
  [
    ...BLOCK_KEYWORDS,
    ...LINE_KEYWORDS,
    ...LOGIC_KEYWORDS,
    "AS",
    "IN",
    "NOT",
    "DISTINCT",
    "CASE",
    "WHEN",
    "THEN",
    "ELSE",
    "END",
    "NULL",
    "TRUE",
    "FALSE",
    "EXISTS",
    "LIKE",
    "ILIKE",
    "BETWEEN",
    "DESC",
    "ASC"
  ].map((k) => k.toUpperCase()),
);

function isIdentifierChar(ch: string) {
  return /[A-Za-z0-9_$]/.test(ch);
}

function tokenizeSql(input: string): SqlToken[] {
  const tokens: SqlToken[] = [];
  let i = 0;

  const push = (type: SqlTokenType, value: string) => tokens.push({ type, value });

  while (i < input.length) {
    const ch = input[i] ?? "";
    const next = input[i + 1] ?? "";

    if (/\s/.test(ch)) {
      let j = i + 1;
      while (j < input.length && /\s/.test(input[j] ?? "")) j++;
      push("whitespace", input.slice(i, j));
      i = j;
      continue;
    }

    if (ch === "-" && next === "-") {
      let j = i + 2;
      while (j < input.length && (input[j] ?? "") !== "\n") j++;
      push("comment", input.slice(i, j));
      i = j;
      continue;
    }

    if (ch === "/" && next === "*") {
      let j = i + 2;
      while (j < input.length) {
        if ((input[j] ?? "") === "*" && (input[j + 1] ?? "") === "/") {
          j += 2;
          break;
        }
        j++;
      }
      push("comment", input.slice(i, j));
      i = j;
      continue;
    }

    if (ch === "'") {
      let j = i + 1;
      while (j < input.length) {
        const cj = input[j] ?? "";
        if (cj === "'") {
          if ((input[j + 1] ?? "") === "'") {
            j += 2;
            continue;
          }
          j++;
          break;
        }
        j++;
      }
      push("string", input.slice(i, j));
      i = j;
      continue;
    }

    if (ch === '"' || ch === "`") {
      const quote = ch;
      let j = i + 1;
      while (j < input.length) {
        const cj = input[j] ?? "";
        if (cj === quote) {
          j++;
          break;
        }
        j++;
      }
      push("string", input.slice(i, j));
      i = j;
      continue;
    }

    if (isIdentifierChar(ch)) {
      let j = i + 1;
      while (j < input.length && isIdentifierChar(input[j] ?? "")) j++;
      push("word", input.slice(i, j));
      i = j;
      continue;
    }

    const two = ch + next;
    if (["<>", "<=", ">=", "==", "!=", "||", "&&"].includes(two)) {
      push("operator", two);
      i += 2;
      continue;
    }

    if (",;().".includes(ch)) {
      push("punct", ch);
      i += 1;
      continue;
    }

    if ("=<>+-*/%".includes(ch)) {
      push("operator", ch);
      i += 1;
      continue;
    }

    push("other", ch);
    i += 1;
  }

  return tokens;
}

function toUpperIfNeeded(text: string, uppercaseKeywords: boolean) {
  return uppercaseKeywords ? text.toUpperCase() : text;
}

function readKeywordPhrase(tokens: SqlToken[], startIndex: number) {
  const maxWords = 4;
  const words: string[] = [];
  for (let i = 0; i < maxWords; i++) {
    const t = tokens[startIndex + i];
    if (!t || t.type !== "word") break;
    words.push(t.value.toUpperCase());
  }

  for (const phrase of KEYWORD_PHRASES) {
    const parts = phrase.split(" ");
    if (parts.length > words.length) continue;
    let ok = true;
    for (let k = 0; k < parts.length; k++) {
      if ((words[k] ?? "") !== (parts[k] ?? "")) {
        ok = false;
        break;
      }
    }
    if (ok) return { phrase, wordCount: parts.length };
  }

  const first = words[0];
  if (!first) return null;
  if (!SINGLE_KEYWORDS.has(first)) return null;
  return { phrase: first, wordCount: 1 };
}

function needsSpaceBetween(prev: SqlToken | null, next: SqlToken) {
  if (!prev) return false;
  if (prev.type === "punct" && prev.value === "(") return false;
  if (next.type === "punct" && [")", ",", ";", "."].includes(next.value)) return false;
  if (prev.type === "punct" && prev.value === ".") return false;
  if (next.type === "punct" && next.value === ".") return false;
  if (prev.type === "operator" || next.type === "operator") return true;

  const wordLike = (t: SqlToken) => t.type === "word" || t.type === "string" || t.type === "other";
  return wordLike(prev) && wordLike(next);
}

function minifySql(tokens: SqlToken[], stripComments: boolean) {
  const out: string[] = [];
  let prev: SqlToken | null = null;

  for (const t of tokens) {
    if (t.type === "whitespace") continue;
    if (t.type === "comment" && stripComments) continue;

    if (needsSpaceBetween(prev, t)) out.push(" ");
    out.push(t.value);
    prev = t;
  }

  return out.join("").trim();
}

function formatSql(tokens: SqlToken[], options: SqlFormatOptions) {
  const indentUnit = " ".repeat(options.indentSize);
  const out: string[] = [];

  let indent = 0;
  let clauseIndentAdded = 0;
  let lineStart = true;
  let prev: SqlToken | null = null;

  const writeIndentIfNeeded = () => {
    if (!lineStart) return;
    out.push(indentUnit.repeat(Math.max(0, indent)));
    lineStart = false;
  };

  const write = (text: string) => {
    writeIndentIfNeeded();
    out.push(text);
  };

  const space = () => {
    if (lineStart) return;
    const last = out[out.length - 1] ?? "";
    if (!last || last.endsWith(" ") || last.endsWith("\n")) return;
    out.push(" ");
  };

  const newline = () => {
    if (!lineStart) out.push("\n");
    lineStart = true;
    prev = null;
  };

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]!;
    if (t.type === "whitespace") continue;
    if (t.type === "comment") {
      if (options.stripComments) continue;
      if (!lineStart) newline();
      write(t.value.trimEnd());
      newline();
      continue;
    }

    if (t.type === "word") {
      const phraseInfo = readKeywordPhrase(tokens, i);
      if (phraseInfo) {
        const rawPhraseWords: string[] = [];
        for (let k = 0; k < phraseInfo.wordCount; k++) {
          const w = tokens[i + k]?.value ?? "";
          rawPhraseWords.push(toUpperIfNeeded(w, options.uppercaseKeywords));
        }
        const phrase = rawPhraseWords.join(" ");
        const phraseUpper = phraseInfo.phrase;

        if (clauseIndentAdded > 0 && BLOCK_KEYWORDS.has(phraseUpper)) {
          indent = Math.max(0, indent - clauseIndentAdded);
          clauseIndentAdded = 0;
        }

        if (BLOCK_KEYWORDS.has(phraseUpper)) {
          if (!lineStart) newline();
          write(phrase);
          newline();
          indent += 1;
          clauseIndentAdded = 1;
          i += phraseInfo.wordCount - 1;
          continue;
        }

        if (LINE_KEYWORDS.has(phraseUpper)) {
          if (!lineStart) newline();
          write(phrase);
          space();
          prev = { type: "word", value: phrase };
          i += phraseInfo.wordCount - 1;
          continue;
        }

        if (options.newlineBeforeAndOr && LOGIC_KEYWORDS.has(phraseUpper)) {
          if (!lineStart) newline();
          write(phrase);
          space();
          prev = { type: "word", value: phrase };
          i += phraseInfo.wordCount - 1;
          continue;
        }

        if (needsSpaceBetween(prev, { type: "word", value: phrase })) space();
        write(phrase);
        prev = { type: "word", value: phrase };
        i += phraseInfo.wordCount - 1;
        continue;
      }
    }

    if (t.type === "punct") {
      if (t.value === ",") {
        write(",");
        prev = t;
        if (options.breakAfterComma) newline();
        else space();
        continue;
      }

      if (t.value === ";") {
        write(";");
        prev = t;
        newline();
        continue;
      }

      if (t.value === "(") {
        if (needsSpaceBetween(prev, t)) space();
        write("(");
        indent += 1;
        prev = t;
        continue;
      }

      if (t.value === ")") {
        const wasLineStart = lineStart;
        if (wasLineStart) indent = Math.max(0, indent - 1);
        write(")");
        if (!wasLineStart) indent = Math.max(0, indent - 1);
        prev = t;
        continue;
      }

      if (t.value === ".") {
        write(".");
        prev = t;
        continue;
      }
    }

    if (t.type === "operator") {
      if (!lineStart) space();
      write(t.value);
      space();
      prev = t;
      continue;
    }

    if (needsSpaceBetween(prev, t)) space();
    write(t.value);
    prev = t;
  }

  return out.join("").replace(/[ \t]+\n/g, "\n").trim();
}

export function runSqlFormatter(input: string, options: SqlFormatOptions) {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const tokens = tokenizeSql(trimmed);
  if (options.mode === "minify") return minifySql(tokens, options.stripComments);
  return formatSql(tokens, options);
}
