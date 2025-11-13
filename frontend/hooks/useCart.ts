// hooks/useCart.ts
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { validateSlugs } from "@/lib/cms/cart/validation";
import { readLocalCart, setLocalSlugs, clearLocalCart } from "@/lib/local-cart";

type CartState = {
  slugs: string[];
  source: "local" | "server";
  loading: boolean;
};

function dedupe<T>(arr: T[]) {
  return Array.from(new Set(arr));
}
function debounce<T extends (...args: any[]) => void>(fn: T, ms: number) {
  let t: any;
  return (...args: any[]) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

export function useCart() {
  const { data: session, status } = useSession();
  const loggedIn = status === "authenticated";
  const [state, setState] = useState<CartState>({
    slugs: [],
    source: "local",
    loading: true,
  });
  const pathname = usePathname();
  const validatingRef = useRef(false);

  // 1) Bootstrap
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (loggedIn) {
        const res = await fetch("/api/cart", { cache: "no-store" });
        const data = res.ok ? await res.json() : { lines: [] };
        if (!cancelled)
          setState({
            slugs: (data.lines ?? []).map((l: any) => l.menuSlug),
            source: "server",
            loading: false,
          });
      } else {
        const lc = readLocalCart();
        if (!cancelled)
          setState({ slugs: lc.slugs, source: "local", loading: false });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loggedIn]);

  // 2) Merge on sign-in (client-side since localStorage)
  useEffect(() => {
    if (!loggedIn) return;
    const lc = readLocalCart();
    if (!lc.slugs.length) return;
    (async () => {
      const res = await fetch("/api/cart/merge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ localSlugs: lc.slugs }),
      });
      const data = await res.json();
      // merged server cart becomes source of truth
      setState({
        slugs: (data.lines ?? []).map((l: any) => l.menuSlug),
        source: "server",
        loading: false,
      });
      clearLocalCart(); // remove local cart after merge
      if (data.removedFromMerge?.length) {
        // notify user that some items disappeared
        // Replace with your toast lib:
        console.info(
          "Some items were removed from your cart because they are no longer available:",
          data.removedFromMerge
        );
      }
    })();
  }, [loggedIn]);

  // 3) Validation
  const runValidation = useMemo(
    () =>
      debounce(async () => {
        if (validatingRef.current) return;
        validatingRef.current = true;
        try {
          const { valid, invalid } = await validateSlugs(state.slugs);
          if (invalid.size) {
            const next = state.slugs.filter((s) => valid.has(s));
            setState((s) => ({ ...s, slugs: next }));
            if (state.source === "local") setLocalSlugs(next);
            if (state.source === "server") {
              await fetch("/api/cart", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ op: "set", slugs: next }),
              });
            }
            // toast
            console.info(
              "Removed unavailable items from your cart:",
              Array.from(invalid)
            );
          }
        } finally {
          validatingRef.current = false;
        }
      }, 350),
    [state.slugs, state.source]
  );

  // Trigger validation: on route changes, focus, and after mount
  useEffect(() => {
    if (!state.loading) runValidation();
  }, [pathname, state.loading, runValidation]);
  useEffect(() => {
    const onFocus = () => runValidation();
    window.addEventListener("visibilitychange", onFocus);
    return () => window.removeEventListener("visibilitychange", onFocus);
  }, [runValidation]);

  // 4) Mutations
  async function add(slug: string) {
    const next = state.slugs.concat(slug);
    setState((s) => ({ ...s, slugs: next }));
    if (state.source === "local") setLocalSlugs(next);
    else
      await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ op: "add", slugs: [slug] }),
      });
    runValidation(); // validate after mutation
  }

  async function addMany(slugs: string[]) {
    const next = state.slugs.concat(slugs);
    setState((s) => ({ ...s, slugs: next }));
    if (state.source === "local") setLocalSlugs(next);
    else
      await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ op: "add", slugs }),
      });
    runValidation();
  }

  async function removeOne(slug: string) {
    // remove a single occurrence
    const idx = state.slugs.indexOf(slug);
    if (idx === -1) return;
    const next = state.slugs.slice(0, idx).concat(state.slugs.slice(idx + 1));
    setState((s) => ({ ...s, slugs: next }));
    if (state.source === "local") setLocalSlugs(next);
    else
      await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ op: "remove", slugs: [slug] }),
      });
    runValidation();
  }

  async function clear() {
    setState((s) => ({ ...s, slugs: [] }));
    if (state.source === "local") clearLocalCart();
    else
      await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ op: "set", slugs: [] }),
      });
  }

  return {
    slugs: state.slugs,
    count: state.slugs.length,
    loading: state.loading,
    source: state.source,
    add,
    addMany,
    removeOne,
    clear,
  };
}
