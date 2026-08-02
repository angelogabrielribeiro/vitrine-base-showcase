import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

interface MobileMenuState {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

const Ctx = createContext<MobileMenuState>({ menuOpen: false, setMenuOpen: () => {} });

/** Coordena menu flutuante e FAB do WhatsApp (o FAB some com o menu aberto). */
export function MobileMenuProvider({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const value = useMemo(() => ({ menuOpen, setMenuOpen }), [menuOpen]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useMobileMenuState() {
  return useContext(Ctx);
}
