"use client";

import NextLink from "next/link";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Input,
  Spacer
} from "@nextui-org/react";

export default function Page() {
  type Tool = {
    slug: string;
    title: string;
    description: string;
    cta: string;
    icon: string;
    tag?: string;
  };

  const tools: Tool[] = [
    {
      slug: "json",
      title: "JSON 工作台",
      description: "支持格式化、语法验证与结构预览，适配大文本处理。",
      cta: "进入工作台",
      icon: "JSON",
      tag: "核心"
    },
    {
      slug: "image",
      title: "无损图片压缩",
      description: "本地侧高效压缩，批量导出与尺寸信息预览。",
      cta: "立即运行",
      icon: "IMG",
      tag: "媒体"
    },
    {
      slug: "regex",
      title: "正则解释器",
      description: "调试表达式、查看匹配结果，并快速验证输入样本。",
      cta: "开始调试",
      icon: "AI",
      tag: "BETA"
    },
    {
      slug: "sql",
      title: "SQL 格式化",
      description: "统一格式、清理缩进、快速可读化复杂 SQL。",
      cta: "打开",
      icon: "SQL"
    },
    {
      slug: "letter-case",
      title: "大小写转换",
      description: "英文大小写与命名格式互转（camel/snake/kebab）。",
      cta: "打开",
      icon: "Aa"
    },
    {
      slug: "admin",
      title: "管理台",
      description: "站点配置、工具管理、权限与发布流程入口。",
      cta: "进入",
      icon: "ADM"
    }
  ];

  return (
    <>
      <Card shadow="sm">
        <CardHeader>所有工具</CardHeader>
        <CardBody>
          <Input label="搜索工具" placeholder="例如：JSON / SQL / Regex" variant="bordered" />
        </CardBody>
      </Card>

      <Spacer y={1} />

      <div className="nt-grid">
        {tools.map((t) => (
          <Card
            key={t.slug}
            isHoverable
            isPressable
            shadow="sm"
            onPress={() => {}}
          >
            <CardHeader className="nt-tool-head">
              <div className="nt-tool-meta">
                <div className="nt-tool-icon">{t.icon}</div>
                {t.tag ? (
                  <Chip size="sm" variant="flat">
                    {t.tag}
                  </Chip>
                ) : null}
              </div>
              <div className="nt-tool-title">{t.title}</div>
            </CardHeader>
            <CardBody>{t.description}</CardBody>
            <CardFooter>
              <Button as={NextLink} href={`/tools/${t.slug}`} color="primary">
                {t.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
