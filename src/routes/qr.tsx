import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { ChevronLeft, Download, Printer, QrCode } from "lucide-react";
import { Scene } from "@/components/Chrome";
import { RESTAURANT } from "@/data/menu";

export const Route = createFileRoute("/qr")({
  head: () => ({
    meta: [
      { title: "QR Codes & Table Signage — Verde Bistro" },
      {
        name: "description",
        content:
          "Generate downloadable QR codes for the menu and print-ready table signage.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "QR Codes & Table Signage — Verde Bistro" },
      {
        property: "og:description",
        content:
          "Generate downloadable QR codes for the menu and print-ready table signage.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: QrStudioPage,
});

const PUBLISHED_URL =
  "https://project--0eac5d96-8e13-55f6-83ea-dc66856757e2.lovable.app";

const SIZES = [
  { label: "512 px", value: 512 },
  { label: "1024 px", value: 1024 },
  { label: "2048 px (print)", value: 2048 },
];

function download(dataUrl: string, filename: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.click();
}

function QrStudioPage() {
  const [baseUrl, setBaseUrl] = useState(PUBLISHED_URL);
  const [size, setSize] = useState(1024);
  const [tableCount, setTableCount] = useState(8);
  const [mainQr, setMainQr] = useState<string | null>(null);
  const [tableQrs, setTableQrs] = useState<string[]>([]);

  const menuUrl = useMemo(() => baseUrl.replace(/\/$/, ""), [baseUrl]);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(menuUrl, {
      width: size,
      margin: 2,
      color: { dark: "#0f1b2d", light: "#ffffff" },
    }).then((url) => {
      if (!cancelled) setMainQr(url);
    });
    return () => {
      cancelled = true;
    };
  }, [menuUrl, size]);

  useEffect(() => {
    let cancelled = false;
    const count = Math.min(Math.max(tableCount, 1), 40);
    Promise.all(
      Array.from({ length: count }, (_, i) =>
        QRCode.toDataURL(`${menuUrl}/?table=${i + 1}`, {
          width: 800,
          margin: 1,
          color: { dark: "#0f1b2d", light: "#ffffff" },
        }),
      ),
    ).then((urls) => {
      if (!cancelled) setTableQrs(urls);
    });
    return () => {
      cancelled = true;
    };
  }, [menuUrl, tableCount]);

  return (
    <Scene>
      {/* Screen UI (hidden when printing) */}
      <div className="no-print">
        <div className="rise-in flex items-center gap-3">
          <Link
            to="/"
            aria-label="Back to menu"
            className="frost-soft text-ink grid size-10 place-items-center rounded-full"
          >
            <ChevronLeft className="size-5" />
          </Link>
          <div className="flex-1">
            <p className="font-display text-ink text-2xl font-bold leading-none">
              QR Studio
            </p>
            <p className="text-inksoft mt-1 text-xs font-medium">
              Downloadable QR codes &amp; table signage
            </p>
          </div>
          <span className="bg-ice/10 text-ice grid size-10 place-items-center rounded-full">
            <QrCode className="size-5" />
          </span>
        </div>

        {/* Settings */}
        <section className="frost rise-in mt-5 rounded-3xl p-5 [animation-delay:60ms]">
          <label className="text-ink text-sm font-semibold" htmlFor="menu-url">
            Menu URL
          </label>
          <input
            id="menu-url"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            className="text-ink mt-2 w-full rounded-xl border border-input bg-white/70 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="text-inksoft mt-2 text-xs">
            This is your published address — it goes live once you publish the
            app. Each table QR adds its table number automatically.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <label
                className="text-ink text-sm font-semibold"
                htmlFor="qr-size"
              >
                Download size
              </label>
              <select
                id="qr-size"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="text-ink mt-2 w-full rounded-xl border border-input bg-white/70 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                {SIZES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                className="text-ink text-sm font-semibold"
                htmlFor="table-count"
              >
                Number of tables
              </label>
              <input
                id="table-count"
                type="number"
                min={1}
                max={40}
                value={tableCount}
                onChange={(e) => setTableCount(Number(e.target.value))}
                className="text-ink mt-2 w-full rounded-xl border border-input bg-white/70 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </section>

        {/* Main QR */}
        <section className="frost rise-in mt-5 rounded-3xl p-5 [animation-delay:120ms]">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-ink text-lg font-bold">
              Master QR code
            </h2>
            <span className="text-inksoft text-xs">Opens menu choice</span>
          </div>
          <div className="mt-4 flex flex-col items-center">
            {mainQr && (
              <img
                src={mainQr}
                alt="QR code linking to the menu"
                className="w-48 rounded-2xl border border-input bg-white p-3"
              />
            )}
            <p className="text-inksoft mt-3 break-all text-center text-xs">
              {menuUrl}
            </p>
            <button
              onClick={() =>
                mainQr && download(mainQr, `verde-bistro-menu-qr-${size}px.png`)
              }
              className="bg-ink text-primary-foreground mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition hover:opacity-90"
            >
              <Download className="size-4" />
              Download PNG
            </button>
          </div>
        </section>

        {/* Signage header + print button */}
        <section className="frost-soft rise-in mt-5 rounded-3xl p-5 [animation-delay:180ms]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-ink text-lg font-bold">
                Table signage
              </h2>
              <p className="text-inksoft mt-1 text-xs">
                Print-ready cards, one per table. Best on A4, 2 cards per row.
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="bg-mint flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <Printer className="size-4" />
              Print
            </button>
          </div>
        </section>
      </div>

      {/* Printable signage (visible on screen as preview, only thing printed) */}
      <div className="print-area mt-5 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2">
        {tableQrs.map((qr, i) => (
          <div
            key={i}
            className="signage-card rise-in flex flex-col items-center rounded-3xl border-2 border-ink bg-white p-6 text-center"
            style={{ animationDelay: `${220 + i * 40}ms` }}
          >
            <p className="font-display text-ink text-xl font-bold tracking-tight">
              {RESTAURANT.name}
            </p>
            <p className="text-inksoft mt-0.5 text-[11px] font-medium uppercase tracking-[0.2em]">
              Scan to view our menu
            </p>
            <img
              src={qr}
              alt={`QR code for table ${i + 1}`}
              className="mt-4 w-40"
            />
            <p className="font-display text-ink mt-4 text-2xl font-bold">
              Table {i + 1}
            </p>
            <p className="text-inksoft mt-1 text-xs">
              Normal &amp; healthy menus · No app needed
            </p>
            <button
              onClick={() => download(qr, `table-${i + 1}-qr.png`)}
              className="no-print text-ice mt-3 inline-flex items-center gap-1.5 text-xs font-semibold"
            >
              <Download className="size-3.5" />
              Download this QR
            </button>
          </div>
        ))}
      </div>
    </Scene>
  );
}
