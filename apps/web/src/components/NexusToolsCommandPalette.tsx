"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ToolItem } from "@my-app/config/tools";
import { tools } from "@my-app/config/tools";

type CommandItem = {
  id: string;
  label: string;
  keywords: string[];
};

function isPaletteTool(tool: ToolItem): tool is ToolItem & { palette: NonNullable<ToolItem["palette"]> } {
  return Boolean(tool.palette?.enabled);
}

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

  const suggestions = useMemo<CommandItem[]>(() => {
    return tools
      .filter(isPaletteTool)
      .sort((a, b) => (a.palette?.order ?? 0) - (b.palette?.order ?? 0))
      .map((tool) => ({
        id: tool.id,
        label: tool.palette?.label ?? tool.name,
        keywords: [
          tool.id,
          tool.name,
          tool.description,
          tool.tag ?? "",
          ...(tool.palette?.keywords ?? [])
        ].filter(Boolean)
      }));
  }, []);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return suggestions;
    return suggestions.filter((c) => c.keywords.some((k) => k.toLowerCase().includes(q)));
  }, [query, suggestions]);

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
