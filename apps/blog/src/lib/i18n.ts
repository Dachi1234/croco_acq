import { LOCALES, DEFAULT_LOCALE, type Locale } from "@acquisition/shared";

export { LOCALES, DEFAULT_LOCALE };
export type { Locale };

const translations: Record<Locale, Record<string, string>> = {
  ka: {
    home: "მთავარი",
    promotions: "აქციები",
    blog: "ბლოგი",
    register: "რეგისტრაცია",
    all_promotions: "ყველა აქცია",
    all_articles: "ყველა სტატია",
    learn_more: "გაიგე მეტი",
    read_more: "წაიკითხე მეტი",
    promo: "აქცია",
    related_articles: "მსგავსი სტატიები",
    other_articles: "სხვა სტატიები",
    other_promotions: "სხვა აქციები",
    view_all: "ყველას ნახვა",
    view_full: "სრულად ნახვა",
    privacy: "კონფიდენციალურობა",
    terms: "წესები და პირობები",
    cookie_message:
      "ჩვენ ვიყენებთ ქუქი-ფაილებს თქვენი გამოცდილების გასაუმჯობესებლად.",
    accept: "მიღება",
    decline: "უარყოფა",
    copyright: "© 2026 Crocobet ყველა უფლება დაცულია.",
  },
  en: {
    home: "Home",
    promotions: "Promotions",
    blog: "Blog",
    register: "Register",
    all_promotions: "All Promotions",
    all_articles: "All Articles",
    learn_more: "Learn More",
    read_more: "Read More",
    promo: "Promo",
    related_articles: "Related Articles",
    other_articles: "Other Articles",
    other_promotions: "Other Promotions",
    view_all: "View All",
    view_full: "View Full",
    privacy: "Privacy Policy",
    terms: "Terms & Conditions",
    cookie_message: "We use cookies to improve your experience.",
    accept: "Accept",
    decline: "Decline",
    copyright: "© 2026 Crocobet. All rights reserved.",
  },
};

export function t(locale: Locale, key: string): string {
  return translations[locale]?.[key] || translations[DEFAULT_LOCALE][key] || key;
}

export function isValidLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}
