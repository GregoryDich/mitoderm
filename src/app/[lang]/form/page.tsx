import { unstable_setRequestLocale } from 'next-intl/server';
import MainForm from '@/components/Forms/MainForm';

export default function FormPage({ params: { lang } }: any) {
  unstable_setRequestLocale(lang);
  return (
    <main className='formPage'>
      <MainForm />
    </main>
  );
}
