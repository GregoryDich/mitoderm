import { Hero } from "../components/Hero";
import { Philosophy } from "../components/Philosophy";
import { ProductShowcase } from "../components/ProductShowcase";
import { Science } from "../components/Science";
import { Trust } from "../components/Trust";
import { ProductCatalog } from "../components/ProductCatalog";
import { CTA } from "../components/CTA";
import { products } from "../data/products";
import { useLang } from "../i18n/i18n";
import { useDocumentMeta } from "../hooks/useDocumentMeta";

// Flagship products featured in the large alternating showcase.
const featured = products.filter((p) => p.id !== "exosignal-spray");

export function Home() {
  const { t } = useLang();
  useDocumentMeta("", t("hero.desc"));
  return (
    <>
      <Hero />
      <Philosophy />
      <ProductShowcase products={featured} />
      <Science />
      <Trust />
      <ProductCatalog />
      <CTA />
    </>
  );
}
