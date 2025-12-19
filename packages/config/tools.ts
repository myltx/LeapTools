export type ToolRoute =
  | {
      type: "view";
      view: "home" | "workspace";
    }
  | {
      type: "noop";
    };

export type ToolItem = {
  id: string;
  name: string;
  icon: string;
  tag?: string;
  description: string;
  route: ToolRoute;
  home?: {
    enabled: boolean;
    order: number;
    actionHint: string;
  };
  palette?: {
    enabled: boolean;
    order: number;
    label: string;
    keywords?: string[];
  };
  defaultOptions?: Record<string, unknown>;
};

export const tools: ToolItem[] = [
  {
    id: "workspace.json",
    name: "JSON 工作台",
    icon: "JSON",
    tag: "核心",
    description: "支持格式化、语法验证及树状结构预览，适配超大文件处理。",
    route: { type: "view", view: "workspace" },
    home: {
      enabled: true,
      order: 10,
      actionHint: "进入工作台 →"
    },
    palette: {
      enabled: true,
      order: 10,
      label: "💎 JSON 处理器",
      keywords: ["json", "format", "minify", "sort"]
    },
    defaultOptions: {
      indent: 4,
      sortKeys: true,
      escapeUnicode: false
    }
  },
  {
    id: "workspace.letter-case",
    name: "英文字母大小写转换",
    icon: "Aa",
    tag: "文本",
    description:
      "支持多种大小写规则、文本格式互转与清理操作，并可选自动复制与新文本框输出。",
    route: { type: "view", view: "workspace" },
    home: {
      enabled: true,
      order: 15,
      actionHint: "立即转换 →"
    },
    palette: {
      enabled: true,
      order: 15,
      label: "🔤 大小写转换",
      keywords: [
        "case",
        "uppercase",
        "lowercase",
        "title case",
        "sentence case",
        "camel",
        "kebab",
        "snake",
        "text"
      ]
    },
    defaultOptions: {
      operation: "upper_case",
      showNewTextarea: true,
      autoCopy: false,
      dictionary: ["iPhone", "OpenAI", "API", "HTTP", "Next.js"]
    }
  },
  {
    id: "tool.image",
    name: "无损图片压缩",
    icon: "IMG",
    tag: "媒体",
    description: "基于 browser-side WASM 技术，在本地完成极速高倍压缩。",
    route: { type: "view", view: "workspace" },
    home: {
      enabled: true,
      order: 20,
      actionHint: "立即运行 →"
    },
    palette: {
      enabled: true,
      order: 20,
      label: "🖼️ 无损图片压缩",
      keywords: ["image", "png", "jpg", "compress", "wasm"]
    }
  },
  {
    id: "tool.regex",
    name: "正则解释器",
    icon: "AI",
    tag: "BETA",
    description: "可视化解析复杂正则表达式，并提供 AI 逻辑描述。",
    route: { type: "view", view: "workspace" },
    home: {
      enabled: true,
      order: 30,
      actionHint: "尝试测试版 →"
    },
    palette: {
      enabled: true,
      order: 25,
      label: "🧠 正则解释器",
      keywords: ["regex", "regexp", "pattern", "match"]
    }
  },
  {
    id: "tool.sql",
    name: "SQL 格式化",
    icon: "SQL",
    description: "SQL 美化与规范化输出，适配常见方言。",
    route: { type: "view", view: "workspace" },
    palette: {
      enabled: true,
      order: 30,
      label: "📜 SQL 格式化",
      keywords: ["sql", "format", "prettify"]
    }
  }
];
