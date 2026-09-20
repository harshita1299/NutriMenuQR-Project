import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type MenuType = "choice" | "normal" | "healthy";

const TABLE_KEY = "vb.table";

export function rememberTable(table?: string | undefined) {
  if (typeof window === "undefined" || !table) return;
  try {
    window.sessionStorage.setItem(TABLE_KEY, table);
  } catch {
    /* ignore */
  }
}

function currentTable(): string {
  if (typeof window === "undefined") return "Unknown";
  try {
    return window.sessionStorage.getItem(TABLE_KEY) || "Unknown";
  } catch {
    return "Unknown";
  }
}

function detectDevice(): string {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua)) return "tablet";
  if (/Mobi|Android|iPhone|iPod/i.test(ua)) return "mobile";
  return "desktop";
}

function sessionId(): string {
  if (typeof window === "undefined") return "ssr";
  try {
    let id = window.sessionStorage.getItem("vb.session");
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36);
      window.sessionStorage.setItem("vb.session", id);
    }
    return id;
  } catch {
    return "anon";
  }
}

/** Records one view of a menu screen. Fire-and-forget; never blocks the UI. */
export function useTrackScan(menuType: MenuType, table?: string | undefined) {
  useEffect(() => {
    rememberTable(table);
    const payload = {
      menu_type: menuType,
      table_label: currentTable(),
      device: detectDevice(),
      session_id: sessionId(),
    };
    void supabase
      .from("menu_scans")
      .insert(payload)
      .then(({ error }) => {
        if (error) console.warn("scan log failed", error.message);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuType]);
}
