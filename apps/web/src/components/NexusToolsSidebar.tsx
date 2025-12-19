"use client";

import type { NexusView } from "@/components/NexusToolsApp";
import { Link } from "@/ui";
import type { ReactNode } from "react";

type NavItemProps = {
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
};

function NavItem({ active, children, onClick }: NavItemProps) {
  return (
    <Link
      href="#"
      className={`nav-item ${active ? "active" : ""}`}
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
      }}
    >
      {children}
    </Link>
  );
}

export function AppSidebar({
  view,
  workspaceToolId,
  onNavigate,
  onActivateWorkspaceTool
}: {
  view: NexusView;
  workspaceToolId: string;
  onNavigate: (view: NexusView) => void;
  onActivateWorkspaceTool: (toolId: string) => void;
}) {
  return (
    <aside className="app-sidebar">
      <div className="nav-group">
        <div className="nav-heading">概览</div>
        <NavItem active={view === "home"} onClick={() => onNavigate("home")}>
          🏠 工作台首页
        </NavItem>
        <NavItem>⭐️ 收藏夹</NavItem>
        <NavItem>🕒 最近使用</NavItem>
      </div>

      <div className="nav-group">
        <div className="nav-heading">工程开发</div>
        <NavItem
          active={view === "workspace" && workspaceToolId === "workspace.json"}
          onClick={() => onActivateWorkspaceTool("workspace.json")}
        >
          JSON 处理器
        </NavItem>
        <NavItem
          active={view === "workspace" && workspaceToolId === "tool.sql"}
          onClick={() => onActivateWorkspaceTool("tool.sql")}
        >
          SQL 格式化
        </NavItem>
        <NavItem
          active={view === "workspace" && workspaceToolId === "tool.regex"}
          onClick={() => onActivateWorkspaceTool("tool.regex")}
        >
          正则解释器
        </NavItem>
        <NavItem>JWT 调试器</NavItem>
        <NavItem>Base64 编解码</NavItem>
      </div>

      <div className="nav-group">
        <div className="nav-heading">媒体资产</div>
        <NavItem
          active={view === "workspace" && workspaceToolId === "tool.image"}
          onClick={() => onActivateWorkspaceTool("tool.image")}
        >
          图片压缩
        </NavItem>
        <NavItem>SVG 优化</NavItem>
      </div>

      <div className="nav-footer">
        <NavItem>⚙️ 全局设置</NavItem>
      </div>
    </aside>
  );
}
