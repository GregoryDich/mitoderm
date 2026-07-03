import type { Lang } from "./i18n";

type Entry = Record<Lang, string>;

export const dictionary = {
  // Navigation
  "nav.collection": { en: "Collection", ru: "Коллекция", he: "קולקציה" },
  "nav.catalog": { en: "Catalog", ru: "Каталог", he: "קטלוג" },
  "nav.specialists": { en: "Specialists", ru: "Специалисты", he: "מומחים" },
  "nav.journal": { en: "Journal", ru: "Журнал", he: "מגזין" },
  "nav.events": { en: "Events", ru: "События", he: "אירועים" },
  "nav.partner": { en: "Become a Partner", ru: "Стать партнёром", he: "להיות שותף" },

  // Hero
  "hero.badge": {
    en: "Exosome Science · Skin Longevity",
    ru: "Наука экзосом · Долголетие кожи",
    he: "מדע האקסוזומים · אריכות ימים לעור",
  },
  "hero.title1": { en: "The future of", ru: "Будущее", he: "העתיד של" },
  "hero.title2": { en: "regeneration.", ru: "регенерации.", he: "התחדשות." },
  "hero.desc": {
    en: "Mitoderm unites advanced exosome technology with precision devices to renew skin and hair at the cellular level — a complete professional ecosystem for visible, lasting longevity.",
    ru: "Mitoderm объединяет передовую технологию экзосом с прецизионными устройствами, обновляя кожу и волосы на клеточном уровне — целостная профессиональная экосистема для видимого и долгосрочного результата.",
    he: "Mitoderm משלבת טכנולוגיית אקסוזומים מתקדמת עם מכשירים מדויקים לחידוש העור והשיער ברמה התאית — אקוסיסטם מקצועי שלם לאריכות ימים נראית לעין.",
  },
  "hero.cta1": { en: "Discover the Collection", ru: "Смотреть коллекцию", he: "גלו את הקולקציה" },
  "hero.cta2": { en: "View Catalog", ru: "Открыть каталог", he: "לצפייה בקטלוג" },

  // Philosophy
  "philo.kicker": { en: "The Mitoderm Philosophy", ru: "Философия Mitoderm", he: "הפילוסופיה של Mitoderm" },
  "philo.quote": {
    en: "We believe beautiful skin is not applied — it is regenerated. Every formula and device is engineered to work with your biology, not against it.",
    ru: "Мы убеждены: красивая кожа не наносится — она регенерируется. Каждая формула и каждое устройство созданы работать вместе с вашей биологией, а не против неё.",
    he: "אנו מאמינים שעור יפה אינו נמרח — הוא מתחדש. כל פורמולה וכל מכשיר תוכננו לעבוד יחד עם הביולוגיה שלכם, לא נגדה.",
  },
  "philo.stat.products": { en: "Signature Products", ru: "Знаковых продукта", he: "מוצרי דגל" },
  "philo.stat.grade": { en: "Professional Grade", ru: "Профессиональный уровень", he: "דרגה מקצועית" },
  "philo.stat.ecosystem": { en: "Unified Ecosystem", ru: "Единая экосистема", he: "אקוסיסטם אחד" },

  // Showcase
  "showcase.kicker": { en: "The Collection", ru: "Коллекция", he: "הקולקציה" },
  "showcase.title": {
    en: "A complete ecosystem of regeneration",
    ru: "Целостная экосистема регенерации",
    he: "אקוסיסטם שלם של התחדשות",
  },
  "showcase.learnmore": { en: "Learn more", ru: "Подробнее", he: "מידע נוסף" },

  // Science
  "science.kicker": { en: "The Science", ru: "Наука", he: "המדע" },
  "science.title": {
    en: "Engineered where biology meets technology",
    ru: "Создано на стыке биологии и технологий",
    he: "נוצר במפגש שבין ביולוגיה לטכנולוגיה",
  },
  "science.p1.title": { en: "Exosome Signaling", ru: "Сигналинг экзосом", he: "איתות אקסוזומים" },
  "science.p1.body": {
    en: "Bioactive messengers that instruct your cells to regenerate, repair and renew with remarkable precision.",
    ru: "Биоактивные посредники, которые с поразительной точностью побуждают клетки к регенерации, восстановлению и обновлению.",
    he: "שליחים ביו-אקטיביים שמורים לתאים להתחדש, להשתקם ולהתרענן בדיוק מרשים.",
  },
  "science.p2.title": { en: "Cellular Diagnostics", ru: "Клеточная диагностика", he: "אבחון תאי" },
  "science.p2.body": {
    en: "Mitoscan reads the skin beneath the surface, turning data into a personalized longevity roadmap.",
    ru: "Mitoscan считывает кожу под поверхностью, превращая данные в персональную карту долголетия.",
    he: "Mitoscan קורא את העור מתחת לפני השטח והופך נתונים למפת דרכים אישית לאריכות ימים.",
  },
  "science.p3.title": { en: "Optimized Delivery", ru: "Оптимальная доставка", he: "החדרה ממוטבת" },
  "science.p3.body": {
    en: "Precision devices and conductive mediums ensure every active reaches exactly where it matters.",
    ru: "Прецизионные устройства и проводящие среды доставляют каждый актив точно туда, где он нужен.",
    he: "מכשירים מדויקים ומדיומים מוליכים מבטיחים שכל חומר פעיל מגיע בדיוק לאן שצריך.",
  },
  "science.p4.title": { en: "Professional Standard", ru: "Профессиональный стандарт", he: "תקן מקצועי" },
  "science.p4.body": {
    en: "Formulated and manufactured to clinical-grade standards for consistent, trusted results.",
    ru: "Разработано и произведено по клиническим стандартам ради стабильного и надёжного результата.",
    he: "פותח ויוצר לפי תקנים קליניים לתוצאות עקביות ואמינות.",
  },

  // Catalog
  "catalog.kicker": { en: "Product Catalog", ru: "Каталог продукции", he: "קטלוג מוצרים" },
  "catalog.title": { en: "Explore by product line", ru: "По линейкам продукции", he: "לפי קווי מוצר" },
  "catalog.all": { en: "All Lines", ru: "Все линейки", he: "כל הקווים" },
  "catalog.viewdetails": { en: "View details", ru: "Подробнее", he: "פרטים" },
  "catalog.comingsoon": { en: "Coming Soon", ru: "Скоро", he: "בקרוב" },
  "catalog.cs.dev": { en: "in development", ru: "в разработке", he: "בפיתוח" },
  "catalog.cs.body": {
    en: "This line is being perfected in our labs. Join the partner list to be the first to access it when it launches.",
    ru: "Эта линейка совершенствуется в наших лабораториях. Вступите в список партнёров, чтобы получить доступ первыми.",
    he: "הקו הזה נמצא בשכלול במעבדות שלנו. הצטרפו לרשימת השותפים כדי לקבל גישה ראשונים.",
  },
  "catalog.notify": { en: "Notify me", ru: "Сообщить мне", he: "עדכנו אותי" },
  "catalog.consult": { en: "Request a consultation", ru: "Запросить консультацию", he: "בקשת ייעוץ" },
  "catalog.related": { en: "From the same line", ru: "Из этой же линейки", he: "מאותו קו מוצר" },
  "catalog.back": { en: "Back to catalog", ru: "Назад в каталог", he: "חזרה לקטלוג" },
  "catalog.highlights": { en: "Highlights", ru: "Ключевое", he: "עיקרי הדברים" },

  // CTA
  "cta.kicker": { en: "Become a Partner", ru: "Стать партнёром", he: "להיות שותף" },
  "cta.title": { en: "Bring Mitoderm to your clinic", ru: "Mitoderm — в вашу клинику", he: "הביאו את Mitoderm למרפאה שלכם" },
  "cta.desc": {
    en: "Join the professionals redefining skin longevity. Request access to the full catalog, pricing and training.",
    ru: "Присоединяйтесь к профессионалам, меняющим представление о долголетии кожи. Запросите доступ к полному каталогу, ценам и обучению.",
    he: "הצטרפו למקצוענים שמגדירים מחדש את אריכות הימים של העור. בקשו גישה לקטלוג המלא, למחירים ולהדרכות.",
  },
  "cta.placeholder": { en: "Your professional email", ru: "Ваш рабочий e-mail", he: "האימייל המקצועי שלכם" },
  "cta.button": { en: "Request Access", ru: "Запросить доступ", he: "בקשת גישה" },
  "cta.sending": { en: "Sending…", ru: "Отправка…", he: "שולח…" },
  "cta.thanks": {
    en: "Thank you — our team will be in touch shortly.",
    ru: "Спасибо — наша команда скоро свяжется с вами.",
    he: "תודה — הצוות שלנו ייצור איתכם קשר בקרוב.",
  },

  // Footer
  "footer.tagline": {
    en: "Advanced exosome science and precision devices for skin and hair longevity — a complete professional ecosystem.",
    ru: "Передовая наука экзосом и прецизионные устройства для долголетия кожи и волос — целостная профессиональная экосистема.",
    he: "מדע אקסוזומים מתקדם ומכשירים מדויקים לאריכות ימים של עור ושיער — אקוסיסטם מקצועי שלם.",
  },
  "footer.lines": { en: "Product Lines", ru: "Линейки", he: "קווי מוצר" },
  "footer.explore": { en: "Explore", ru: "Разделы", he: "לגלות" },
  "footer.company": { en: "Company", ru: "Компания", he: "החברה" },
  "footer.science": { en: "The Science", ru: "Наука", he: "המדע" },
  "footer.philosophy": { en: "Philosophy", ru: "Философия", he: "פילוסופיה" },
  "footer.contact": { en: "Contact", ru: "Контакты", he: "צור קשר" },
  "footer.rights": { en: "All rights reserved.", ru: "Все права защищены.", he: "כל הזכויות שמורות." },
  "footer.privacy": { en: "Privacy", ru: "Конфиденциальность", he: "פרטיות" },
  "footer.terms": { en: "Terms", ru: "Условия", he: "תנאים" },
  "footer.cookies": { en: "Cookies", ru: "Cookies", he: "עוגיות" },

  // Trust
  "trust.kicker": { en: "Proven Results", ru: "Доказанный результат", he: "תוצאות מוכחות" },
  "trust.title": {
    en: "Trusted by professionals, loved by skin",
    ru: "Доверие профессионалов, любовь кожи",
    he: "זוכה לאמון המקצוענים ולאהבת העור",
  },
  "trust.results.title": { en: "Real, visible change", ru: "Реальный, видимый результат", he: "שינוי אמיתי ונראה לעין" },
  "trust.results.body": {
    en: "Documented outcomes from professional Mitoderm protocols across skin tone, firmness and texture.",
    ru: "Документированные результаты профессиональных протоколов Mitoderm: тон, упругость и текстура кожи.",
    he: "תוצאות מתועדות מפרוטוקולים מקצועיים של Mitoderm בגוון, מוצקות ומרקם העור.",
  },
  "trust.before": { en: "Before", ru: "До", he: "לפני" },
  "trust.after": { en: "After", ru: "После", he: "אחרי" },
  "trust.disclaimer": {
    en: "Individual results may vary. Images illustrate professional treatment outcomes.",
    ru: "Индивидуальные результаты могут отличаться. Изображения иллюстрируют результаты профессиональных процедур.",
    he: "התוצאות עשויות להשתנות מאדם לאדם. התמונות ממחישות תוצאות טיפול מקצועי.",
  },
  "trust.testimonials.title": { en: "What specialists say", ru: "Что говорят специалисты", he: "מה אומרים המומחים" },
  "trust.certs.title": { en: "Standards & certifications", ru: "Стандарты и сертификаты", he: "תקנים והסמכות" },

  // Specialists
  "spec.kicker": { en: "Find a Specialist", ru: "Найти специалиста", he: "מצאו מומחה" },
  "spec.title": {
    en: "Certified Mitoderm professionals",
    ru: "Сертифицированные специалисты Mitoderm",
    he: "מומחי Mitoderm מוסמכים",
  },
  "spec.intro": {
    en: "Every specialist below is trained and accredited to deliver authentic Mitoderm protocols. Find a trusted clinic near you and book your consultation.",
    ru: "Каждый специалист ниже обучен и аккредитован для проведения подлинных протоколов Mitoderm. Найдите проверенную клинику рядом и запишитесь на консультацию.",
    he: "כל מומחה כאן מוכשר ומוסמך להעניק פרוטוקולים מקוריים של Mitoderm. מצאו מרפאה מהימנה בקרבתכם וקבעו ייעוץ.",
  },
  "spec.search": {
    en: "Search by city, country or clinic…",
    ru: "Поиск по городу, стране или клинике…",
    he: "חיפוש לפי עיר, מדינה או מרפאה…",
  },
  "spec.certified": { en: "Certified", ru: "Сертифицирован", he: "מוסמך" },
  "spec.book": { en: "Book consultation", ru: "Записаться", he: "קביעת ייעוץ" },
  "spec.profile": { en: "View profile", ru: "Профиль", he: "לצפייה בפרופיל" },
  "spec.specialties": { en: "Specialties", ru: "Специализации", he: "תחומי התמחות" },
  "spec.back": { en: "Back to specialists", ru: "Назад к специалистам", he: "חזרה למומחים" },
  "spec.none": {
    en: "No specialists found. Try another city or country.",
    ru: "Специалисты не найдены. Попробуйте другой город или страну.",
    he: "לא נמצאו מומחים. נסו עיר או מדינה אחרת.",
  },
  "spec.join.title": { en: "Are you a cosmetologist?", ru: "Вы косметолог?", he: "אתם קוסמטיקאים?" },
  "spec.join.body": {
    en: "Join our network of certified professionals and be listed in the official Mitoderm directory.",
    ru: "Вступайте в нашу сеть сертифицированных специалистов и попадите в официальный каталог Mitoderm.",
    he: "הצטרפו לרשת המומחים המוסמכים שלנו והופיעו במדריך הרשמי של Mitoderm.",
  },
  "spec.join.cta": { en: "Apply to join", ru: "Подать заявку", he: "הגשת בקשה" },

  // Journal
  "journal.kicker": { en: "The Journal", ru: "Журнал", he: "המגזין" },
  "journal.title": {
    en: "Knowledge for the modern aesthetician",
    ru: "Знания для современного косметолога",
    he: "ידע לקוסמטיקאי המודרני",
  },
  "journal.intro": {
    en: "Evidence-based articles, protocols and business insight written for cosmetologists who want to lead with science and grow their practice.",
    ru: "Научно обоснованные статьи, протоколы и бизнес-инсайты для косметологов, которые хотят опираться на науку и развивать практику.",
    he: "מאמרים מבוססי ראיות, פרוטוקולים ותובנות עסקיות לקוסמטיקאים שרוצים להוביל עם מדע ולפתח את הקליניקה.",
  },
  "journal.featured": { en: "Featured", ru: "Главное", he: "מומלץ" },
  "journal.readtime": { en: "min read", ru: "мин чтения", he: "דק' קריאה" },
  "journal.back": { en: "Back to journal", ru: "Назад в журнал", he: "חזרה למגזין" },
  "journal.cat.all": { en: "All", ru: "Все", he: "הכול" },
  "journal.cat.science": { en: "Exosome Science", ru: "Наука экзосом", he: "מדע אקסוזומים" },
  "journal.cat.protocols": { en: "Protocols", ru: "Протоколы", he: "פרוטוקולים" },
  "journal.cat.business": { en: "Business", ru: "Бизнес", he: "עסקים" },
  "journal.cat.longevity": { en: "Skin Longevity", ru: "Долголетие кожи", he: "אריכות ימים לעור" },

  // Events
  "events.kicker": { en: "Events", ru: "События", he: "אירועים" },
  "events.title": {
    en: "Where science meets practice",
    ru: "Там, где наука встречается с практикой",
    he: "במקום שבו המדע פוגש את הפרקטיקה",
  },
  "events.intro": {
    en: "Join Mitoderm masterclasses, certifications and summits around the world. Learn directly from our experts and connect with a global community of professionals.",
    ru: "Посещайте мастер-классы, сертификации и саммиты Mitoderm по всему миру. Учитесь напрямую у наших экспертов и общайтесь с мировым сообществом профессионалов.",
    he: "הצטרפו למאסטרקלאסים, הסמכות וכנסים של Mitoderm ברחבי העולם. למדו ישירות מהמומחים שלנו והתחברו לקהילה גלובלית של מקצוענים.",
  },
  "events.upcoming": { en: "Upcoming Events", ru: "Ближайшие события", he: "אירועים קרובים" },
  "events.past": { en: "Past Events", ru: "Прошедшие события", he: "אירועים שהיו" },
  "events.status.open": { en: "Registration Open", ru: "Регистрация открыта", he: "ההרשמה פתוחה" },
  "events.status.soldout": { en: "Sold Out", ru: "Мест нет", he: "אזל" },
  "events.reserve": { en: "Reserve a Seat", ru: "Забронировать место", he: "שריון מקום" },
  "events.waitlist": { en: "Join Waitlist", ru: "В лист ожидания", he: "לרשימת המתנה" },
  "events.registered": { en: "You're registered — see you there!", ru: "Вы зарегистрированы — до встречи!", he: "נרשמתם — נתראה שם!" },
} satisfies Record<string, Entry>;

export type DictKey = keyof typeof dictionary;
