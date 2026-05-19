import { redirect } from 'next/navigation';

export default function HomePage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  redirect(`/${lang}/catalog`);
}
