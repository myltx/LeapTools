"use client";

import NextLink from "next/link";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Spacer,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from "@nextui-org/react";

export default function Page() {
  const tools = [
    { slug: "regex", title: "正则调试", description: "快速测试表达式与匹配结果。", cta: "打开" },
    { slug: "sql", title: "SQL 格式化", description: "一键格式化与整理 SQL。", cta: "打开" },
    { slug: "json", title: "JSON 处理", description: "格式化、压缩、排序与校验。", cta: "打开" },
    { slug: "letter-case", title: "大小写转换", description: "英文大小写与格式互转。", cta: "打开" },
    { slug: "image", title: "图片压缩", description: "批量压缩与导出图片。", cta: "打开" },
    { slug: "admin", title: "管理台", description: "站点管理与配置入口。", cta: "进入" }
  ] as const;

  const grid = [tools.slice(0, 3), tools.slice(3, 6)] as const;

  return (
    <>
      <Card>
        <CardHeader>工具工作台</CardHeader>
        <CardBody>
          <Input label="筛选工具" placeholder="输入关键词" />
        </CardBody>
      </Card>

      <Spacer y={1} />

      <Table aria-label="工具列表">
        <TableHeader>
          <TableColumn>工具</TableColumn>
          <TableColumn>工具</TableColumn>
          <TableColumn>工具</TableColumn>
        </TableHeader>
        <TableBody>
          {grid.map((row, idx) => (
            <TableRow key={String(idx)}>
              {row.map((t) => (
                <TableCell key={t.slug}>
                  <Card>
                    <CardHeader>{t.title}</CardHeader>
                    <CardBody>{t.description}</CardBody>
                    <CardFooter>
                      <Button as={NextLink} href={`/tools/${t.slug}`} color="primary">
                        {t.cta}
                      </Button>
                    </CardFooter>
                  </Card>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
