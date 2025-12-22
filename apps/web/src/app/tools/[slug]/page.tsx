"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Input,
  Select,
  SelectItem,
  Spacer,
  Textarea
} from "@nextui-org/react";

export default function ToolPage() {
  const params = useParams<{ slug?: string | string[] }>();
  const slug = useMemo(() => {
    const v = params?.slug;
    if (Array.isArray(v)) return v.join("/");
    return v ?? "unknown";
  }, [params?.slug]);

  const title = useMemo(() => {
    const map: Record<string, string> = {
      regex: "正则调试",
      sql: "SQL 格式化",
      json: "JSON 工作台",
      "letter-case": "大小写转换",
      image: "无损图片压缩",
      admin: "管理台",
      favorites: "收藏夹",
      recent: "最近使用",
      jwt: "JWT 调试器",
      base64: "Base64 编解码",
      svg: "SVG 优化",
      settings: "全局设置"
    };
    return map[slug] ?? slug;
  }, [slug]);

  return (
    <>
      <Card>
        <CardHeader className="nt-toolbar">
          <div className="nt-toolbar-left">
            <div className="nt-toolbar-title">{title}</div>
            <div className="nt-toolbar-sub">运行环境：Local WASM</div>
          </div>
          <div className="nt-toolbar-right">
            <Chip color="success" variant="flat">
              Ready
            </Chip>
          </div>
        </CardHeader>
        <CardBody>参数面板与编辑器区域分开呈现，便于快速调整与对照输出。</CardBody>
        <CardFooter>
          <Button color="primary" size="sm">
            立即执行
          </Button>
          <Spacer x={0.5} />
          <Button variant="bordered" size="sm">
            分享工作台
          </Button>
          <Spacer x={0.5} />
          <Button variant="flat" size="sm">
            重置
          </Button>
        </CardFooter>
      </Card>

      <Spacer y={1} />

      <div className="nt-workspace">
        <Card shadow="sm" className="nt-panel">
          <CardHeader>参数</CardHeader>
          <CardBody>
            <Select label="缩进宽度" placeholder="选择">
              <SelectItem key="2">2 个空格</SelectItem>
              <SelectItem key="4">4 个空格</SelectItem>
              <SelectItem key="0">压缩 (Minify)</SelectItem>
            </Select>
            <Spacer y={1} />
            <Input label="搜索字段" placeholder="字段名/路径" variant="bordered" />
            <Spacer y={1} />
            <Button color="primary" fullWidth>
              主操作
            </Button>
            <Spacer y={0.5} />
            <Button variant="flat" fullWidth>
              次操作
            </Button>
          </CardBody>
        </Card>

        <Card shadow="sm" className="nt-editor">
          <CardHeader>输入</CardHeader>
          <CardBody>
            <Textarea placeholder="粘贴或输入内容..." minRows={12} variant="bordered" />
          </CardBody>
        </Card>

        <Card shadow="sm" className="nt-editor">
          <CardHeader>输出</CardHeader>
          <CardBody>
            <Textarea placeholder="输出结果..." minRows={12} variant="flat" isReadOnly />
          </CardBody>
        </Card>
      </div>
    </>
  );
}
