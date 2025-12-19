# LeapTools

## 环境要求

- Node.js >= 20.18
- pnpm >= 10

## 安装

```bash
pnpm install
```

## 开发（同时启动 Web + Electron）

```bash
pnpm dev
```

## 仅启动 Web

```bash
pnpm --filter @leaptools/web dev
```

## 仅启动 Electron（需要 Web 已在 3000 端口运行）

```bash
pnpm --filter @leaptools/electron dev
```

## 构建（Web 产物复用给 Electron）

```bash
pnpm build
```

## 本地校验

```bash
pnpm lint
pnpm typecheck
```

## 发布桌面端（macOS）

1) 构建 Web + Electron：

```bash
pnpm build
```

2) 产物目录：

- `apps/electron/dist-release/`
