'use client';

import { useEffect } from 'react';
import { track } from '@/lib/track';

type TrackedEvent = 'view_protocol' | 'read_post';

interface Props {
  event: TrackedEvent;
  params?: Record<string, unknown>;
}

/** Fires one analytics event on mount and renders nothing. Use this
 *  from a server component to register a client-side view event
 *  without having to flip the page to "use client". */
export default function MountTracker({ event, params }: Props) {
  useEffect(() => {
    track(event, params);
    // Intentionally not re-firing on param changes — params are a
    // snapshot of the mount, not a continuously-updating subscription.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
