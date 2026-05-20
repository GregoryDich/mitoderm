import { unstable_setRequestLocale } from 'next-intl/server';
import AboutPage from '@/components/About/AboutPage';

export default function AboutRoute({
  params: { lang },
}: {
  params: { lang: string };
}) {
  unstable_setRequestLocale(lang);
  return <AboutPage />;
}
