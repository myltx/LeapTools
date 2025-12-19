"use client";

type ToolCardProps = {
  icon: string;
  tag: string;
  title: string;
  description: string;
  actionHint: string;
  onClick?: () => void;
};

function ToolCard({ icon, tag, title, description, actionHint, onClick }: ToolCardProps) {
  return (
    <article
      className="tool-card"
      onClick={onClick}
      onKeyDown={(e) => {
        if (!onClick) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      role={onClick ? "button" : undefined}
      tabIndex={0}
    >
      <div className="tool-meta">
        <div className="tool-icon">{icon}</div>
        <span className="tool-tag">{tag}</span>
      </div>
      <div className="tool-info">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <div className="tool-action-hint">{actionHint}</div>
    </article>
  );
}

export function HomeView({ onOpenWorkspace }: { onOpenWorkspace: () => void }) {
  return (
    <>
      <div className="grid-title">
        <h2>所有工具</h2>
        <p className="grid-subtitle">专业级效率工具集，针对高频开发场景深度优化。</p>
      </div>

      <div className="tool-grid">
        <ToolCard
          icon="JSON"
          tag="核心"
          title="JSON 工作台"
          description="支持格式化、语法验证及树状结构预览，适配超大文件处理。"
          actionHint="进入工作台 →"
          onClick={onOpenWorkspace}
        />

        <ToolCard
          icon="IMG"
          tag="媒体"
          title="无损图片压缩"
          description="基于 browser-side WASM 技术，在本地完成极速高倍压缩。"
          actionHint="立即运行 →"
        />

        <ToolCard
          icon="AI"
          tag="BETA"
          title="正则解释器"
          description="可视化解析复杂正则表达式，并提供 AI 逻辑描述。"
          actionHint="尝试测试版 →"
        />
      </div>
    </>
  );
}
