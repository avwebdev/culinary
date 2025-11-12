export type LocalCart = { slugs: string[]; updatedAt: string; v: 1 };
const KEY = "cart.v1";

export function readLocalCart(): LocalCart {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { slugs: [], updatedAt: new Date().toISOString(), v: 1 };
    const parsed = JSON.parse(raw) as LocalCart;
    if (parsed?.v !== 1 || !Array.isArray(parsed.slugs)) throw new Error("bad");
    return parsed;
  } catch {
    return { slugs: [], updatedAt: new Date().toISOString(), v: 1 };
  }
}

export function writeLocalCart(next: LocalCart) {
  localStorage.setItem(KEY, JSON.stringify(next));
  // cross-tab sync
  window.dispatchEvent(
    new StorageEvent("storage", { key: KEY, newValue: JSON.stringify(next) })
  );
}

export function setLocalSlugs(slugs: string[]) {
  writeLocalCart({ slugs, updatedAt: new Date().toISOString(), v: 1 });
}

export function clearLocalCart() {
  writeLocalCart({ slugs: [], updatedAt: new Date().toISOString(), v: 1 });
}
