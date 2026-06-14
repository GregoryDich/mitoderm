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

const STORAGE = 'mitoderm-recently-viewed';
const CAP = 8;

interface RecentApi {
  items: string[]; // product slugs, newest-first
  track: (slug: string) => void;
  clear: () => void;
}

const Ctx = createContext<RecentApi | null>(null);

export const RecentlyViewedProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed))
          setItems(parsed.filter((x) => typeof x === 'string'));
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

  const track = useCallback((slug: string) => {
    setItems((cur) => {
      const without = cur.filter((s) => s !== slug);
      return [slug, ...without].slice(0, CAP);
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);

  return (
    <Ctx.Provider value={{ items, track, clear }}>{children}</Ctx.Provider>
  );
};

export function useRecentlyViewed(): RecentApi {
  const ctx = useContext(Ctx);
  if (!ctx) {
    return { items: [], track: () => undefined, clear: () => undefined };
  }
  return ctx;
}
