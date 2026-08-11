import { Menu, MessageCircle, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { type PropsWithChildren, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { siteConfig } from "../config/site";
import { openGeneralWhatsapp } from "../lib/whatsapp";

const nav = [
  ["/", "Início"],
  ["/servicos", "Serviços"],
  ["/sobre", "Sobre"],
  ["/contato", "Contato"],
] as const;

export function Shell({ children }: PropsWithChildren) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location.pathname]);

  return (
    <div className="site-shell">
      <header className="topbar">
        <NavLink to="/" className="brand" aria-label="Página inicial">
          <span className="brand-mark">AD</span>
          <span>
            <strong>{siteConfig.professionalName}</strong>
            <small>{siteConfig.role}</small>
          </span>
        </NavLink>

        <nav className="desktop-nav" aria-label="Navegação principal">
          {nav.map(([href, label]) => (
            <NavLink key={href} to={href} className={({ isActive }) => (isActive ? "active" : "")}>
              {label}
            </NavLink>
          ))}
          <button className="nav-cta" onClick={openGeneralWhatsapp}>
            <MessageCircle size={16} /> Solicitar atendimento
          </button>
        </nav>

        <button className="menu-button" onClick={() => setOpen((v) => !v)} aria-label="Abrir menu">
          {open ? <X /> : <Menu />}
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.nav
            className="mobile-nav"
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            {nav.map(([href, label]) => (
              <NavLink key={href} to={href}>{label}</NavLink>
            ))}
            <button onClick={openGeneralWhatsapp}>Solicitar atendimento</button>
          </motion.nav>
        )}
      </AnimatePresence>

      <main>{children}</main>

      <footer className="footer">
        <div>
          <strong>{siteConfig.professionalName}</strong>
          <p>Tecnologia, finanças e tributos com atendimento direto.</p>
        </div>
        <div>
          <span>{siteConfig.locations[0]}</span>
          <span>{siteConfig.locations[1]}</span>
          <span>Suporte remoto quando aplicável</span>
        </div>
        <div className="footer-note">
          <span>© {new Date().getFullYear()}</span>
          <span>Site institucional profissional.</span>
        </div>
      </footer>
    </div>
  );
}
