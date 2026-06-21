type GtagWindow = Window & {
  gtag?: (command: 'event', name: string, params?: Record<string, unknown>) => void;
};

type EventName =
  | 'cta_click'
  | 'lead_submit'
  | 'lead_success'
  | 'catalog_filter'
  | 'catalog_card_click'
  | 'line_view'
  | 'line_cta'
  | 'product_view'
  | 'product_brief_open'
  | 'apply_submit'
  | 'whatsapp_click'
  | 'email_click'
  | 'phone_click'
  | 'pro_login_request'
  | 'chat_open'
  | 'chat_message';

export function track(name: EventName, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  const w = window as GtagWindow;
  try {
    w.gtag?.('event', name, params);
  } catch {}
}
