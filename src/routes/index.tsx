import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Dumbbell, Flame, Scale } from "lucide-react";
import { Scene, Header } from "@/components/Chrome";
import { useTrackScan } from "@/lib/track";
import tagliatelle from "@/assets/tagliatelle.jpg";
import salmonBowl from "@/assets/salmon-bowl.jpg";
import quinoaSalad from "@/assets/quinoa-salad.jpg";
import chickenPlate from "@/assets/chicken-plate.jpg";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): { table?: string } => {
    const t = typeof search["table"] === "string" ? search["table"].trim() : "";
    return t ? { table: t } : {};
  },
  head: () => ({
    meta: [
      { title: "Verde Bistro — Scan & Choose Your Menu" },
      {
        name: "description",
        content:
          "Scan the QR code at your table and choose between our Normal Menu and Healthy Menu with full nutrition info. No app needed.",
      },
      { property: "og:title", content: "Verde Bistro — Scan & Choose Your Menu" },
      {
        property: "og:description",
        content:
          "Choose between our Normal Menu and Healthy Menu with calories, macros and goal tags.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  const { table } = Route.useSearch();
  useTrackScan("choice", table);
  return (
    <Scene>
      <Header table={table ? `Table ${table}` : undefined} />

      <section className="mt-6 grid gap-5">
        {/* Normal menu choice */}
        <Link
          to="/menu"
          className="frost rise-in group relative block overflow-hidden rounded-[28px] p-7 [animation-delay:80ms]"
        >
          <div
            className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(59,130,246,0.4), transparent 70%)",
            }}
          />
          <span className="bg-ice/10 text-ice inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium">
            Classic
          </span>
          <h2 className="font-display text-ink mt-4 text-3xl font-bold">
            Normal Menu
          </h2>
          <p className="text-inksoft mt-2 text-sm">
            Full signature dishes with photos, prices and descriptions.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <img
              src={tagliatelle}
              alt="Truffle Tagliatelle"
              width={816}
              height={816}
              className="size-16 rounded-xl object-cover"
            />
            <div>
              <p className="text-ink text-sm font-semibold">Truffle Tagliatelle</p>
              <p className="text-inksoft text-xs">Creamy · $24</p>
            </div>
          </div>
          <span className="bg-ink text-primary-foreground mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition group-hover:opacity-90">
            Browse Normal Menu
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>

        {/* Healthy menu choice */}
        <Link
          to="/healthy"
          className="frost rise-in group relative block overflow-hidden rounded-[28px] p-7 [animation-delay:160ms]"
        >
          <div
            className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(16,185,129,0.45), transparent 70%)",
            }}
          />
          <span className="bg-mint/10 text-mintdark inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium">
            Wellness
          </span>
          <h2 className="font-display text-ink mt-4 text-3xl font-bold">
            Healthy Menu
          </h2>
          <p className="text-inksoft mt-2 text-sm">
            Macro breakdowns and goal tags for every dish.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="bg-mint/10 text-mintdark inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium">
              <Dumbbell className="size-3.5" /> Gym / High-protein
            </span>
            <span className="bg-mint/10 text-mintdark inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium">
              <Flame className="size-3.5" /> Low-calorie
            </span>
            <span className="bg-mint/10 text-mintdark inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium">
              <Scale className="size-3.5" /> Weight mgmt
            </span>
          </div>
          <span className="bg-mint mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition group-hover:opacity-90">
            Browse Healthy Menu
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
      </section>

      {/* Healthy highlights */}
      <section className="mt-6">
        <div className="frost-soft rise-in rounded-[28px] p-6 [animation-delay:240ms]">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-ink text-xl font-bold">
              Healthy highlights
            </h3>
            <span className="text-inksoft text-xs font-medium">Per serving</span>
          </div>
          <div className="mt-5 grid gap-4 grid-cols-1 min-[420px]:grid-cols-3">
            {[
              {
                img: salmonBowl,
                name: "Grilled Salmon Bowl",
                meta: "420 kcal · 38g protein",
                tag: "Gym / High-protein",
              },
              {
                img: quinoaSalad,
                name: "Quinoa Chickpea Salad",
                meta: "280 kcal · 12g protein",
                tag: "Low-calorie",
              },
              {
                img: chickenPlate,
                name: "Herb Chicken Plate",
                meta: "360 kcal · 42g protein",
                tag: "Weight mgmt",
              },
            ].map((h) => (
              <Link
                to="/healthy"
                key={h.name}
                className="rounded-2xl bg-white/50 p-4"
              >
                <img
                  src={h.img}
                  alt={h.name}
                  width={816}
                  height={816}
                  loading="lazy"
                  className="mb-3 aspect-square w-full rounded-xl object-cover"
                />
                <p className="text-ink text-sm font-semibold">{h.name}</p>
                <p className="text-inksoft mt-1 text-xs">{h.meta}</p>
                <span className="bg-mint/10 text-mintdark mt-2 inline-block rounded-md px-2 py-0.5 text-[11px] font-medium">
                  {h.tag}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <p className="text-inksoft rise-in mt-6 text-center text-xs [animation-delay:300ms]">
        No app download · No sign-up · Just scan &amp; browse
      </p>
      <p className="rise-in mt-2 text-center [animation-delay:320ms]">
        <Link
          to="/qr"
          className="text-inksoft text-xs font-medium underline-offset-2 hover:underline"
        >
          Staff: QR codes &amp; table signage
        </Link>
      </p>
    </Scene>
  );
}
