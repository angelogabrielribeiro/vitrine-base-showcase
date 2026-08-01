import { useInsertionEffect } from "react";
import type { StoreConfig } from "@/types/commerce";

const THEME_VALUES = [
  ["background", "background"],
  ["foreground", "foreground"],
  ["card", "card"],
  ["card-foreground", "cardForeground"],
  ["primary", "primary"],
  ["primary-foreground", "primaryForeground"],
  ["secondary", "secondary"],
  ["secondary-foreground", "secondaryForeground"],
  ["muted", "muted"],
  ["muted-foreground", "mutedForeground"],
  ["accent", "accent"],
  ["accent-foreground", "accentForeground"],
  ["border", "border"],
  ["ring", "ring"],
  ["radius", "radius"],
] as const;

type ThemeKey = (typeof THEME_VALUES)[number][0];
type ThemeProperty = (typeof THEME_VALUES)[number][1];

function runtimeVariable(slug: string, key: ThemeKey) {
  return `--vitrine-${slug}-${key}`;
}

function applyRuntimeTheme(store: StoreConfig) {
  if (typeof document === "undefined") return;

  const rootStyle = document.documentElement.style;
  for (const [key, property] of THEME_VALUES) {
    rootStyle.setProperty(runtimeVariable(store.slug, key), String(store.theme[property]));
  }

  document.documentElement.dataset.vitrineThemeSlug = store.slug;
  rootStyle.backgroundColor = store.theme.background;
  rootStyle.color = store.theme.foreground;
}

export function StoreThemeStyle({ store }: { store: StoreConfig }) {
  useInsertionEffect(() => {
    applyRuntimeTheme(store);
  }, [store]);

  const t = store.theme;
  const scopeClass = `store-theme-${store.slug}`;
  const value = (key: ThemeKey, fallback: string) =>
    `var(${runtimeVariable(store.slug, key)}, ${fallback})`;

  const css = `
    .${scopeClass} {
      --background: ${value("background", t.background)};
      --foreground: ${value("foreground", t.foreground)};
      --card: ${value("card", t.card)};
      --card-foreground: ${value("card-foreground", t.cardForeground)};
      --popover: ${value("card", t.card)};
      --popover-foreground: ${value("card-foreground", t.cardForeground)};
      --primary: ${value("primary", t.primary)};
      --primary-foreground: ${value("primary-foreground", t.primaryForeground)};
      --secondary: ${value("secondary", t.secondary)};
      --secondary-foreground: ${value("secondary-foreground", t.secondaryForeground)};
      --muted: ${value("muted", t.muted)};
      --muted-foreground: ${value("muted-foreground", t.mutedForeground)};
      --accent: ${value("accent", t.accent)};
      --accent-foreground: ${value("accent-foreground", t.accentForeground)};
      --border: ${value("border", t.border)};
      --input: ${value("border", t.border)};
      --ring: ${value("ring", t.ring)};
      --radius: ${value("radius", t.radius)};
      background-color: var(--background);
      color: var(--foreground);
      font-family: ${store.fonts.body};
    }
    .store-theme-${store.slug} .font-display { font-family: ${store.fonts.display}; }
  `;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

const bootstrapScript = `
(() => {
  try {
    const match = window.location.pathname.match(/^\\/demo\\/([^/?#]+)/);
    if (!match) return;

    let slug = decodeURIComponent(match[1]);
    if (slug === "mercado") slug = "barbearia";

    const raw = window.localStorage.getItem("vitrine:" + slug + ":config");
    if (!raw) return;

    const config = JSON.parse(raw);
    const theme = config && config.theme;
    if (!theme) return;

    const values = {
      "background": theme.background,
      "foreground": theme.foreground,
      "card": theme.card,
      "card-foreground": theme.cardForeground,
      "primary": theme.primary,
      "primary-foreground": theme.primaryForeground,
      "secondary": theme.secondary,
      "secondary-foreground": theme.secondaryForeground,
      "muted": theme.muted,
      "muted-foreground": theme.mutedForeground,
      "accent": theme.accent,
      "accent-foreground": theme.accentForeground,
      "border": theme.border,
      "ring": theme.ring,
      "radius": theme.radius
    };

    const rootStyle = document.documentElement.style;
    for (const key of Object.keys(values)) {
      const value = values[key];
      if (typeof value === "string" && value) {
        rootStyle.setProperty("--vitrine-" + slug + "-" + key, value);
      }
    }

    if (typeof theme.background === "string") rootStyle.backgroundColor = theme.background;
    if (typeof theme.foreground === "string") rootStyle.color = theme.foreground;
    document.documentElement.dataset.vitrineThemeSlug = slug;
  } catch {
    // A vitrine usa o tema padrão se a preferência local estiver inválida.
  }
})();
`;

export function StoreThemeBootstrapScript() {
  return <script dangerouslySetInnerHTML={{ __html: bootstrapScript }} />;
}

export const themeScopeClass = (slug: string) => `store-theme-${slug}`;
