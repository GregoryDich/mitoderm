import { unstable_setRequestLocale } from 'next-intl/server';
import ContactForm from '@/components/Contact/ContactForm';

export default function FormPage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  unstable_setRequestLocale(lang);
  return <ContactForm />;
}
