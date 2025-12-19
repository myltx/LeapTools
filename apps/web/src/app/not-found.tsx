import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ fontSize: 18, marginBottom: 8 }}>404</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: 16 }}>页面不存在。</p>
      <Link href="/" className="nav-item" style={{ width: "fit-content", background: "var(--bg-surface)" }}>
        返回首页
      </Link>
    </div>
  );
}
