import { useEffect, useState } from "react";

/**
 * Hook to detect if component is mounted (client-side).
 * Use this to avoid hydration mismatches when accessing browser APIs.
 */
export function useIsMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- needed for hydration
    setMounted(true);
  }, []);

  return mounted;
}
