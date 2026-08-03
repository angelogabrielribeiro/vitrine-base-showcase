import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface MobileMenuState {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

const Ctx = createContext<MobileMenuState>({ menuOpen: false, setMenuOpen: () => {} });
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Coordena menu flutuante e FAB do WhatsApp (o FAB some com o menu aberto). */
export function MobileMenuProvider({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const root = document.documentElement;
    if (menuOpen) root.dataset.mobileMenuOpen = "true";
    else delete root.dataset.mobileMenuOpen;

    return () => {
      delete root.dataset.mobileMenuOpen;
    };
  }, [menuOpen]);

  const value = useMemo(() => ({ menuOpen, setMenuOpen }), [menuOpen]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useMobileMenuState() {
  return useContext(Ctx);
}
