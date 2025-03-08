import { unstable_setRequestLocale } from 'next-intl/server';
import EventForm from '@/components/Forms/EventForm';

export default function EventFormPage({ params: { lang } }: any) {
  unstable_setRequestLocale(lang);
  return (
    <main className='formPage'>
      <EventForm />
    </main>
  );
}
