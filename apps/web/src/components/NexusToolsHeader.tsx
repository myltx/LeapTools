"use client";

export function AppHeader({ onOpenPalette }: { onOpenPalette: () => void }) {
  return (
    <header className="app-header">
      <div className="logo-area" aria-label="NexusTools Pro">
        <div className="logo-box" aria-hidden="true">
          N
        </div>
        NexusTools Pro
      </div>

      <div
        className="search-wrapper"
        onClick={onOpenPalette}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpenPalette();
          }
        }}
        role="button"
        tabIndex={0}
      >
        <div className="search-trigger">
          <span aria-hidden="true">🔍</span>
          <span>搜索工具或功能...</span>
          <span className="shortcut-key">⌘ K</span>
        </div>
      </div>

      <div className="header-right">
        <button className="icon-btn" type="button" aria-label="通知">
          🔔
        </button>
        <div className="avatar" aria-label="用户头像">
          <div className="avatar-inner">D</div>
        </div>
      </div>
    </header>
  );
}
