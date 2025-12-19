import { isElectronRenderer } from "@leaptools/utils";

export function ServerInfo() {
  return (
    <div className="stack">
      <div className="muted">NODE_ENV：{process.env.NODE_ENV}</div>
      <div className="muted">NEXT_PUBLIC_APP_NAME：{process.env.NEXT_PUBLIC_APP_NAME ?? "未配置"}</div>
      <div className="muted">运行环境：{isElectronRenderer() ? "Electron Renderer" : "Browser"}</div>
    </div>
  );
}
