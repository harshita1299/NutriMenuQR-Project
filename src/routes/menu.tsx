import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Scene, MenuNav } from "@/components/Chrome";
import { NORMAL_MENU } from "@/data/menu";
import { useTrackScan } from "@/lib/track";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Normal Menu — Verde Bistro" },
      {
        name: "description",
        content:
          "Our full classic menu: signature dishes with photos, prices and descriptions.",
      },
      { property: "og:title", content: "Normal Menu — Verde Bistro" },
      {
        property: "og:description",
        content:
          "Our full classic menu: signature dishes with photos, prices and descriptions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NormalMenuPage,
});

const CATEGORIES = ["All", "Starters", "Mains", "Desserts"] as const;

function NormalMenuPage() {
  useTrackScan("normal");
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const items =
    cat === "All" ? NORMAL_MENU : NORMAL_MENU.filter((i) => i.category === cat);

  return (
    <Scene>
      <MenuNav title="Normal Menu" subtitle={`${NORMAL_MENU.length} dishes · updated today`} />

      {/* Category tabs */}
      <div className="rise-in sticky top-3 z-10 mt-5 [animation-delay:60ms]">
        <div className="frost-soft flex gap-2 overflow-x-auto rounded-full p-1.5 [scrollbar-width:none]">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                cat === c
                  ? "bg-ink text-primary-foreground"
                  : "text-inksoft hover:text-ink"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 space-y-4 pb-8">
        {items.map((item, i) => (
          <article
            key={item.id}
            className="frost rise-in flex gap-4 rounded-3xl p-4"
            style={{ animationDelay: `${100 + i * 60}ms` }}
          >
            <img
              src={item.image}
              alt={item.name}
              width={816}
              height={816}
              loading="lazy"
              className="size-24 shrink-0 rounded-2xl object-cover"
            />
            <div className="min-w-0 flex-1 py-0.5">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-display text-ink text-lg font-bold leading-tight">
                  {item.name}
                </h3>
                <span className="font-display text-ice shrink-0 text-lg font-bold">
                  ${item.price}
                </span>
              </div>
              <p className="text-inksoft mt-1 text-sm leading-snug">
                {item.description}
              </p>
              <span className="bg-frostdeep text-inksoft mt-2 inline-block rounded-full px-2.5 py-1 text-xs font-semibold">
                {item.category}
              </span>
            </div>
          </article>
        ))}
      </div>
    </Scene>
  );
}
