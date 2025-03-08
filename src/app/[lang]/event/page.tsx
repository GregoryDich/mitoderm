import { unstable_setRequestLocale } from 'next-intl/server';
import dynamic from 'next/dynamic';
import Intro from '@/components/Intro/Intro';
import Button from '@/components/Shared/Button/Button';
import { useTranslations } from 'next-intl';
import EventBulletList from '@/components/EventBulletList/EventBulletList';
import Gallery from '@/components/Gallery/Gallery';

const FirstLook = dynamic(() => import('@/components/FirstLook/FirstLook'), {
  ssr: false,
});

const Event = dynamic(() => import('@/components/Event/Event'), {
  ssr: false,
});

const ToTopItOff = dynamic(() => import('@/components/ToTopItOff/ToTopItOff'), {
  ssr: false,
});

const Contact = dynamic(() => import('@/components/Contact/Contact'), {
  ssr: false,
});

const About = dynamic(() => import('@/components/About/About'), {
  ssr: false,
});

const Mission = dynamic(() => import('@/components/Mission/Mission'), {
  ssr: false,
});

export default function EventPage({ params: { lang } }: any) {
  unstable_setRequestLocale(lang);
  const t = useTranslations();
  return (
    <main>
      <Intro />
      <EventBulletList />
      <FirstLook />
      <Event />
      <ToTopItOff />
      <Contact />
      <Gallery />
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          padding: '0px 20px',
        }}
      >
        <Button
          style={{ margin: '20px auto 40px auto' }}
          colored
          text={t('buttons.seat')}
          formPage='event'
        />
      </div>
      <About />
      <Mission />
    </main>
  );
}
