"use client";

import { useMemo, useState } from "react";
import { formatNumber } from "@leaptools/utils";
import { Button } from "@/ui";

export function ClientCounter() {
  const [count, setCount] = useState(0);
  const label = useMemo(() => formatNumber(count), [count]);
  const electron = typeof window !== "undefined" ? window.electron : undefined;

  return (
    <div className="stack">
      <div className="muted">当前计数：{label}</div>
      <div className="row">
        <Button onClick={() => setCount((v) => v - 1)} variant="secondary">
          -1
        </Button>
        <Button onClick={() => setCount((v) => v + 1)}>+1</Button>
      </div>

      {electron ? (
        <div className="stack">
          <div className="muted">Electron 窗口控制</div>
          <div className="row">
            <Button onClick={() => void electron.window.minimize()} variant="secondary">
              最小化
            </Button>
            <Button onClick={() => void electron.window.maximize()} variant="secondary">
              最大化/还原
            </Button>
            <Button onClick={() => void electron.window.close()} variant="secondary">
              关闭
            </Button>
            <Button onClick={() => void electron.openExternal("https://nextjs.org/")} variant="secondary">
              打开外部链接
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
