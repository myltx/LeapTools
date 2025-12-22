"use client";

import NextLink from "next/link";
import { Button, Card, CardBody, CardHeader, Spacer } from "@nextui-org/react";

export default function NotFound() {
  return (
    <Card>
      <CardHeader>404</CardHeader>
      <CardBody>
        页面不存在。
        <Spacer y={1} />
        <Button as={NextLink} href="/" variant="bordered">
          返回首页
        </Button>
      </CardBody>
    </Card>
  );
}
