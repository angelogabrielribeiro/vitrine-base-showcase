import type { StoreConfig } from "@/types/commerce";

export function StoreThemeStyle({ store }: { store: StoreConfig }) {
  const t = store.theme;
  const scopeClass = `store-theme-${store.slug}`;
  const css = `
    .${scopeClass} {
      --background: ${t.background};
      --foreground: ${t.foreground};
      --card: ${t.card};
      --card-foreground: ${t.cardForeground};
      --popover: ${t.card};
      --popover-foreground: ${t.cardForeground};
      --primary: ${t.primary};
      --primary-foreground: ${t.primaryForeground};
      --secondary: ${t.secondary};
      --secondary-foreground: ${t.secondaryForeground};
      --muted: ${t.muted};
      --muted-foreground: ${t.mutedForeground};
      --accent: ${t.accent};
      --accent-foreground: ${t.accentForeground};
      --border: ${t.border};
      --input: ${t.border};
      --ring: ${t.ring};
      --radius: ${t.radius};
      background-color: var(--background);
      color: var(--foreground);
      font-family: ${store.fonts.body};
    }
    .store-theme-${store.slug} .font-display { font-family: ${store.fonts.display}; }
  `;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

export const themeScopeClass = (slug: string) => `store-theme-${slug}`;
