"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { Button, Card, CardBody, CardFooter, CardHeader, Input, Spacer, Textarea } from "@nextui-org/react";

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
      json: "JSON 处理",
      "letter-case": "大小写转换",
      image: "图片压缩",
      admin: "管理台"
    };
    return map[slug] ?? slug;
  }, [slug]);

  return (
    <>
      <Card>
        <CardHeader>{title}</CardHeader>
        <CardBody>输入参数与运行结果在下方分区展示。</CardBody>
        <CardFooter>
          <Button color="primary">运行</Button>
          <Spacer x={0.5} />
          <Button variant="bordered">复制结果</Button>
          <Spacer x={0.5} />
          <Button variant="flat">重置</Button>
        </CardFooter>
      </Card>

      <Spacer y={1} />

      <Card>
        <CardHeader>操作</CardHeader>
        <CardBody>
          <Input label="参数" placeholder="输入参数" />
          <Spacer y={1} />
          <Textarea label="输入" placeholder="输入内容" minRows={6} />
        </CardBody>
      </Card>

      <Spacer y={1} />

      <Card>
        <CardHeader>输出</CardHeader>
        <CardBody>
          <Textarea label="结果" placeholder="运行后输出结果" minRows={10} />
        </CardBody>
      </Card>
    </>
  );
}
