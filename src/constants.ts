import {
  NavItem,
  HowToUseItem,
  AboutBulletItem,
  LanguageSwitchItem,
  SolutionItem,
  ScrollItems,
  ReviewType,
  EventBulletItem,
} from './types';

export const navMainList: NavItem[] = [
  { text: 'navigation.product', scrollId: ScrollItems.solution },
  { text: 'navigation.results', scrollId: ScrollItems.gallery },
  { text: 'navigation.about', scrollId: ScrollItems.mission },
  { text: 'navigation.info', scrollId: ScrollItems.about },
  { text: 'navigation.contact', url: '/form' },
  { text: 'navigation.event', url: '/event' },
];

export const navEventList: NavItem[] = [
  { text: 'navigation.product', url: '/' },
  { text: 'navigation.info', scrollId: ScrollItems.about },
  { text: 'navigation.agenda', scrollId: ScrollItems.agenda },
  { text: 'navigation.contact', url: '/form' },
  { text: 'navigation.results', scrollId: ScrollItems.gallery },
  { text: 'navigation.about', scrollId: ScrollItems.mission },
];

export const navFormList: NavItem[] = [
  { text: 'navigation.product', url: '/' },
  { text: 'navigation.event', url: '/event' },
];

export const howToUseItemList: HowToUseItem[] = [
  { imagePath: '/images/howToUse/surgery.png', text: 'howToUse.item1' },
  { imagePath: '/images/howToUse/acne.png', text: 'howToUse.item2' },
  { imagePath: '/images/howToUse/hair.png', text: 'howToUse.item3' },
  { imagePath: '/images/howToUse/skin.png', text: 'howToUse.item4' },
];

export const eventBulletsItemList: EventBulletItem[] = [
  {
    imagePath: '/images/event-bullets/clock.png',
    text: 'eventBullets.item1',
  },
  {
    imagePath: '/images/event-bullets/practical-skills.png',
    text: 'eventBullets.item2',
  },
  {
    imagePath: '/images/event-bullets/networking.png',
    text: 'eventBullets.item3',
  },
  {
    imagePath: '/images/event-bullets/certificate.png',
    text: 'eventBullets.item4',
  },
];

export const aboutBulletItems: AboutBulletItem[] = [
  { data: '6', text: 'about.itemExp1' },
  { data: '150%', text: 'about.itemExp4' },
  { data: '70+', text: 'about.itemExp3' },
  { data: '50%', text: 'about.itemExp2' },
  { data: '60-150', text: 'about.itemExp5' },
];

export const languageSwitchItemList: LanguageSwitchItem[] = [
  { imageUrl: '/languageSwitch/en.svg', url: '/en/' },
  { imageUrl: '/languageSwitch/en.svg', url: '/ru/' },
  { imageUrl: '/languageSwitch/en.svg', url: '/he/' },
];

export const solutionItems: SolutionItem[] = [
  {
    imageUrl: '/images/solution/item1.png',
    title: 'solution.item1title',
    text: [
      'solution.item1textP1',
      'solution.item1textP2',
      'solution.item1textP3',
      'solution.item1textP4',
    ],
  },
  {
    imageUrl: '/images/solution/item2.png',
    title: 'solution.item2title',
    text: ['solution.item2textP1', 'solution.item2textP2'],
  },
  {
    imageUrl: '/images/solution/item1.png',
    title: 'solution.item1title',
    text: [
      'solution.item1textP1',
      'solution.item1textP2',
      'solution.item1textP3',
      'solution.item1textP4',
    ],
  },
  {
    imageUrl: '/images/solution/item2.png',
    title: 'solution.item2title',
    text: ['solution.item2textP1', 'solution.item2textP2'],
  },
];

export const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const reviews: ReviewType[] = [
  {
    name: 'reviews.item1.name',
    rating: 5,
    text: 'reviews.item1.text',
  },
  {
    name: 'reviews.item2.name',
    rating: 5,
    text: 'reviews.item2.text',
  },
];
