'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { CatalogItem } from '@/products';

/** Holds the slim catalog index (slug / href / name / shortDescription /
 *  category / status / accent / image / cardVideo) computed once on the
 *  server and handed to client components that need to resolve a slug to
 *  a display row — InterestDrawer, RecentlyViewedStrip, etc.
 *
 *  Why: importing getCatalogItems() into a client component drags the
 *  ENTIRE products.json (all locales, every protocol/aftercare/faq
 *  block, ~149 KB) into the client bundle. Passing the slim index down
 *  from the server keeps the heavy dataset server-only. */
const CatalogIndexContext = createContext<CatalogItem[]>([]);

export function CatalogIndexProvider({
  items,
  children,
}: {
  items: CatalogItem[];
  children: ReactNode;
}) {
  return (
    <CatalogIndexContext.Provider value={items}>
      {children}
    </CatalogIndexContext.Provider>
  );
}

export function useCatalogIndex(): CatalogItem[] {
  return useContext(CatalogIndexContext);
}
