import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { BarChart3, Loader2, RefreshCw } from "lucide-react";
import { Scene, MenuNav } from "@/components/Chrome";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Scan Analytics — Verde Bistro" },
      {
        name: "description",
        content:
          "Staff dashboard showing QR menu scans by table, date, menu type and device.",
      },
      { property: "og:title", content: "Scan Analytics — Verde Bistro" },
      {
        property: "og:description",
        content: "See how guests use the QR menu: tables, days, menu type and devices.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AnalyticsPage,
});

type Scan = {
  created_at: string;
  table_label: string;
  menu_type: string;
  device: string;
  session_id: string | null;
};

const RANGES = [
  { label: "7 days", days: 7 },
  { label: "30 days", days: 30 },
  { label: "90 days", days: 90 },
] as const;

const MENU_LABEL: Record<string, string> = {
  choice: "Scan screen",
  normal: "Normal Menu",
  healthy: "Healthy Menu",
};

const DEVICE_LABEL: Record<string, string> = {
  mobile: "Phone",
  tablet: "Tablet",
  desktop: "Computer",
  unknown: "Unknown",
};

function tally(rows: Scan[], pick: (r: Scan) => string) {
  const map = new Map<string, number>();
  for (const r of rows) map.set(pick(r), (map.get(pick(r)) ?? 0) + 1);
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

function Bars({
  data,
  labeler,
  tone = "ink",
  empty,
}: {
  data: [string, number][];
  labeler?: (k: string) => string;
  tone?: "ink" | "mint";
  empty: string;
}) {
  const max = Math.max(1, ...data.map((d) => d[1]));
  if (data.length === 0)
    return <p className="text-inksoft py-4 text-sm">{empty}</p>;
  return (
    <div className="mt-4 space-y-3">
      {data.map(([key, count]) => (
        <div key={key}>
          <div className="mb-1 flex items-baseline justify-between">
            <span className="text-ink text-sm font-medium">
              {labeler ? labeler(key) : key}
            </span>
            <span className="text-inksoft text-xs font-semibold">{count}</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/50">
            <div
              className={`h-full rounded-full ${tone === "mint" ? "bg-mint" : "bg-ink"}`}
              style={{ width: `${Math.round((count / max) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function tableSortKey(label: string) {
  const n = Number(label.replace(/\D+/g, ""));
  return Number.isFinite(n) && label !== "Unknown" ? n : 9999;
}

function AnalyticsPage() {
  const [days, setDays] = useState<number>(7);
  const [rows, setRows] = useState<Scan[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let alive = true;
    setRows(null);
    setError(null);
    const since = new Date(Date.now() - days * 86400000).toISOString();
    void supabase
      .from("menu_scans")
      .select("created_at, table_label, menu_type, device, session_id")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(5000)
      .then(({ data, error: err }) => {
        if (!alive) return;
        if (err) setError(err.message);
        else setRows((data ?? []) as Scan[]);
      });
    return () => {
      alive = false;
    };
  }, [days, nonce]);

  const stats = useMemo(() => {
    const r = rows ?? [];
    const byDayMap = new Map<string, number>();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      byDayMap.set(d.toISOString().slice(0, 10), 0);
    }
    for (const s of r) {
      const k = s.created_at.slice(0, 10);
      if (byDayMap.has(k)) byDayMap.set(k, (byDayMap.get(k) ?? 0) + 1);
    }
    const byTable = tally(r, (s) => s.table_label).sort(
      (a, b) => tableSortKey(a[0]) - tableSortKey(b[0]),
    );
    const sessions = new Set(r.map((s) => s.session_id ?? "?")).size;
    const healthy = r.filter((s) => s.menu_type === "healthy").length;
    const normal = r.filter((s) => s.menu_type === "normal").length;
    const opened = healthy + normal;
    return {
      total: r.length,
      sessions,
      byDay: [...byDayMap.entries()],
      byTable,
      byMenu: tally(r, (s) => s.menu_type),
      byDevice: tally(r, (s) => s.device),
      healthyShare: opened ? Math.round((healthy / opened) * 100) : 0,
    };
  }, [rows, days]);

  const maxDay = Math.max(1, ...stats.byDay.map((d) => d[1]));

  return (
    <Scene>
      <MenuNav title="Scan Analytics" subtitle="How guests are using the menu" />

      {/* Range tabs */}
      <div className="rise-in mt-5 flex items-center gap-2 [animation-delay:60ms]">
        <div className="frost-soft flex flex-1 gap-2 rounded-full p-1.5">
          {RANGES.map((r) => (
            <button
              key={r.days}
              onClick={() => setDays(r.days)}
              className={`flex-1 rounded-full px-3 py-2 text-sm font-semibold transition ${
                days === r.days
                  ? "bg-ink text-primary-foreground"
                  : "text-inksoft hover:text-ink"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setNonce((n) => n + 1)}
          aria-label="Refresh"
          className="frost-soft text-ink grid size-11 shrink-0 place-items-center rounded-full"
        >
          <RefreshCw className="size-4" />
        </button>
      </div>

      {error && (
        <p className="frost mt-5 rounded-2xl p-4 text-sm text-red-600">{error}</p>
      )}

      {rows === null && !error && (
        <div className="text-inksoft flex items-center gap-2 py-16 text-sm">
          <Loader2 className="size-4 animate-spin" /> Loading scan data…
        </div>
      )}

      {rows !== null && (
        <>
          {/* Summary */}
          <section className="rise-in mt-5 grid grid-cols-3 gap-3 [animation-delay:100ms]">
            {[
              { k: "Total scans", v: stats.total },
              { k: "Guest sessions", v: stats.sessions },
              { k: "Chose healthy", v: `${stats.healthyShare}%` },
            ].map((c) => (
              <div key={c.k} className="frost rounded-2xl px-3 py-4 text-center">
                <p className="font-display text-ink text-2xl font-bold">{c.v}</p>
                <p className="text-inksoft mt-1 text-[11px] font-medium">{c.k}</p>
              </div>
            ))}
          </section>

          {/* By date */}
          <section className="frost rise-in mt-5 rounded-[28px] p-6 [animation-delay:140ms]">
            <div className="flex items-center gap-2">
              <BarChart3 className="text-inksoft size-4" />
              <h3 className="font-display text-ink text-lg font-bold">Scans by date</h3>
            </div>
            <div className="mt-5 flex h-36 items-end gap-1.5">
              {stats.byDay.map(([day, count]) => (
                <div key={day} className="flex flex-1 flex-col items-center gap-1.5">
                  <div className="flex h-28 w-full items-end">
                    <div
                      title={`${day}: ${count}`}
                      className="bg-mint w-full rounded-t-md"
                      style={{ height: `${Math.max(3, (count / maxDay) * 100)}%` }}
                    />
                  </div>
                  <span className="text-inksoft text-[9px]">
                    {new Date(day + "T00:00:00").getDate()}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Menu type */}
          <section className="frost rise-in mt-5 rounded-[28px] p-6 [animation-delay:180ms]">
            <h3 className="font-display text-ink text-lg font-bold">By menu type</h3>
            <Bars
              data={stats.byMenu}
              labeler={(k) => MENU_LABEL[k] ?? k}
              tone="mint"
              empty="No menu views yet."
            />
          </section>

          {/* Table */}
          <section className="frost rise-in mt-5 rounded-[28px] p-6 [animation-delay:220ms]">
            <h3 className="font-display text-ink text-lg font-bold">By table</h3>
            <Bars data={stats.byTable} empty="No table scans yet." />
          </section>

          {/* Device */}
          <section className="frost rise-in mt-5 rounded-[28px] p-6 [animation-delay:260ms]">
            <h3 className="font-display text-ink text-lg font-bold">By device</h3>
            <Bars
              data={stats.byDevice}
              labeler={(k) => DEVICE_LABEL[k] ?? k}
              tone="mint"
              empty="No device data yet."
            />
          </section>

          <p className="rise-in mb-8 mt-6 text-center [animation-delay:300ms]">
            <Link
              to="/qr"
              className="text-inksoft text-xs font-medium underline-offset-2 hover:underline"
            >
              QR codes &amp; table signage
            </Link>
          </p>
        </>
      )}
    </Scene>
  );
}
