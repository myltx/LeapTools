"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { analyzeRegexMeta, compileRegex, findRegexMatches } from "@/lib/regexExplorer";
import { Button, Checkbox, Input, Textarea } from "@/ui";

type OutputState = "idle" | "processing" | "success" | "error";

function renderMatches(params: {
  pattern: string;
  flags: string;
  capturingGroups: number;
  namedGroups: string[];
  matches: ReturnType<typeof findRegexMatches>;
}) {
  const lines: string[] = [];
  lines.push(`/${params.pattern}/${params.flags}`);
  lines.push(`捕获组: ${params.capturingGroups}${params.namedGroups.length ? `（命名: ${params.namedGroups.join(", ")}）` : ""}`);
  lines.push(`匹配数: ${params.matches.length}`);
  lines.push("");

  for (let i = 0; i < params.matches.length; i++) {
    const m = params.matches[i]!;
    lines.push(`[${i}] @${m.index}: ${m.match}`);

    if (m.groups.length) {
      for (const g of m.groups) {
        lines.push(`  $${g.index}: ${g.text}`);
      }
    }

    const named = Object.entries(m.namedGroups);
    if (named.length) {
      lines.push("  named:");
      for (const [k, v] of named) lines.push(`    ${k}: ${v}`);
    }

    lines.push("");
  }

  return lines.join("\n").trimEnd();
}

export function RegexExplorerWorkspaceView({ onRequestRun }: { onRequestRun: (fn: () => void) => void }) {
  const [pattern, setPattern] = useState("");
  const [text, setText] = useState("");
  const [maxMatches, setMaxMatches] = useState(200);

  const [flagG, setFlagG] = useState(true);
  const [flagI, setFlagI] = useState(false);
  const [flagM, setFlagM] = useState(false);
  const [flagS, setFlagS] = useState(false);
  const [flagU, setFlagU] = useState(false);
  const [flagY, setFlagY] = useState(false);

  const flags = useMemo(() => {
    const f = [
      flagG ? "g" : "",
      flagI ? "i" : "",
      flagM ? "m" : "",
      flagS ? "s" : "",
      flagU ? "u" : "",
      flagY ? "y" : ""
    ].join("");
    return f;
  }, [flagG, flagI, flagM, flagS, flagU, flagY]);

  const [output, setOutput] = useState("等待执行...");
  const [outputState, setOutputState] = useState<OutputState>("idle");
  const [hint, setHint] = useState<string>("");

  const run = useCallback(() => {
    if (!pattern.trim()) return;

    setHint("");
    setOutputState("processing");
    setOutput("⚡ 正在编译并匹配...");

    window.setTimeout(() => {
      const compiled = compileRegex(pattern, flags);
      if (!compiled.ok) {
        setOutputState("error");
        setOutput(`❌ 正则编译失败: ${compiled.error}`);
        setHint("Error");
        return;
      }

      try {
        const meta = analyzeRegexMeta(pattern);
        const matches = findRegexMatches(compiled.regex, text, maxMatches);
        setOutputState("success");
        setOutput(
          renderMatches({
            pattern,
            flags: compiled.normalizedFlags,
            capturingGroups: meta.capturingGroups,
            namedGroups: meta.namedGroups,
            matches
          }),
        );
        setHint("Ready");
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        setOutputState("error");
        setOutput(`❌ 匹配失败: ${message}`);
        setHint("Error");
      }
    }, 80);
  }, [pattern, flags, text, maxMatches]);

  useEffect(() => {
    onRequestRun(run);
  }, [onRequestRun, run]);

  return (
    <>
      <div className="workspace-topbar">
        <div>
          <h2 className="workspace-title">正则解释器</h2>
          <p className="workspace-subtitle">编译校验、批量匹配、分组输出</p>
        </div>
        <div className="workspace-actions">
          <Button variant="secondary" type="button" onClick={() => setText("")}>
            清空文本
          </Button>
          <Button type="button" onClick={run}>
            立即执行 (⌘↵)
          </Button>
        </div>
      </div>

      <div className="workspace-shell">
        <div className="workspace-toolbar">
          <div className="status-dot bg-success" />
          <span className="workspace-runtime">运行环境: Local</span>
          <div className="workspace-version">{hint || "v0.1.0"}</div>
        </div>

        <div className="workspace-content">
          <aside className="control-panel">
            <div className="control-group">
              <label>Pattern</label>
              <Input value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="例如: ^(\\w+)-(\\d+)$" />
            </div>

            <div className="control-group">
              <label>Flags</label>
              <div className="control-options">
                <Checkbox checked={flagG} onCheckedChange={setFlagG} className="control-check">
                  g 全局
                </Checkbox>
                <Checkbox checked={flagI} onCheckedChange={setFlagI} className="control-check">
                  i 忽略大小写
                </Checkbox>
                <Checkbox checked={flagM} onCheckedChange={setFlagM} className="control-check">
                  m 多行
                </Checkbox>
                <Checkbox checked={flagS} onCheckedChange={setFlagS} className="control-check">
                  s dotAll
                </Checkbox>
                <Checkbox checked={flagU} onCheckedChange={setFlagU} className="control-check">
                  u Unicode
                </Checkbox>
                <Checkbox checked={flagY} onCheckedChange={setFlagY} className="control-check">
                  y 粘连
                </Checkbox>
              </div>
            </div>

            <div className="control-group">
              <label>最大匹配数</label>
              <Input
                type="number"
                min={1}
                max={5000}
                value={String(maxMatches)}
                onChange={(e) => setMaxMatches(Math.max(1, Math.min(5000, Number(e.target.value) || 1)))}
              />
            </div>
          </aside>

          <div className="editor-split">
            <div className="editor-container">
              <div className="editor-header">输入 (TEST TEXT)</div>
              <Textarea
                className="editor-textarea"
                inputClassName="editor-input"
                inputWrapperClassName="editor-textarea-wrapper"
                placeholder="粘贴需要匹配的文本..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>

            <div className="editor-container editor-container-last">
              <div className="editor-header">输出 (MATCH RESULT)</div>
              <div
                className={`result-view ${
                  outputState === "processing" ? "is-processing" : outputState === "error" ? "is-error" : ""
                }`}
              >
                {output}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
