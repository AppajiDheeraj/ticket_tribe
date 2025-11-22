"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { PanelLeftCloseIcon, PanelLeftIcon, SearchIcon } from "lucide-react";
import { DashboardCommand } from "./dashboard-command";
import { useEffect, useState } from "react";

export const DashboardNav = () => {
  const { state, toggleSidebar, isMobile } = useSidebar();
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <DashboardCommand open={commandOpen} setOpen={setCommandOpen} />

      <nav className="flex items-center gap-3 px-4 py-3 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        {/* Sidebar Toggle */}
        <Button
          className="size-9"
          variant="outline"
          onClick={toggleSidebar}
        >
          {(state === "collapsed" || isMobile) ? (
            <PanelLeftIcon className="size-4" />
          ) : (
            <PanelLeftCloseIcon className="size-4" />
          )}
        </Button>

        {/* Search Bar Button */}
        <Button
          className="h-9 w-[240px] justify-start font-normal text-muted-foreground bg-white hover:bg-muted"
          variant="outline"
          size="sm"
          onClick={() => setCommandOpen(true)}
        >
          <SearchIcon className="size-4" />
          Search
          <kbd className="ml-auto pointer-events-none inline-flex items-center gap-1 rounded bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">&#8984;</span>K
          </kbd>
        </Button>
      </nav>
    </>
  );
};
