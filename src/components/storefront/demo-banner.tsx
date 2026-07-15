import { AlertTriangle } from "lucide-react";
import { DEMO_NOTICE } from "@/lib/demo-mode";

export function DemoBanner() {
  return (
    <div className="bg-amber-500/15 text-amber-900 dark:text-amber-100">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2 text-xs">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <span>{DEMO_NOTICE}</span>
      </div>
    </div>
  );
}
