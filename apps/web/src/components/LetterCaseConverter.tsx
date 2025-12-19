"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Accordion, Button, Checkbox, Select, Textarea } from "@/ui";

/**
 * 转换类型（与需求里的 key 保持一致，方便后续接入配置/埋点/快捷键等）。
 */
export type LetterCaseOperation =
  | "upper_case"
  | "lower_case"
  | "word_case"
  | "word_lower_case"
  | "sentence_case"
  | "title_case"
  | "space_to_underscore"
  | "underscore_to_space"
  | "space_to_camel"
  | "camel_to_space"
  | "space_to_kebab"
  | "kebab_to_space"
  | "space_to_newline"
  | "newline_to_space"
  | "space_to_dot"
  | "dot_to_space"
  | "del_punctuation"
  | "del_blank"
  | "del_linebreak";

export type LetterCaseConverterStats = {
  chars: number;
  charsNoWhitespace: number;
  words: number;
  lines: number;
};

export type LetterCaseConverterProps = {
  defaultOperation?: LetterCaseOperation;
  defaultShowNewTextarea?: boolean;
  defaultAutoCopy?: boolean;
  defaultDictionaryText?: string;
};

const WORD_TOKEN = /[A-Za-z0-9]+(?:'[A-Za-z0-9]+)*/g;

type OperationHelp = {
  title: string;
  description: string;
  sampleInput: string;
};

const OPERATION_HELP: Record<LetterCaseOperation, OperationHelp> = {
  upper_case: {
    title: "全部大写",
    description: "将所有英文字母转换为大写，其它字符保持不变。",
    sampleInput: "Hello, OpenAI!"
  },
  lower_case: {
    title: "全部小写",
    description: "将所有英文字母转换为小写，其它字符保持不变。",
    sampleInput: "Hello, OpenAI!"
  },
  word_case: {
    title: "每个单词首字母大写",
    description: "按单词粒度处理首字母大写；可配合自定义词库输出规范写法（如 iPhone、OpenAI、API）。",
    sampleInput: "openai iphone api hello world"
  },
  word_lower_case: {
    title: "每个单词首字母小写",
    description: "按单词粒度处理首字母小写（只改首字母）。",
    sampleInput: "Hello World From OpenAI"
  },
  sentence_case: {
    title: "句子首字母大写",
    description: "将每个句子的首个字母大写；句末标点（.?!）或换行会被视为新句开始；可配合词库。",
    sampleInput: "hello world. welcome to openai!\nthis is a tool."
  },
  title_case: {
    title: "标题大小写",
    description: "按英文标题规则处理：常见介词/冠词等保持小写（除非在开头/结尾）；可配合词库。",
    sampleInput: "an introduction to openai api in next.js"
  },
  space_to_underscore: {
    title: "空格 → 下划线",
    description: "将连续空白归一为单空格后，再用下划线连接（适合 snake_case 片段）。",
    sampleInput: "hello   world  from  openai"
  },
  underscore_to_space: {
    title: "下划线 → 空格",
    description: "将下划线分隔转换为以空格分隔，并归一化空白。",
    sampleInput: "hello_world__from_openai"
  },
  space_to_camel: {
    title: "空格 → 驼峰（camelCase）",
    description: "按空格/下划线/中横线/小数点分词后转为 camelCase。",
    sampleInput: "hello world from openai"
  },
  camel_to_space: {
    title: "驼峰 → 空格",
    description: "将 camelCase/PascalCase 拆分为以空格分隔的单词。",
    sampleInput: "helloWorldFromOpenAI"
  },
  space_to_kebab: {
    title: "空格 → 中横线（kebab-case）",
    description: "将连续空白归一为单空格后，再用中横线连接（适合 URL/文件名风格）。",
    sampleInput: "hello   world  from  openai"
  },
  kebab_to_space: {
    title: "中横线 → 空格",
    description: "将中横线分隔转换为以空格分隔，并归一化空白。",
    sampleInput: "hello-world--from-openai"
  },
  space_to_newline: {
    title: "空格 → 换行",
    description: "将连续空白归一为单空格后，按单词逐行输出。",
    sampleInput: "hello   world  from  openai"
  },
  newline_to_space: {
    title: "换行 → 空格",
    description: "将换行转换为空格，并归一化空白。",
    sampleInput: "hello\nworld\r\nfrom\nopenai"
  },
  space_to_dot: {
    title: "空格 → 小数点（.）",
    description: "将连续空白归一为单空格后，再用小数点连接（适合命名空间/路径片段）。",
    sampleInput: "hello world from openai"
  },
  dot_to_space: {
    title: "小数点 → 空格",
    description: "将小数点分隔转换为以空格分隔，并归一化空白。",
    sampleInput: "hello.world..from.openai"
  },
  del_punctuation: {
    title: "删除标点/符号",
    description: "删除标点与符号（尽量使用 Unicode 标点/符号范围；不支持时回退到常见 ASCII 标点）。",
    sampleInput: "Hello, OpenAI! (API v2.0) #tools"
  },
  del_blank: {
    title: "删除所有空白",
    description: "删除空格/制表/换行等所有空白字符。",
    sampleInput: "hello   world\nfrom\topenai"
  },
  del_linebreak: {
    title: "删除换行",
    description: "删除所有换行符（保留其它空格/制表）。",
    sampleInput: "hello\nworld\r\nfrom\nopenai"
  }
};

const TITLE_CASE_MINOR_WORDS = new Set(
  [
    "a",
    "an",
    "the",
    "and",
    "but",
    "or",
    "nor",
    "for",
    "so",
    "yet",
    "as",
    "at",
    "by",
    "in",
    "of",
    "on",
    "per",
    "to",
    "up",
    "via",
    "vs",
    "with",
    "from",
    "into",
    "over",
    "than",
    "onto"
  ].map((w) => w.toLowerCase()),
);

/**
 * 将自定义词库解析为「规范写法」数组：
 * - 支持换行 / 逗号 / 分号分隔
 * - 会去重（忽略大小写），并保留用户输入的规范大小写（例如 iPhone / OpenAI / API）
 */
export function parseCustomDictionary(input: string): string[] {
  const raw = input
    .split(/[\n,;]+/g)
    .map((s) => s.trim())
    .filter(Boolean);

  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of raw) {
    const key = item.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

export function buildDictionaryMap(words: string[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const w of words) map.set(w.toLowerCase(), w);
  return map;
}

export function getTextStats(text: string): LetterCaseConverterStats {
  const chars = text.length;
  const charsNoWhitespace = text.replace(/\s/g, "").length;
  const words = (text.match(WORD_TOKEN) ?? []).length;
  const lines = text.length ? text.split(/\r?\n/).length : 0;
  return { chars, charsNoWhitespace, words, lines };
}

function capitalizeWord(word: string) {
  if (!word) return word;
  const lower = word.toLowerCase();
  return lower.slice(0, 1).toUpperCase() + lower.slice(1);
}

function decapitalizeWord(word: string) {
  if (!word) return word;
  return word.slice(0, 1).toLowerCase() + word.slice(1);
}

function sentenceCase(text: string) {
  let capitalizeNext = true;
  let out = "";

  for (let i = 0; i < text.length; i++) {
    const ch = text[i] ?? "";

    if (/[A-Za-z]/.test(ch)) {
      if (capitalizeNext) {
        out += ch.toUpperCase();
        capitalizeNext = false;
      } else {
        out += ch.toLowerCase();
      }
      continue;
    }

    out += ch;

    // 句子边界：英文句末标点 & 换行（更符合工具的直觉预期）
    if (ch === "\n" || ch === "!" || ch === "?" || ch === ".") {
      capitalizeNext = true;
    }
  }

  return out;
}

function titleCase(text: string) {
  const matches = text.match(WORD_TOKEN) ?? [];
  const total = matches.length;
  let wordIndex = 0;

  return text.replace(WORD_TOKEN, (word) => {
    const lower = word.toLowerCase();
    const isFirst = wordIndex === 0;
    const isLast = wordIndex === total - 1;
    wordIndex++;

    if (!isFirst && !isLast && TITLE_CASE_MINOR_WORDS.has(lower)) {
      return lower;
    }

    return capitalizeWord(lower);
  });
}

function applyDictionary(text: string, dict: Map<string, string>) {
  if (dict.size === 0) return text;
  return text.replace(WORD_TOKEN, (word) => dict.get(word.toLowerCase()) ?? word);
}

function spaceToDelimiter(text: string, delimiter: string) {
  return text
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .filter(Boolean)
    .join(delimiter);
}

function delimiterToSpace(text: string, delimiter: RegExp) {
  return text
    .replace(delimiter, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toCamelCase(text: string) {
  const words = text
    .trim()
    .split(/[\s_.-]+/g)
    .map((w) => w.trim())
    .filter(Boolean);

  if (words.length === 0) return "";

  const first = words[0]!.toLowerCase();
  const rest = words.slice(1).map((w) => capitalizeWord(w));
  return [first, ...rest].join("");
}

function fromCamelCase(text: string) {
  return text
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_.\\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function deleteLinebreak(text: string) {
  return text.replace(/\r?\n+/g, "");
}

function deleteBlank(text: string) {
  return text.replace(/\s+/g, "");
}

function deletePunctuation(text: string) {
  // 优先用 Unicode property escapes；若运行环境不支持，再回退到常见 ASCII 标点。
  try {
    return text.replace(/[\p{P}\p{S}]/gu, "");
  } catch {
    return text.replace(/[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/g, "");
  }
}

/**
 * 核心转换函数：纯函数，可复用（例如后续抽到 packages/utils）。
 */
export function convertText(params: {
  text: string;
  operation: LetterCaseOperation;
  dictionaryMap?: Map<string, string>;
}): string {
  const { text, operation, dictionaryMap } = params;
  const dict = dictionaryMap ?? new Map<string, string>();

  switch (operation) {
    // 大小写转换
    case "upper_case":
      return text.toUpperCase();
    case "lower_case":
      return text.toLowerCase();
    case "word_case": {
      const out = text.replace(WORD_TOKEN, (w) => capitalizeWord(w));
      return applyDictionary(out, dict);
    }
    case "word_lower_case":
      return text.replace(WORD_TOKEN, (w) => decapitalizeWord(w));
    case "sentence_case": {
      const out = sentenceCase(text);
      return applyDictionary(out, dict);
    }
    case "title_case": {
      const out = titleCase(text);
      return applyDictionary(out, dict);
    }

    // 文本格式转换（空格 ↔ 下划线/驼峰/中横线/换行/小数点）
    case "space_to_underscore":
      return spaceToDelimiter(text, "_");
    case "underscore_to_space":
      return delimiterToSpace(text, /_+/g);
    case "space_to_kebab":
      return spaceToDelimiter(text, "-");
    case "kebab_to_space":
      return delimiterToSpace(text, /-+/g);
    case "space_to_dot":
      return spaceToDelimiter(text, ".");
    case "dot_to_space":
      return delimiterToSpace(text, /\\.+/g);
    case "space_to_newline":
      return text
        .trim()
        .replace(/\s+/g, " ")
        .split(" ")
        .filter(Boolean)
        .join("\n");
    case "newline_to_space":
      return text.replace(/\r?\n+/g, " ").replace(/\s+/g, " ").trim();
    case "space_to_camel":
      return toCamelCase(text);
    case "camel_to_space":
      return fromCamelCase(text);

    // 清理操作
    case "del_punctuation":
      return deletePunctuation(text);
    case "del_blank":
      return deleteBlank(text);
    case "del_linebreak":
      return deleteLinebreak(text);

    default: {
      const _exhaustive: never = operation;
      return text;
    }
  }
}

async function copyToClipboard(text: string) {
  if (!text) return;
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  // 兼容非 secure context / 部分 WebView：execCommand 兜底
  const el = document.createElement("textarea");
  el.value = text;
  el.style.position = "fixed";
  el.style.left = "-9999px";
  el.setAttribute("readonly", "true");
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}

function formatStats(stats: LetterCaseConverterStats) {
  return `字符 ${stats.chars} / 去空白 ${stats.charsNoWhitespace} / 单词 ${stats.words} / 行 ${stats.lines}`;
}

/**
 * LetterCaseConverter：大小写/格式/清理一体的文本转换组件
 * - 自动根据用户输入实时转换
 * - 可选择结果输出到原文本框或新文本框（可编辑）
 * - 支持自动复制、复制/剪切/清空
 * - 支持自定义词库（影响首字母大写、句子首字母大写、标题大小写）
 */
export function LetterCaseConverter(props: LetterCaseConverterProps) {
  const [operation, setOperation] = useState<LetterCaseOperation>(props.defaultOperation ?? "upper_case");
  const [showNewTextarea, setShowNewTextarea] = useState(props.defaultShowNewTextarea ?? true);
  const [autoCopy, setAutoCopy] = useState(props.defaultAutoCopy ?? false);

  const [dictionaryText, setDictionaryText] = useState(
    props.defaultDictionaryText ??
      ["iPhone", "OpenAI", "API", "HTTP", "Next.js"].join("\n"),
  );

  const dictionaryWords = useMemo(() => parseCustomDictionary(dictionaryText), [dictionaryText]);
  const dictionaryMap = useMemo(() => buildDictionaryMap(dictionaryWords), [dictionaryWords]);

  const operationHelp = useMemo(() => OPERATION_HELP[operation], [operation]);
  const operationSample = useMemo(() => {
    const base = convertText({ text: operationHelp.sampleInput, operation, dictionaryMap: new Map() });
    const withDict = convertText({ text: operationHelp.sampleInput, operation, dictionaryMap });
    const hasDictEffect = dictionaryMap.size > 0 && base !== withDict;
    return { base, withDict, hasDictEffect };
  }, [dictionaryMap, operation, operationHelp.sampleInput]);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const pendingSelectionRef = useRef<{ start: number; end: number } | null>(null);

  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");

  // 尝试在“输出到原文本框”模式下保留光标位置（长度变化时做 clamp）
  useEffect(() => {
    const pending = pendingSelectionRef.current;
    if (!pending) return;
    pendingSelectionRef.current = null;

    const el = inputRef.current;
    if (!el) return;

    const len = el.value.length;
    el.setSelectionRange(Math.min(pending.start, len), Math.min(pending.end, len));
  }, [inputText]);

  const effectiveResultText = showNewTextarea ? outputText : inputText;

  const inputStats = useMemo(() => getTextStats(inputText), [inputText]);
  const outputStats = useMemo(() => getTextStats(effectiveResultText), [effectiveResultText]);

  const [clipboardHint, setClipboardHint] = useState<string>("");

  // 自动复制：勾选后，结果变化就写入剪贴板（做轻量防抖，避免键入时过于频繁）
  useEffect(() => {
    if (!autoCopy) return;
    if (!effectiveResultText) return;

    const timer = window.setTimeout(() => {
      copyToClipboard(effectiveResultText)
        .then(() => setClipboardHint("已自动复制到剪贴板"))
        .catch((e) => {
          const msg = e instanceof Error ? e.message : String(e);
          setClipboardHint(`自动复制失败：${msg}`);
        });
    }, 250);

    return () => window.clearTimeout(timer);
  }, [autoCopy, effectiveResultText]);

  const onCopy = useCallback(async (text: string) => {
    try {
      await copyToClipboard(text);
      setClipboardHint("已复制到剪贴板");
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setClipboardHint(`复制失败：${msg}`);
    }
  }, []);

  const onCutInput = useCallback(async () => {
    if (!inputText) return;
    await onCopy(inputText);
    setInputText("");
    if (showNewTextarea) setOutputText("");
  }, [inputText, onCopy, showNewTextarea]);

  const onClearInput = useCallback(() => {
    setInputText("");
    if (showNewTextarea) setOutputText("");
  }, [showNewTextarea]);

  const onCutResult = useCallback(async () => {
    if (!effectiveResultText) return;
    await onCopy(effectiveResultText);
    if (showNewTextarea) setOutputText("");
    else setInputText("");
  }, [effectiveResultText, onCopy, showNewTextarea]);

  const onClearResult = useCallback(() => {
    if (showNewTextarea) setOutputText("");
    else setInputText("");
  }, [showNewTextarea]);

  return (
    <>
      <div className="workspace-topbar">
        <div>
          <h2 className="workspace-title">英文字母大小写转换</h2>
          <p className="workspace-subtitle">支持大小写、格式转换、清理与一键复制</p>
        </div>

        <div className="workspace-actions">
          {/* 功能按钮：复制/剪切/清空（输入与结果各一组） */}
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              void onCopy(inputText);
            }}
            disabled={!inputText}
          >
            复制输入
          </Button>
          <Button type="button" variant="secondary" onClick={() => void onCutInput()} disabled={!inputText}>
            剪切输入
          </Button>
          <Button type="button" variant="secondary" onClick={onClearInput} disabled={!inputText}>
            清空输入
          </Button>

          <Button
            type="button"
            onClick={() => {
              void onCopy(effectiveResultText);
            }}
            disabled={!effectiveResultText}
          >
            复制结果
          </Button>
          <Button type="button" variant="secondary" onClick={() => void onCutResult()} disabled={!effectiveResultText}>
            剪切结果
          </Button>
          <Button type="button" variant="secondary" onClick={onClearResult} disabled={!effectiveResultText}>
            清空结果
          </Button>
        </div>
      </div>

      <div className="workspace-shell">
        <div className="workspace-toolbar">
          <div className="status-dot bg-success" />
          <span className="workspace-runtime">
            输入：{formatStats(inputStats)}｜结果：{formatStats(outputStats)}
          </span>
          <div className="workspace-version">{clipboardHint || "Ready"}</div>
        </div>

        <div className="workspace-content">
          <aside className="control-panel">
            <div className="control-group">
              <label>转换操作</label>
              {/* 核心交互：选择操作后，自动对输入进行转换 */}
              <Select
                value={operation}
                onChange={(value) => {
                  const nextOperation = value as LetterCaseOperation;
                  setOperation(nextOperation);

                  if (showNewTextarea) {
                    setOutputText(convertText({ text: inputText, operation: nextOperation, dictionaryMap }));
                    return;
                  }

                  const next = convertText({ text: inputText, operation: nextOperation, dictionaryMap });
                  if (next !== inputText) setInputText(next);
                }}
                options={[
                  { value: "upper_case", label: "大小写转换 · upper_case：全部大写" },
                  { value: "lower_case", label: "大小写转换 · lower_case：全部小写" },
                  { value: "word_case", label: "大小写转换 · word_case：每个单词首字母大写" },
                  { value: "word_lower_case", label: "大小写转换 · word_lower_case：每个单词首字母小写" },
                  { value: "sentence_case", label: "大小写转换 · sentence_case：句子首字母大写" },
                  { value: "title_case", label: "大小写转换 · title_case：标题大小写" },
                  { value: "space_to_underscore", label: "格式转换 · 空格 → 下划线" },
                  { value: "underscore_to_space", label: "格式转换 · 下划线 → 空格" },
                  { value: "space_to_camel", label: "格式转换 · 空格 → 驼峰 (camelCase)" },
                  { value: "camel_to_space", label: "格式转换 · 驼峰 → 空格" },
                  { value: "space_to_kebab", label: "格式转换 · 空格 → 中横线 (kebab-case)" },
                  { value: "kebab_to_space", label: "格式转换 · 中横线 → 空格" },
                  { value: "space_to_newline", label: "格式转换 · 空格 → 换行" },
                  { value: "newline_to_space", label: "格式转换 · 换行 → 空格" },
                  { value: "space_to_dot", label: "格式转换 · 空格 → 小数点 (.)" },
                  { value: "dot_to_space", label: "格式转换 · 小数点 → 空格" },
                  { value: "del_punctuation", label: "清理操作 · del_punctuation：删除标点/符号" },
                  { value: "del_blank", label: "清理操作 · del_blank：删除所有空白" },
                  { value: "del_linebreak", label: "清理操作 · del_linebreak：删除换行" }
                ]}
              />

              {/* 使用说明：针对当前操作的简要解释与示例 */}
              <div
                style={{
                  marginTop: 10,
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "1px solid var(--border-subtle)",
                  background: "rgba(255,255,255,0.7)"
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-main)" }}>
                  当前操作：{operationHelp.title}
                </div>
                <div style={{ marginTop: 6, fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  {operationHelp.description}
                </div>
                <div style={{ marginTop: 10, fontSize: 12, color: "var(--text-secondary)" }}>示例：</div>
                <pre
                  style={{
                    margin: "6px 0 0",
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: "rgba(0,0,0,0.04)",
                    border: "1px solid rgba(0,0,0,0.06)",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    fontFamily: "var(--font-mono)",
                    fontSize: 12
                  }}
                >
                  {`输入:  ${operationHelp.sampleInput}\n输出:  ${operationSample.base}${
                    operationSample.hasDictEffect ? `\n词库:  ${operationSample.withDict}` : ""
                  }`}
                </pre>
              </div>
            </div>

            <div className="control-group">
              <label>输出与复制</label>
              <div className="control-options">
                {/* 交互：结果输出到原文本框 / 新文本框 */}
                <Checkbox
                  className="control-check"
                  checked={showNewTextarea}
                  onCheckedChange={(checked) => {
                    setShowNewTextarea(checked);

                    if (checked) {
                      setOutputText(convertText({ text: inputText, operation, dictionaryMap }));
                      return;
                    }

                    const next = convertText({ text: inputText, operation, dictionaryMap });
                    if (next !== inputText) setInputText(next);
                    setOutputText("");
                  }}
                >
                  显示新文本框（结果可编辑）
                </Checkbox>

                {/* 交互：自动复制结果到剪贴板 */}
                <Checkbox className="control-check" checked={autoCopy} onCheckedChange={setAutoCopy}>
                  自动复制结果到剪贴板
                </Checkbox>
              </div>
            </div>

            <div className="control-group">
              <label>使用说明</label>
              <Accordion
                defaultExpandedKeys={["how-to"]}
                items={[
                  {
                    key: "how-to",
                    title: "如何使用",
                    content: (
                      <ol
                        style={{
                          margin: "10px 0 0",
                          paddingLeft: 18,
                          fontSize: 12,
                          color: "var(--text-secondary)"
                        }}
                      >
                        <li>在“输入”里粘贴/键入文本；转换会自动执行。</li>
                        <li>在“转换操作”选择规则（大小写 / 格式互转 / 清理）。</li>
                        <li>
                          勾选“显示新文本框”时，结果会出现在右侧/下方并且可编辑；不勾选时会直接写回输入框。
                        </li>
                        <li>勾选“自动复制结果到剪贴板”后，结果变化会自动复制（带轻量延迟，避免频繁写入）。</li>
                        <li>需要统一专有名词大小写时，在“自定义词库”里每行填一个词（如 iPhone、OpenAI、API）。</li>
                        <li>顶部按钮提供“复制/剪切/清空”输入与结果。</li>
                      </ol>
                    )
                  }
                ]}
              />
            </div>

            <div className="control-group">
              <label>自定义词库（影响 Word/Sentence/Title）</label>
              <Textarea
                value={dictionaryText}
                onChange={(e) => {
                  const nextDictionaryText = e.target.value;
                  setDictionaryText(nextDictionaryText);

                  const nextWords = parseCustomDictionary(nextDictionaryText);
                  const nextMap = buildDictionaryMap(nextWords);

                  if (showNewTextarea) {
                    setOutputText(convertText({ text: inputText, operation, dictionaryMap: nextMap }));
                    return;
                  }

                  const next = convertText({ text: inputText, operation, dictionaryMap: nextMap });
                  if (next !== inputText) setInputText(next);
                }}
                placeholder={"每行一个词（保持你希望的规范大小写）\n例如：iPhone / OpenAI / API"}
                minRows={6}
                inputClassName="dictionary-input"
              />
              <div style={{ marginTop: 8, fontSize: 12, color: "var(--text-secondary)" }}>
                已解析 {dictionaryWords.length} 个词条（大小写不敏感匹配）
              </div>
            </div>
          </aside>

          <div className="editor-split">
            <div className="editor-container">
              <div className="editor-header">
                {showNewTextarea ? "输入 (INPUT)" : "输入/输出 (SAME TEXTAREA)"}
              </div>
              <Textarea
                ref={inputRef}
                className="editor-textarea"
                inputClassName="editor-input"
                inputWrapperClassName="editor-textarea-wrapper"
                placeholder="输入英文文本，转换将自动执行..."
                value={inputText}
                onChange={(e) => {
                  const next = e.target.value;

                  if (!showNewTextarea) {
                    pendingSelectionRef.current = {
                      start: e.target.selectionStart ?? next.length,
                      end: e.target.selectionEnd ?? next.length
                    };
                    setInputText(convertText({ text: next, operation, dictionaryMap }));
                    return;
                  }

                  setInputText(next);
                  setOutputText(convertText({ text: next, operation, dictionaryMap }));
                }}
              />
            </div>

            {showNewTextarea ? (
              <div className="editor-container editor-container-last">
                <div className="editor-header">结果 (OUTPUT)</div>
                <Textarea
                  className="editor-textarea"
                  inputClassName="editor-input"
                  inputWrapperClassName="editor-textarea-wrapper"
                  placeholder="转换结果会显示在这里（可手动微调；输入变化会重新生成结果）"
                  value={outputText}
                  onChange={(e) => setOutputText(e.target.value)}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
