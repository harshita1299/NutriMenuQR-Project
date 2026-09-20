import { Link } from "@tanstack/react-router";
import { ChevronLeft, Leaf } from "lucide-react";
import { RESTAURANT } from "@/data/menu";
import type { ReactNode } from "react";

export function Scene({ children }: { children: ReactNode }) {
  return (
    <div className="bg-scene relative min-h-screen w-full overflow-x-hidden">
      <div className="relative mx-auto w-full max-w-md px-5 py-6 sm:max-w-2xl">
        {children}
      </div>
    </div>
  );
}

export function Header({ table = "Table 12" }: { table?: string }) {
  return (
    <header className="frost rise-in flex items-center justify-between rounded-3xl px-5 py-4">
      <Link to="/" className="flex items-center gap-3">
        <div className="bg-ink text-primary-foreground font-display grid size-11 place-items-center rounded-2xl text-lg font-bold">
          V
        </div>
        <div>
          <p className="font-display text-ink text-lg font-semibold leading-tight">
            {RESTAURANT.name}
          </p>
          <p className="text-inksoft text-xs">{RESTAURANT.tagline}</p>
        </div>
      </Link>
      <div className="flex items-center gap-2">
        <span className="text-inksoft text-xs font-medium">{table}</span>
        <span className="bg-mint size-2 rounded-full" />
      </div>
    </header>
  );
}

export function MenuNav({
  title,
  subtitle,
  accent,
}: {
  title: string;
  subtitle: string;
  accent?: boolean;
}) {
  return (
    <div className="rise-in flex items-center gap-3 pt-6">
      <Link
        to="/"
        aria-label="Back to menu choice"
        className="frost-soft text-ink grid size-10 place-items-center rounded-full"
      >
        <ChevronLeft className="size-5" />
      </Link>
      <div className="flex-1">
        <p className="font-display text-ink text-2xl font-bold leading-none">
          {title}
        </p>
        <p className="text-inksoft mt-1 text-xs font-medium">{subtitle}</p>
      </div>
      {accent && (
        <span className="bg-mint/15 text-mintdark grid size-10 place-items-center rounded-full">
          <Leaf className="size-5" />
        </span>
      )}
    </div>
  );
}
