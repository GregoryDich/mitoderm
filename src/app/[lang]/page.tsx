import { unstable_setRequestLocale } from 'next-intl/server';
import HomePage from '@/components/Home/HomePage';
import { LocaleType } from '@/types';

export default function Home({
  params: { lang },
}: {
  params: { lang: string };
}) {
  unstable_setRequestLocale(lang);
  return <HomePage locale={lang as LocaleType} />;
}
