import { useEffect } from "react";

/**
 * Client-side SEO: sets the document <title> and meta description.
 * This environment has no SSR, so meta is applied imperatively on mount/update.
 */
export function useDocumentMeta(title: string, description?: string) {
  useEffect(() => {
    const fullTitle = title ? `${title} · Mitoderm` : "Mitoderm — Where Science Meets Beauty";
    document.title = fullTitle;

    if (description) {
      let tag = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement("meta");
        tag.name = "description";
        document.head.appendChild(tag);
      }
      tag.content = description;
    }
  }, [title, description]);
}
