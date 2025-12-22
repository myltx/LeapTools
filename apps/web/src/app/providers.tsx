"use client";

import type { ReactNode } from "react";
import NextLink from "next/link";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NextUIProvider,
  Spacer,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from "@nextui-org/react";
import { useRouter } from "next/navigation";

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();
  const navigate: (path: string, routerOptions: undefined) => void = (path) => {
    router.push(path);
  };

  return (
    <NextUIProvider navigate={navigate}>
      <Navbar>
        <NavbarBrand>
          <Link as={NextLink} href="/">
            LeapTools
          </Link>
        </NavbarBrand>
        <NavbarContent justify="center">
          <NavbarItem>
            <Input label="搜索" placeholder="搜索工具" />
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            <Dropdown>
              <DropdownTrigger>
                <Button variant="flat">主题</Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="主题">
                <DropdownItem key="light">浅色</DropdownItem>
                <DropdownItem key="dark">深色</DropdownItem>
                <DropdownItem key="system">系统</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <Spacer y={1} />

      <Table aria-label="应用布局">
        <TableHeader>
          <TableColumn>导航</TableColumn>
          <TableColumn>内容</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow key="layout">
            <TableCell>
              <Card>
                <CardHeader>工具分类</CardHeader>
                <CardBody>
                  <Button as={NextLink} href="/" color="primary" variant="flat" fullWidth>
                    首页
                  </Button>
                  <Spacer y={0.5} />
                  <Button as={NextLink} href="/tools/regex" variant="flat" fullWidth>
                    正则
                  </Button>
                  <Spacer y={0.5} />
                  <Button as={NextLink} href="/tools/sql" variant="flat" fullWidth>
                    SQL
                  </Button>
                  <Spacer y={0.5} />
                  <Button as={NextLink} href="/tools/letter-case" variant="flat" fullWidth>
                    大小写
                  </Button>
                  <Spacer y={0.5} />
                  <Button as={NextLink} href="/tools/json" variant="flat" fullWidth>
                    JSON
                  </Button>
                </CardBody>
                <CardFooter>
                  <Button as={NextLink} href="/tools/admin" variant="bordered" fullWidth>
                    管理台
                  </Button>
                </CardFooter>
              </Card>
            </TableCell>
            <TableCell>{children}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </NextUIProvider>
  );
}
