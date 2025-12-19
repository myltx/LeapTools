"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ToolItem } from "@leaptools/config/tools";
import { tools } from "@leaptools/config/tools";
import { Button, Dialog, Input } from "@/ui";

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
    <Dialog
      isOpen={props.open}
      onOpenChange={(isOpen) => {
        if (!isOpen) props.onClose();
      }}
      dismissable
      size="lg"
    >
      <div className="command-palette">
        <Input
          ref={inputRef}
          type="text"
          placeholder="键入工具名称或命令..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="palette-body">
          <div className="nav-heading">建议工具</div>
          {items.map((item, idx) => (
            <Button
              key={item.id}
              type="button"
              variant={idx === 0 ? "primary" : "secondary"}
              appearance={idx === 0 ? "flat" : "light"}
              fullWidth
              style={{ justifyContent: "flex-start" }}
              onClick={() => props.onSelect(item.id)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>
    </Dialog>
  );
}
