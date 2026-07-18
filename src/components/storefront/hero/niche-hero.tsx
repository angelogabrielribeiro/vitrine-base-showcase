import type { Product, Service, StoreConfig } from "@/types/commerce";
import { FashionHero } from "./fashion-hero";
import { BarberHero } from "./barber-hero";
import { RestaurantHero } from "./restaurant-hero";
import { ElectronicsHero } from "./electronics-hero";

export type HeroSpotlight =
  | { kind: "product"; product: Product }
  | { kind: "service"; service: Service; image: string }
  | null;

export interface NicheHeroProps {
  store: StoreConfig;
  spotlight: HeroSpotlight;
  featured: Product[];
}

/** Dispatcher: cada nicho tem seu próprio hero, sem template compartilhado. */
export function NicheHero(props: NicheHeroProps) {
  switch (props.store.niche) {
    case "fashion":
      return <FashionHero {...props} />;
    case "barber":
      return <BarberHero {...props} />;
    case "restaurant":
      return <RestaurantHero {...props} />;
    case "electronics":
      return <ElectronicsHero {...props} />;
  }
}