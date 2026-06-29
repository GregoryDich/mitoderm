'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

/** Three-state consent model.
 *  - `unset`: visitor hasn't decided yet → banner visible, analytics off.
 *  - `granted`: visitor accepted → analytics may load.
 *  - `denied`: visitor declined → analytics stay off, no banner.
 *  Persisted to localStorage so we don't ask twice. */
export type ConsentState = 'unset' | 'granted' | 'denied';

interface ConsentContextValue {
  state: ConsentState;
  grant: () => void;
  deny: () => void;
}

const STORAGE_KEY = 'mitoderm_consent_v1';

const ConsentContext = createContext<ConsentContextValue>({
  state: 'unset',
  grant: () => {},
  deny: () => {},
});

function readStored(): ConsentState {
  if (typeof window === 'undefined') return 'unset';
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === 'granted' || raw === 'denied') return raw;
  } catch {
    // localStorage may be blocked (private mode, sandboxed iframe). Treat
    // as unset and re-prompt; the inconvenience is on the privacy side.
  }
  return 'unset';
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  // SSR-safe: render with `unset` on the server, sync from storage on mount.
  // Until mount completes, analytics components see `unset` and skip — same
  // as if the visitor hadn't decided, which is the conservative default.
  const [state, setState] = useState<ConsentState>('unset');

  useEffect(() => {
    setState(readStored());
  }, []);

  const persist = (next: 'granted' | 'denied') => {
    setState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore — state still lives in memory for this session
    }
  };

  return (
    <ConsentContext.Provider
      value={{
        state,
        grant: () => persist('granted'),
        deny: () => persist('denied'),
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent(): ConsentContextValue {
  return useContext(ConsentContext);
}
