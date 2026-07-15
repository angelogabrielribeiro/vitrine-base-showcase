import { useSyncExternalStore } from "react";
import { repo } from "@/services/local-repository";

const versionRef = { current: 0 };
repo.subscribe(() => {
  versionRef.current += 1;
});

export function useRepo() {
  useSyncExternalStore(
    (cb) => repo.subscribe(cb),
    () => versionRef.current,
    () => 0,
  );
  return repo;
}
