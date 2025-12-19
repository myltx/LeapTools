"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ImageCompressionOptions, ImageOutputFormat } from "@/lib/imageCompressor";
import { compressImage, formatBytes } from "@/lib/imageCompressor";

type OutputState = "idle" | "processing" | "success" | "error";

type SourceFile = {
  file: File;
  url: string;
};

type ImageResult = {
  file: File;
  inputUrl: string;
  outputUrl: string;
  outputBlob: Blob;
  width: number;
  height: number;
  format: ImageOutputFormat;
};

function getOutputExt(format: ImageOutputFormat) {
  if (format === "image/jpeg") return "jpg";
  if (format === "image/png") return "png";
  return "webp";
}

function withNewExt(name: string, ext: string) {
  const idx = name.lastIndexOf(".");
  const base = idx > 0 ? name.slice(0, idx) : name;
  return `${base}.${ext}`;
}

export function ImageCompressorWorkspaceView({ onRequestRun }: { onRequestRun: (fn: () => void) => void }) {
  const [format, setFormat] = useState<ImageOutputFormat>("image/webp");
  const [quality, setQuality] = useState(0.82);
  const [maxWidth, setMaxWidth] = useState<number>(0);
  const [maxHeight, setMaxHeight] = useState<number>(0);

  const [sources, setSources] = useState<SourceFile[]>([]);
  const [results, setResults] = useState<ImageResult[]>([]);
  const [outputState, setOutputState] = useState<OutputState>("idle");
  const [hint, setHint] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const sourcesRef = useRef<SourceFile[]>([]);
  const resultsRef = useRef<ImageResult[]>([]);

  useEffect(() => {
    sourcesRef.current = sources;
  }, [sources]);

  useEffect(() => {
    resultsRef.current = results;
  }, [results]);

  const options = useMemo<ImageCompressionOptions>(
    () => ({
      format,
      quality,
      maxWidth: maxWidth > 0 ? maxWidth : null,
      maxHeight: maxHeight > 0 ? maxHeight : null
    }),
    [format, quality, maxWidth, maxHeight],
  );

  const setFiles = useCallback((files: File[]) => {
    setResults([]);
    setOutputState("idle");
    setHint("");

    setSources((prev) => {
      for (const s of prev) URL.revokeObjectURL(s.url);
      for (const r of resultsRef.current) URL.revokeObjectURL(r.outputUrl);
      return files.map((f) => ({ file: f, url: URL.createObjectURL(f) }));
    });
  }, []);

  useEffect(() => {
    return () => {
      for (const s of sourcesRef.current) URL.revokeObjectURL(s.url);
      for (const r of resultsRef.current) URL.revokeObjectURL(r.outputUrl);
    };
  }, []);

  const run = useCallback(() => {
    if (!sources.length) return;

    setHint("");
    setOutputState("processing");
    setResults((prev) => {
      for (const r of prev) URL.revokeObjectURL(r.outputUrl);
      return [];
    });

    const task = async () => {
      const next: ImageResult[] = [];
      for (const src of sources) {
        const out = await compressImage(src.file, options);
        const url = URL.createObjectURL(out.blob);
        next.push({
          file: src.file,
          inputUrl: src.url,
          outputUrl: url,
          outputBlob: out.blob,
          width: out.width,
          height: out.height,
          format: out.format
        });
      }
      return next;
    };

    void task()
      .then((next) => {
        setResults(next);
        setOutputState("success");
        setHint("Ready");
      })
      .catch((e) => {
        const message = e instanceof Error ? e.message : String(e);
        setOutputState("error");
        setHint(`Error: ${message}`);
      });
  }, [options, sources]);

  useEffect(() => {
    onRequestRun(run);
  }, [onRequestRun, run]);

  const onPickFiles = useCallback(() => fileInputRef.current?.click(), []);

  const onClear = useCallback(() => {
    setFiles([]);
  }, [setFiles]);

  return (
    <>
      <div className="workspace-topbar">
        <div>
          <h2 className="workspace-title">无损图片压缩</h2>
          <p className="workspace-subtitle">本地批量处理、预览与下载</p>
        </div>
        <div className="workspace-actions">
          <button className="action-btn action-btn-inline" type="button" onClick={onPickFiles}>
            选择图片
          </button>
          <button className="action-btn action-btn-inline" type="button" onClick={onClear} disabled={!sources.length}>
            清空
          </button>
          <button className="action-btn-primary action-btn-inline" type="button" onClick={run} disabled={!sources.length}>
            立即压缩 (⌘↵)
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
              <label>输入文件</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const list = Array.from(e.target.files ?? []);
                  setFiles(list);
                  e.currentTarget.value = "";
                }}
              />
            </div>

            <div className="control-group">
              <label>输出格式</label>
              <select value={format} onChange={(e) => setFormat(e.target.value as ImageOutputFormat)}>
                <option value="image/webp">WebP</option>
                <option value="image/jpeg">JPEG</option>
                <option value="image/png">PNG</option>
              </select>
            </div>

            <div className="control-group">
              <label>质量 (JPEG/WebP)</label>
              <input
                type="range"
                min={0.05}
                max={1}
                step={0.01}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                disabled={format === "image/png"}
              />
            </div>

            <div className="control-group">
              <label>最大宽度 (0=不限制)</label>
              <input
                type="number"
                min={0}
                value={String(maxWidth)}
                onChange={(e) => setMaxWidth(Math.max(0, Number(e.target.value) || 0))}
              />
            </div>

            <div className="control-group">
              <label>最大高度 (0=不限制)</label>
              <input
                type="number"
                min={0}
                value={String(maxHeight)}
                onChange={(e) => setMaxHeight(Math.max(0, Number(e.target.value) || 0))}
              />
            </div>
          </aside>

          <div className="editor-split">
            <div className="editor-container">
              <div className="editor-header">输入 (SOURCE)</div>
              <div className="image-list">
                {!sources.length ? (
                  <div className="image-empty">选择图片后即可预览与处理</div>
                ) : (
                  sources.map((s) => (
                    <div key={`${s.file.name}-${s.file.size}-${s.file.lastModified}`} className="image-item">
                      <Image
                        className="image-thumb"
                        src={s.url}
                        alt={s.file.name}
                        width={96}
                        height={72}
                        unoptimized
                      />
                      <div className="image-meta">
                        <div className="image-title">{s.file.name}</div>
                        <div>
                          {s.file.type || "unknown"} · {formatBytes(s.file.size)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="editor-container editor-container-last">
              <div className="editor-header">输出 (RESULT)</div>
              <div className={`image-list ${outputState === "processing" ? "is-processing" : ""}`}>
                {outputState === "error" ? (
                  <div className="image-empty">处理失败，请检查图片格式或参数</div>
                ) : !results.length ? (
                  <div className="image-empty">{outputState === "processing" ? "⚡ 正在处理..." : "等待执行..."}</div>
                ) : (
                  results.map((r) => {
                    const ratio = r.outputBlob.size ? r.outputBlob.size / r.file.size : 0;
                    const ratioLabel = ratio ? `${(ratio * 100).toFixed(1)}%` : "-";
                    return (
                      <div key={`${r.file.name}-${r.outputBlob.size}-${r.outputBlob.type}`} className="image-item">
                        <Image
                          className="image-thumb"
                          src={r.outputUrl}
                          alt={r.file.name}
                          width={96}
                          height={72}
                          unoptimized
                        />
                        <div className="image-meta">
                          <div className="image-title">{withNewExt(r.file.name, getOutputExt(r.format))}</div>
                          <div>
                            {r.format} · {r.width}×{r.height}
                          </div>
                          <div>
                            {formatBytes(r.file.size)} → {formatBytes(r.outputBlob.size)} ({ratioLabel})
                          </div>
                        </div>
                        <div className="image-actions">
                          <a
                            className="action-btn action-btn-inline"
                            href={r.outputUrl}
                            download={withNewExt(r.file.name, getOutputExt(r.format))}
                          >
                            下载
                          </a>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
