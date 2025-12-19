"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { SqlFormatMode, SqlFormatOptions } from "@/lib/sqlFormatter";
import { runSqlFormatter } from "@/lib/sqlFormatter";

type OutputState = "idle" | "processing" | "success" | "error";

async function copyToClipboard(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return;

  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText && window.isSecureContext) {
    await navigator.clipboard.writeText(trimmed);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = trimmed;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

export function SqlFormatterWorkspaceView({ onRequestRun }: { onRequestRun: (fn: () => void) => void }) {
  const [mode, setMode] = useState<SqlFormatMode>("format");
  const [indentSize, setIndentSize] = useState<2 | 4>(2);
  const [uppercaseKeywords, setUppercaseKeywords] = useState(true);
  const [breakAfterComma, setBreakAfterComma] = useState(true);
  const [newlineBeforeAndOr, setNewlineBeforeAndOr] = useState(true);
  const [stripComments, setStripComments] = useState(false);

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("等待执行...");
  const [outputState, setOutputState] = useState<OutputState>("idle");
  const [hint, setHint] = useState<string>("");

  const options = useMemo<SqlFormatOptions>(
    () => ({
      mode,
      indentSize,
      uppercaseKeywords,
      breakAfterComma,
      newlineBeforeAndOr,
      stripComments
    }),
    [mode, indentSize, uppercaseKeywords, breakAfterComma, newlineBeforeAndOr, stripComments],
  );

  const run = useCallback(() => {
    if (!input.trim()) return;

    setHint("");
    setOutputState("processing");
    setOutput("⚡ 正在处理 SQL...");

    window.setTimeout(() => {
      try {
        const result = runSqlFormatter(input, options);
        if (result === null) return;
        setOutputState("success");
        setOutput(result);
        setHint("Ready");
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        setOutputState("error");
        setOutput(`❌ 处理失败: ${message}`);
        setHint("Error");
      }
    }, 120);
  }, [input, options]);

  useEffect(() => {
    onRequestRun(run);
  }, [onRequestRun, run]);

  const onCopyOutput = useCallback(async () => {
    try {
      await copyToClipboard(output);
      setHint("已复制输出");
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      setHint(`复制失败：${message}`);
    }
  }, [output]);

  return (
    <>
      <div className="workspace-topbar">
        <div>
          <h2 className="workspace-title">SQL 格式化</h2>
          <p className="workspace-subtitle">美化与规范化输出（本地处理）</p>
        </div>
        <div className="workspace-actions">
          <button className="action-btn action-btn-inline" type="button" onClick={() => setInput("")}>
            清空输入
          </button>
          <button className="action-btn action-btn-inline" type="button" onClick={() => void onCopyOutput()}>
            复制输出
          </button>
          <button className="action-btn-primary action-btn-inline" type="button" onClick={run}>
            立即执行 (⌘↵)
          </button>
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
              <label>处理模式</label>
              <select value={mode} onChange={(e) => setMode(e.target.value as SqlFormatMode)}>
                <option value="format">格式化</option>
                <option value="minify">压缩 (Minify)</option>
              </select>
            </div>

            <div className="control-group">
              <label>缩进宽度</label>
              <select
                value={String(indentSize)}
                onChange={(e) => setIndentSize(Number(e.target.value) === 4 ? 4 : 2)}
                disabled={mode !== "format"}
              >
                <option value="2">2 个空格</option>
                <option value="4">4 个空格</option>
              </select>
            </div>

            <div className="control-group">
              <label>转换选项</label>
              <div className="control-options">
                <label className="control-check">
                  <input
                    type="checkbox"
                    checked={uppercaseKeywords}
                    onChange={(e) => setUppercaseKeywords(e.target.checked)}
                    disabled={mode !== "format"}
                  />
                  关键字大写
                </label>
                <label className="control-check">
                  <input
                    type="checkbox"
                    checked={breakAfterComma}
                    onChange={(e) => setBreakAfterComma(e.target.checked)}
                    disabled={mode !== "format"}
                  />
                  逗号后换行
                </label>
                <label className="control-check">
                  <input
                    type="checkbox"
                    checked={newlineBeforeAndOr}
                    onChange={(e) => setNewlineBeforeAndOr(e.target.checked)}
                    disabled={mode !== "format"}
                  />
                  AND/OR 另起一行
                </label>
                <label className="control-check">
                  <input type="checkbox" checked={stripComments} onChange={(e) => setStripComments(e.target.checked)} />
                  去除注释
                </label>
              </div>
            </div>
          </aside>

          <div className="editor-split">
            <div className="editor-container">
              <div className="editor-header">输入 (RAW INPUT)</div>
              <textarea
                className="editor-input"
                placeholder="粘贴 SQL..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>

            <div className="editor-container editor-container-last">
              <div className="editor-header">输出 (FORMATTED OUTPUT)</div>
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

