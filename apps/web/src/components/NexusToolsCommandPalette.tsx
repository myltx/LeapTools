"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type CommandItem = {
  id: string;
  label: string;
};

const SUGGESTIONS: CommandItem[] = [
  { id: "workspace.json", label: "💎 JSON 处理器" },
  { id: "tool.image", label: "🖼️ 无损图片压缩" },
  { id: "tool.sql", label: "📜 SQL 格式化" }
];

export function CommandPalette(props: {
  open: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!props.open) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(id);
  }, [props.open]);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SUGGESTIONS;
    return SUGGESTIONS.filter((c) => c.label.toLowerCase().includes(q));
  }, [query]);

  return (
    <div
      className={`modal-overlay ${props.open ? "open" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) props.onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-hidden={!props.open}
    >
      <div className="command-palette">
        <input
          ref={inputRef}
          type="text"
          className="palette-input"
          placeholder="键入工具名称或命令..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="palette-body">
          <div className="nav-heading">建议工具</div>
          {items.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              className={`nav-item palette-item ${idx === 0 ? "palette-item-primary" : ""}`}
              onClick={() => props.onSelect(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
