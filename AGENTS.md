# Repository Guidelines

## 项目结构与模块组织

- `apps/web/`：Next.js Web（默认端口 `3000`），源码在 `apps/web/src/`（`app/` 为路由与页面，`components/` 为组件，`public/` 为静态资源）。
- `apps/electron/`：Electron 桌面端，主进程入口在 `apps/electron/src/main.ts`，预加载脚本在 `apps/electron/src/preload.ts`，构建配置在 `apps/electron/electron-builder.yml`。
- `packages/*/`：可复用库（如 `api/`、`ui/`、`hooks/`、`utils/`、`config/`），通常通过 `src/index.ts` 统一导出。
- 共享 TypeScript/ESLint/Prettier 配置在 `packages/config/`，基础 TS 配置在 `tsconfig.base.json`。

## 构建、测试与本地开发命令

在仓库根目录执行：

- 安装依赖：`pnpm install`
- 同时启动 Web + Electron：`pnpm dev`
- 仅启动 Web：`pnpm --filter @my-app/web dev`
- 仅启动 Electron（要求 Web 已运行在 `http://localhost:3000`）：`pnpm --filter @my-app/electron dev`
- 构建（Web 产物供 Electron 复用）：`pnpm build`
- 静态检查：`pnpm lint`、`pnpm typecheck`
- 格式化：`pnpm format`
- 清理产物：`pnpm clean`

## 常用工作流（示例）

- 只检查某个包：`pnpm --filter @my-app/web lint`、`pnpm --filter @my-app/electron typecheck`
- 新增依赖（示例）：`pnpm --filter @my-app/web add zustand`；给共享包加依赖：`pnpm --filter @my-app/utils add zod`
- 构建/打包 Electron：先 `pnpm --filter @my-app/web build`（或直接 `pnpm build`），再 `pnpm --filter @my-app/electron build`（产物在 `apps/electron/dist-release/`）
- 批量执行（仅存在脚本的包）：`pnpm -r --parallel --if-present lint`、`pnpm -r --parallel --if-present typecheck`

## 代码风格与命名约定

- 语言：TypeScript（`strict: true`），包使用 ESM（多数 `type: module`）。
- 格式化：Prettier（`printWidth: 100`、分号、双引号），统一用 `pnpm format` 处理。
- 规范：ESLint（unused-imports 强校验）；未使用变量如需保留请以前缀 `_` 命名。
- 命名示例：组件 `PascalCase`（如 `ServerInfo.tsx`），Hooks `useXxx.ts`（如 `useIsMounted.ts`）。

## 测试指南

当前未提供统一的 `test` 脚本与测试目录约定。新增测试时建议：

- Web 侧：放在 `apps/web/src/**/__tests__/*.test.ts(x)` 或与模块同级的 `*.test.ts(x)`。
- 先在对应包内补充 `test` 脚本，再在根目录聚合（例如 `pnpm -r --if-present test`）。

## 提交与 PR 规范

- 本工作区未包含 `.git`，无法从历史提交归纳约定；建议采用 Conventional Commits（如 `feat: ...`、`fix: ...`、`chore: ...`）。
- PR 至少包含：变更说明、验证方式（运行了哪些命令）、涉及 UI 的截图/录屏；必要时关联 Issue。
- 合入前确保：`pnpm lint`、`pnpm typecheck` 通过；避免提交构建产物（如 `apps/electron/dist-release/`、`apps/web/.next/`）。

## 配置与安全

- 环境变量参考 `.env.example`（根目录及各 app 内均有示例）；不要提交真实密钥或私有地址。
- Workspace 偏好：`.npmrc` 已启用 `prefer-workspace-packages` 与 `save-workspace-protocol`，新增依赖优先使用 `workspace:*`。
