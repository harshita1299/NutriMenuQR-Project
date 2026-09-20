import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Dumbbell, Flame, Scale } from "lucide-react";
import { Scene, MenuNav } from "@/components/Chrome";
import { HEALTHY_MENU, GOAL_LABELS, type Goal } from "@/data/menu";

export const Route = createFileRoute("/healthy")({
  head: () => ({
    meta: [
      { title: "Healthy Menu — Verde Bistro" },
      {
        name: "description",
        content:
          "Healthier dishes with calories, protein, carbs, fats and goal tags for gym, weight management and low-calorie diets.",
      },
      { property: "og:title", content: "Healthy Menu — Verde Bistro" },
      {
        property: "og:description",
        content:
          "Healthier dishes with calories, protein, carbs, fats and goal tags for gym, weight management and low-calorie diets.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HealthyMenuPage,
});

const GOAL_ICONS: Record<Goal, typeof Dumbbell> = {
  "high-protein": Dumbbell,
  "low-calorie": Flame,
  "weight-management": Scale,
};

const GOAL_STYLES: Record<Goal, string> = {
  "high-protein": "bg-mint/10 text-mintdark",
  "low-calorie": "bg-ice/10 text-ice",
  "weight-management": "bg-ambergoal/15 text-ambergoal",
};

const FILTERS = ["all", "high-protein", "low-calorie", "weight-management"] as const;
type Filter = (typeof FILTERS)[number];

function HealthyMenuPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const items =
    filter === "all"
      ? HEALTHY_MENU
      : HEALTHY_MENU.filter((i) => i.goals.includes(filter));

  return (
    <Scene>
      <MenuNav
        title="Healthy Menu"
        subtitle="Nutrition & goal tags per serving"
        accent
      />

      {/* Goal filter tabs */}
      <div className="rise-in sticky top-3 z-10 mt-5 [animation-delay:60ms]">
        <div className="frost-soft flex gap-2 overflow-x-auto rounded-full p-1.5 [scrollbar-width:none]">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                filter === f
                  ? "bg-mint text-white"
                  : "text-inksoft hover:text-ink"
              }`}
            >
              {f === "all" ? "All" : GOAL_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 space-y-4 pb-8">
        {items.map((item, i) => (
          <article
            key={item.id}
            className="frost rise-in rounded-3xl p-4"
            style={{ animationDelay: `${100 + i * 60}ms` }}
          >
            <div className="flex gap-4">
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
                  <span className="font-display text-mintdark shrink-0 text-lg font-bold">
                    ${item.price}
                  </span>
                </div>
                <p className="text-inksoft mt-1 text-sm leading-snug">
                  {item.description}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {item.goals.map((g) => {
                    const Icon = GOAL_ICONS[g];
                    return (
                      <span
                        key={g}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${GOAL_STYLES[g]}`}
                      >
                        <Icon className="size-3.5" />
                        {GOAL_LABELS[g]}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Macro panel */}
            <div className="mt-3 grid grid-cols-5 gap-1 rounded-2xl bg-white/50 p-2.5 text-center">
              {[
                { v: `${item.kcal}`, l: "kcal", c: "text-ink" },
                { v: `${item.protein}g`, l: "protein", c: "text-mintdark" },
                { v: `${item.carbs}g`, l: "carbs", c: "text-ice" },
                { v: `${item.fat}g`, l: "fat", c: "text-ambergoal" },
                { v: `${item.fiber}g`, l: "fiber", c: "text-inksoft" },
              ].map((m) => (
                <div key={m.l}>
                  <p className={`font-display text-base font-bold leading-none ${m.c}`}>
                    {m.v}
                  </p>
                  <p className="text-inksoft mt-1 text-[10px] font-semibold uppercase tracking-wide">
                    {m.l}
                  </p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </Scene>
  );
}
