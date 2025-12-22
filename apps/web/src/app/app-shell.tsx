"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Kbd,
  Listbox,
  ListboxItem,
  ListboxSection,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  ScrollShadow,
  Spacer
} from "@nextui-org/react";
import { useTheme } from "next-themes";

type NavItem = {
  key: string;
  label: string;
  href: string;
  icon: string;
  tag?: string;
};

const NAV_SECTIONS: Array<{ title: string; items: NavItem[] }> = [
  {
    title: "概览",
    items: [
      { key: "home", label: "工作台首页", href: "/", icon: "🏠" },
      { key: "favorites", label: "收藏夹", href: "/tools/favorites", icon: "⭐️", tag: "Soon" },
      { key: "recent", label: "最近使用", href: "/tools/recent", icon: "🕒", tag: "Soon" }
    ]
  },
  {
    title: "工程开发",
    items: [
      { key: "json", label: "JSON 工作台", href: "/tools/json", icon: "💎" },
      { key: "sql", label: "SQL 格式化", href: "/tools/sql", icon: "📜" },
      { key: "regex", label: "正则调试", href: "/tools/regex", icon: "🧠" },
      { key: "jwt", label: "JWT 调试器", href: "/tools/jwt", icon: "🔐", tag: "Soon" },
      { key: "base64", label: "Base64 编解码", href: "/tools/base64", icon: "🧩", tag: "Soon" }
    ]
  },
  {
    title: "媒体资产",
    items: [
      { key: "image", label: "无损图片压缩", href: "/tools/image", icon: "🖼️" },
      { key: "svg", label: "SVG 优化", href: "/tools/svg", icon: "🧬", tag: "Soon" }
    ]
  }
];

const PALETTE_ITEMS: NavItem[] = [
  { key: "palette-json", label: "JSON 工作台", href: "/tools/json", icon: "💎" },
  { key: "palette-image", label: "无损图片压缩", href: "/tools/image", icon: "🖼️" },
  { key: "palette-sql", label: "SQL 格式化", href: "/tools/sql", icon: "📜" },
  { key: "palette-regex", label: "正则调试", href: "/tools/regex", icon: "🧠" }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState("");

  const activeHref = useMemo(() => {
    if (!pathname) return "/";
    if (pathname === "/") return "/";
    return pathname.startsWith("/tools/") ? pathname : "/";
  }, [pathname]);

  const onOpenPalette = useCallback(() => setPaletteOpen(true), []);
  const onClosePalette = useCallback(() => {
    setPaletteOpen(false);
    setQuery("");
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isCmdK = (e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K");
      if (isCmdK) {
        e.preventDefault();
        setPaletteOpen(true);
        return;
      }
      if (e.key === "Escape") {
        setPaletteOpen(false);
        return;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filteredPaletteItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PALETTE_ITEMS;
    return PALETTE_ITEMS.filter((item) => item.label.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="nt-shell">
      <Navbar isBordered>
        <NavbarBrand>
          <Button as={NextLink} href="/" variant="light">
            NexusTools Pro
          </Button>
        </NavbarBrand>

        <NavbarContent justify="center">
          <NavbarItem>
            <Input
              label="搜索"
              placeholder="搜索工具或功能..."
              variant="bordered"
              onFocus={onOpenPalette}
              onClick={onOpenPalette}
              value={query}
              onValueChange={setQuery}
              endContent={
                <Kbd keys={["command"]}>
                  K
                </Kbd>
              }
            />
          </NavbarItem>
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem>
            <Button isIconOnly variant="flat" aria-label="通知">
              🔔
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Dropdown>
              <DropdownTrigger>
                <Button variant="flat" aria-label="主题">
                  {theme === "dark" ? "深色" : theme === "light" ? "浅色" : "系统"}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="主题"
                selectionMode="single"
                selectedKeys={new Set([theme ?? "system"])}
                disallowEmptySelection
                onAction={(key) => setTheme(String(key))}
              >
                <DropdownItem key="light">浅色</DropdownItem>
                <DropdownItem key="dark">深色</DropdownItem>
                <DropdownItem key="system">系统</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
          <NavbarItem>
            <Avatar name="Designer" size="sm" />
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <div className="nt-body">
        <aside className="nt-sidebar">
          <ScrollShadow hideScrollBar>
            {NAV_SECTIONS.map((section) => (
              <Card key={section.title} className="nt-side-card" shadow="sm">
                <CardHeader className="nt-side-header">{section.title}</CardHeader>
                <CardBody>
                  <Listbox
                    aria-label={section.title}
                    selectionMode="single"
                    selectedKeys={new Set([activeHref])}
                    onAction={(key) => {
                      const href = String(key);
                      router.push(href);
                    }}
                  >
                    <ListboxSection>
                      {section.items.map((item) => (
                        <ListboxItem
                          key={item.href}
                          startContent={<span>{item.icon}</span>}
                          endContent={item.tag ? <Chip size="sm" variant="flat">{item.tag}</Chip> : null}
                        >
                          {item.label}
                        </ListboxItem>
                      ))}
                    </ListboxSection>
                  </Listbox>
                </CardBody>
              </Card>
            ))}

            <Spacer y={1} />

            <Card className="nt-side-card" shadow="sm">
              <CardBody>
                <Button as={NextLink} href="/tools/settings" variant="flat" fullWidth>
                  ⚙️ 全局设置
                </Button>
              </CardBody>
            </Card>
          </ScrollShadow>
        </aside>

        <main className="nt-main">{children}</main>
      </div>

      <Modal isOpen={paletteOpen} onOpenChange={(open) => (open ? setPaletteOpen(true) : onClosePalette())}>
        <ModalContent>
          <ModalHeader>搜索工具</ModalHeader>
          <ModalBody>
            <Input
              autoFocus
              label="命令"
              placeholder="键入工具名称或命令..."
              variant="bordered"
              value={query}
              onValueChange={setQuery}
            />
            <Spacer y={0.5} />
            <Listbox
              aria-label="建议工具"
              selectionMode="single"
              onAction={(key) => {
                const href = String(key);
                onClosePalette();
                router.push(href);
              }}
            >
              <ListboxSection title="建议工具">
                {filteredPaletteItems.map((item) => (
                  <ListboxItem key={item.href} startContent={<span>{item.icon}</span>}>
                    {item.label}
                  </ListboxItem>
                ))}
              </ListboxSection>
            </Listbox>
            <Spacer y={0.5} />
            <Card shadow="sm">
              <CardBody>
                <Button color="primary" onPress={() => setTheme(theme === "dark" ? "light" : "dark")}>
                  快速切换主题
                </Button>
              </CardBody>
            </Card>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
