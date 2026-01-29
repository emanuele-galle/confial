import { useIsMounted } from "./use-is-mounted";

/**
 * Returns a Date object only after client mount.
 * Returns null during SSR to avoid hydration mismatch.
 */
export function useClientDate() {
  const mounted = useIsMounted();
  return mounted ? new Date() : null;
}
