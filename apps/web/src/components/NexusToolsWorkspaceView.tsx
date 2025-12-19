"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { JsonProcessorOptions } from "@/lib/jsonProcessor";
import { runJsonProcessor } from "@/lib/jsonProcessor";

type OutputState = "idle" | "processing" | "success" | "error";

export function WorkspaceView({ onRequestRun }: { onRequestRun: (fn: () => void) => void }) {
  const [indent, setIndent] = useState<2 | 4 | 0>(4);
  const [sortKeys, setSortKeys] = useState(true);
  const [escapeUnicode, setEscapeUnicode] = useState(false);

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("等待执行...");
  const [outputState, setOutputState] = useState<OutputState>("idle");

  const options = useMemo<JsonProcessorOptions>(
    () => ({ indent, sortKeys, escapeUnicode }),
    [indent, sortKeys, escapeUnicode],
  );

  const run = useCallback(() => {
    if (!input.trim()) return;

    setOutputState("processing");
    setOutput("⚡ 正在处理结构化数据...");

    window.setTimeout(() => {
      try {
        const result = runJsonProcessor(input, options);
        if (result === null) return;
        setOutputState("success");
        setOutput(result);
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        setOutputState("error");
        setOutput(`❌ 解析错误: ${message}`);
      }
    }, 400);
  }, [input, options]);

  useEffect(() => {
    onRequestRun(run);
  }, [onRequestRun, run]);

  return (
    <>
      <div className="workspace-topbar">
        <div>
          <h2 className="workspace-title">JSON 处理器</h2>
          <p className="workspace-subtitle">结构化数据处理空间</p>
        </div>
        <div className="workspace-actions">
          <button className="action-btn action-btn-inline" type="button">
            分享工作台
          </button>
          <button className="action-btn-primary action-btn-inline" type="button" onClick={run}>
            立即执行 (⌘↵)
          </button>
        </div>
      </div>

      <JsonWorkspace
        indent={indent}
        sortKeys={sortKeys}
        escapeUnicode={escapeUnicode}
        onIndentChange={setIndent}
        onSortKeysChange={setSortKeys}
        onEscapeUnicodeChange={setEscapeUnicode}
        input={input}
        onInputChange={setInput}
        output={output}
        outputState={outputState}
      />
    </>
  );
}

function JsonWorkspace(props: {
  indent: 2 | 4 | 0;
  sortKeys: boolean;
  escapeUnicode: boolean;
  onIndentChange: (v: 2 | 4 | 0) => void;
  onSortKeysChange: (v: boolean) => void;
  onEscapeUnicodeChange: (v: boolean) => void;
  input: string;
  onInputChange: (v: string) => void;
  output: string;
  outputState: OutputState;
}) {
  return (
    <div className="workspace-shell">
      <div className="workspace-toolbar">
        <div className="status-dot bg-success" />
        <span className="workspace-runtime">运行环境: Local WASM</span>
        <div className="workspace-version">v1.2.0</div>
      </div>

      <div className="workspace-content">
        <aside className="control-panel">
          <div className="control-group">
            <label>缩进宽度</label>
            <select
              value={String(props.indent)}
              onChange={(e) => {
                const v = Number(e.target.value);
                props.onIndentChange(v === 0 ? 0 : v === 2 ? 2 : 4);
              }}
            >
              <option value="2">2 个空格</option>
              <option value="4">4 个空格</option>
              <option value="0">压缩 (Minify)</option>
            </select>
          </div>

          <div className="control-group">
            <label>转换选项</label>
            <div className="control-options">
              <label className="control-check">
                <input
                  type="checkbox"
                  checked={props.sortKeys}
                  onChange={(e) => props.onSortKeysChange(e.target.checked)}
                />
                键名按字母排序
              </label>
              <label className="control-check">
                <input
                  type="checkbox"
                  checked={props.escapeUnicode}
                  onChange={(e) => props.onEscapeUnicodeChange(e.target.checked)}
                />
                转义 Unicode
              </label>
            </div>
          </div>
        </aside>

        <div className="editor-split">
          <div className="editor-container">
            <div className="editor-header">输入 (RAW INPUT)</div>
            <textarea
              className="editor-input"
              placeholder="粘贴 JSON 原始数据..."
              value={props.input}
              onChange={(e) => props.onInputChange(e.target.value)}
            />
          </div>

          <div className="editor-container editor-container-last">
            <div className="editor-header">输出 (FORMATTED OUTPUT)</div>
            <div
              className={`result-view ${
                props.outputState === "processing" ? "is-processing" : props.outputState === "error" ? "is-error" : ""
              }`}
            >
              {props.output}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
