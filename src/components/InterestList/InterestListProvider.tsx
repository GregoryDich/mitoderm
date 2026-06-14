'use client';

import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

const STORAGE = 'mitoderm-interest';

interface InterestApi {
  items: string[]; // product slugs
  add: (slug: string) => void;
  remove: (slug: string) => void;
  toggle: (slug: string) => void;
  has: (slug: string) => boolean;
  clear: () => void;
  count: number;
}

const Ctx = createContext<InterestApi | null>(null);

export const InterestListProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed.filter((x) => typeof x === 'string'));
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, ready]);

  // Cross-tab sync — keeps the list coherent across multiple tabs / windows.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE || e.newValue == null) return;
      try {
        const parsed = JSON.parse(e.newValue);
        if (Array.isArray(parsed)) setItems(parsed.filter((x) => typeof x === 'string'));
      } catch {
        /* ignore */
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const add = useCallback(
    (slug: string) =>
      setItems((cur) => (cur.includes(slug) ? cur : [...cur, slug])),
    []
  );
  const remove = useCallback(
    (slug: string) => setItems((cur) => cur.filter((s) => s !== slug)),
    []
  );
  const toggle = useCallback(
    (slug: string) =>
      setItems((cur) =>
        cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug]
      ),
    []
  );
  const has = useCallback((slug: string) => items.includes(slug), [items]);
  const clear = useCallback(() => setItems([]), []);

  return (
    <Ctx.Provider
      value={{ items, add, remove, toggle, has, clear, count: items.length }}
    >
      {children}
    </Ctx.Provider>
  );
};

export function useInterestList(): InterestApi {
  const ctx = useContext(Ctx);
  if (!ctx) {
    // Safe no-op fallback so we don't crash if a consumer mounts outside
    // the provider (e.g. an isolated story / test).
    return {
      items: [],
      add: () => undefined,
      remove: () => undefined,
      toggle: () => undefined,
      has: () => false,
      clear: () => undefined,
      count: 0,
    };
  }
  return ctx;
}
