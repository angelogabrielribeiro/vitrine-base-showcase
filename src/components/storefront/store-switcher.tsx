import { Link } from "@tanstack/react-router";
import { LayoutGrid } from "lucide-react";
import { STORES } from "@/config/stores";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function StoreSwitcher({ currentSlug }: { currentSlug: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Trocar loja demonstrativa">
          <LayoutGrid className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Trocar demonstração</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {STORES.map((s) => (
          <DropdownMenuItem key={s.slug} asChild disabled={s.slug === currentSlug}>
            <Link to="/demo/$storeSlug" params={{ storeSlug: s.slug }}>
              <div>
                <div className="text-sm font-medium">{s.name}</div>
                <div className="text-xs text-muted-foreground">{s.tagline}</div>
              </div>
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/">Central Vitrine Base</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
