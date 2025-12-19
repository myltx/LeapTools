"use client";

import type { ToolItem } from "@leaptools/config/tools";
import { tools } from "@leaptools/config/tools";
import { Card } from "@/ui";

type ToolCardProps = {
  icon: string;
  tag: string | undefined;
  title: string;
  description: string;
  actionHint: string;
  onClick?: () => void;
};

function ToolCard({ icon, tag, title, description, actionHint, onClick }: ToolCardProps) {
  return (
    <Card
      className="tool-card"
      isPressable={Boolean(onClick)}
      {...(onClick ? { onPress: () => onClick() } : {})}
    >
      <div className="tool-meta">
        <div className="tool-icon">{icon}</div>
        {tag ? <span className="tool-tag">{tag}</span> : null}
      </div>
      <div className="tool-info">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <div className="tool-action-hint">{actionHint}</div>
    </Card>
  );
}

function isHomeTool(tool: ToolItem): tool is ToolItem & { home: NonNullable<ToolItem["home"]> } {
  return Boolean(tool.home?.enabled);
}

export function HomeView({ onActivateTool }: { onActivateTool: (tool: ToolItem) => void }) {
  const homeTools = tools
    .filter(isHomeTool)
    .sort((a, b) => (a.home?.order ?? 0) - (b.home?.order ?? 0));

  return (
    <>
      <div className="grid-title">
        <h2>所有工具</h2>
        <p className="grid-subtitle">专业级效率工具集，针对高频开发场景深度优化。</p>
      </div>

      <div className="tool-grid">
        {homeTools.map((tool) => (
          <ToolCard
            key={tool.id}
            icon={tool.icon}
            tag={tool.tag}
            title={tool.name}
            description={tool.description}
            actionHint={tool.home?.actionHint ?? ""}
            onClick={() => onActivateTool(tool)}
          />
        ))}
      </div>
    </>
  );
}
