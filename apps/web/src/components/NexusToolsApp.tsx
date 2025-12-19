"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppHeader } from "@/components/NexusToolsHeader";
import { AppSidebar } from "@/components/NexusToolsSidebar";
import { CommandPalette } from "@/components/NexusToolsCommandPalette";
import { HomeView } from "@/components/NexusToolsHomeView";
import { WorkspaceView } from "@/components/NexusToolsWorkspaceView";

export type NexusView = "home" | "workspace";

export function NexusToolsApp() {
  const [view, setView] = useState<NexusView>("home");
  const [paletteOpen, setPaletteOpen] = useState(false);

  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);

  const showView = useCallback((nextView: NexusView) => setView(nextView), []);

  const canRunWorkspaceAction = useMemo(() => view === "workspace", [view]);
  const runWorkspaceRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const metaOrCtrl = e.metaKey || e.ctrlKey;

      if (metaOrCtrl && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setPaletteOpen(true);
        return;
      }

      if (e.key === "Escape") {
        setPaletteOpen(false);
        return;
      }

      if (metaOrCtrl && e.key === "Enter") {
        if (!canRunWorkspaceAction) return;
        runWorkspaceRef.current?.();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [canRunWorkspaceAction]);

  return (
    <>
      <div className="app-shell">
        <AppHeader onOpenPalette={openPalette} />
        <AppSidebar view={view} onNavigate={showView} />

        <main className="app-main">
          <section className={`view-pane ${view === "home" ? "active" : ""}`} aria-hidden={view !== "home"}>
            <HomeView onOpenWorkspace={() => showView("workspace")} />
          </section>

          <section
            className={`view-pane ${view === "workspace" ? "active" : ""}`}
            aria-hidden={view !== "workspace"}
          >
            <WorkspaceView
              onRequestRun={(fn) => {
                runWorkspaceRef.current = fn;
              }}
            />
          </section>
        </main>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={closePalette}
        onSelect={(id) => {
          if (id === "workspace.json") showView("workspace");
          closePalette();
        }}
      />
    </>
  );
}
