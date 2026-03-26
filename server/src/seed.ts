import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { articles, promotions, homepageConfig } from "./db/schema.js";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

const client = postgres(databaseUrl);
const db = drizzle(client);

const now = new Date();
function daysAgo(n: number) {
  return new Date(now.getTime() - n * 86400000);
}

const kaArticles = [
  {
    slug: "freespins-guide",
    locale: "ka",
    title: "ფრისპინების სრული გზამკვლევი",
    excerpt:
      "გაიგეთ ყველაფერი ფრისპინების შესახებ — როგორ მიიღოთ, როგორ გამოიყენოთ და რა პირობები მოქმედებს.",
    coverImage: "https://picsum.photos/seed/fs-guide/800/450",
    blocks: [
      {
        type: "text",
        content:
          "<h2>რა არის ფრისპინები?</h2><p>ფრისპინები (Free Spins) არის უფასო ტრიალი სლოტ თამაშებში, რომელიც საშუალებას გაძლევთ ითამაშოთ საკუთარი თანხის დახარჯვის გარეშე. ეს არის ყველაზე პოპულარული ბონუსის ტიპი ონლაინ კაზინოებში.</p><p>ფრისპინები შეიძლება მიიღოთ რამდენიმე გზით: რეგისტრაციისას, პირველი დეპოზიტის შემდეგ, ან სპეციალური აქციების ფარგლებში.</p>",
      },
      {
        type: "banner",
        image: "https://picsum.photos/seed/fs-banner/1200/400",
        alt: "ფრისპინების ბანერი",
        link: "#",
      },
      {
        type: "text",
        content:
          "<h2>როგორ გამოვიყენოთ ფრისპინები?</h2><p>ფრისპინების გამოყენება მარტივია — უბრალოდ გახსენით შესაბამისი სლოტ თამაში და ფრისპინები ავტომატურად გააქტიურდება. მოგების შემთხვევაში, თანხა დაემატება თქვენს ბონუს ბალანსს.</p><p>გაითვალისწინეთ, რომ ფრისპინებიდან მიღებულ მოგებას ხშირად აქვს ვეჯერის მოთხოვნა, რაც ნიშნავს რომ მოგება გარკვეულ რაოდენობის ტრიალში უნდა გაატრიალოთ ნაღდ ფულში გადაქცევამდე.</p>",
      },
    ],
    metaTitle: "ფრისპინების გზამკვლევი | Crocobet ბლოგი",
    metaDescription:
      "ყველაფერი ფრისპინების შესახებ — სრული გზამკვლევი დამწყებთათვის.",
    status: "published",
    publishedAt: daysAgo(2),
  },
  {
    slug: "online-security-tips",
    locale: "ka",
    title: "ონლაინ უსაფრთხოების 10 რჩევა",
    excerpt:
      "დაიცავით თქვენი ანგარიში ამ 10 მარტივი რჩევით. უსაფრთხოება ყოველთვის პირველ ადგილზეა.",
    coverImage: "https://picsum.photos/seed/security/800/450",
    blocks: [
      {
        type: "text",
        content:
          "<h2>უსაფრთხოება ინტერნეტში</h2><p>ონლაინ უსაფრთხოება კრიტიკულად მნიშვნელოვანია. ყოველწლიურად ათასობით ადამიანი ხდება კიბერდანაშაულის მსხვერპლი. ამ სტატიაში მოგიყვებით 10 მარტივ, მაგრამ ეფექტურ რჩევას.</p><h3>1. გამოიყენეთ ძლიერი პაროლი</h3><p>პაროლი უნდა შეიცავდეს მინიმუმ 12 სიმბოლოს, მათ შორის დიდ და პატარა ასოებს, ციფრებს და სპეციალურ სიმბოლოებს.</p><h3>2. ორფაქტორიანი ავტორიზაცია</h3><p>ჩართეთ ორფაქტორიანი ავტორიზაცია ყველა ანგარიშზე, სადაც ეს შესაძლებელია.</p>",
      },
      {
        type: "promo_cta",
        title: "დაიცავი ანგარიში",
        subtitle: "გააქტიურე ორფაქტორიანი ავტორიზაცია ახლავე",
        button_text: "გააქტიურება",
        button_link: "#",
        variant: "default",
      },
    ],
    metaTitle: "ონლაინ უსაფრთხოების 10 რჩევა",
    metaDescription:
      "ონლაინ უსაფრთხოების საუკეთესო პრაქტიკები — დაიცავით ანგარიში.",
    status: "published",
    publishedAt: daysAgo(5),
  },
  {
    slug: "mobile-app-updates",
    locale: "ka",
    title: "მობილური აპლიკაციის სიახლეები 2026",
    excerpt:
      "გაეცანით ჩვენი მობილური აპლიკაციის უახლეს განახლებებს და ახალ ფუნქციებს.",
    coverImage: "https://picsum.photos/seed/mobile-app/800/450",
    blocks: [
      {
        type: "text",
        content:
          "<h2>რა სიახლეებია აპლიკაციაში?</h2><p>ჩვენი მობილური აპლიკაცია მუდმივად ვითარდება. 2026 წლის განახლებამ მოიტანა სრულიად ახალი ინტერფეისი, უფრო სწრაფი ნავიგაცია და გაუმჯობესებული შეტყობინებების სისტემა.</p><p>ახალი ვერსია ხელმისაწვდომია როგორც iOS-ზე, ასევე Android-ზე.</p>",
      },
      {
        type: "two_banner",
        left: {
          image: "https://picsum.photos/seed/app-ios/600/400",
          alt: "iOS აპლიკაცია",
          link: "#",
        },
        right: {
          image: "https://picsum.photos/seed/app-android/600/400",
          alt: "Android აპლიკაცია",
          link: "#",
        },
      },
    ],
    metaTitle: "მობილური აპის სიახლეები 2026",
    metaDescription:
      "Crocobet მობილური აპლიკაციის 2026 წლის განახლებები და ახალი ფუნქციები.",
    status: "published",
    publishedAt: daysAgo(8),
  },
  {
    slug: "responsible-gaming",
    locale: "ka",
    title: "პასუხისმგებლიანი თამაშის პრინციპები",
    excerpt:
      "გაეცანით პასუხისმგებლიანი თამაშის მნიშვნელობას და ჩვენს ინსტრუმენტებს თქვენი დაცვისთვის.",
    coverImage: "https://picsum.photos/seed/responsible/800/450",
    blocks: [
      {
        type: "text",
        content:
          "<h2>პასუხისმგებლიანი თამაში</h2><p>თამაში უნდა იყოს გასართობი. Crocobet-ში ჩვენ მტკიცედ ვუჭერთ მხარს პასუხისმგებლიან თამაშს და გთავაზობთ ინსტრუმენტებს, რომლებიც დაგეხმარებათ კონტროლის შენარჩუნებაში.</p><h3>თვითშეზღუდვის ინსტრუმენტები</h3><p>თქვენ შეგიძლიათ დააწესოთ დეპოზიტის ლიმიტი, დანაკარგის ლიმიტი და სესიის დროის ლიმიტი. ეს ინსტრუმენტები ხელმისაწვდომია თქვენი ანგარიშის პარამეტრებში.</p>",
      },
    ],
    metaTitle: "პასუხისმგებლიანი თამაში",
    metaDescription:
      "პასუხისმგებლიანი თამაშის პრინციპები და ინსტრუმენტები Crocobet-ზე.",
    status: "published",
    publishedAt: daysAgo(12),
  },
  {
    slug: "choose-best-platform",
    locale: "ka",
    title: "როგორ ავირჩიოთ საუკეთესო ონლაინ პლატფორმა",
    excerpt:
      "გაიგეთ რა კრიტერიუმებით უნდა შეაფასოთ ონლაინ პლატფორმა და როგორ აირჩიოთ საუკეთესო.",
    coverImage: "https://picsum.photos/seed/platform/800/450",
    blocks: [
      {
        type: "text",
        content:
          "<h2>პლატფორმის არჩევის კრიტერიუმები</h2><p>ონლაინ პლატფორმის არჩევისას მნიშვნელოვანია რამდენიმე ფაქტორის გათვალისწინება: ლიცენზია, თამაშების არჩევანი, ბონუსები, გადახდის მეთოდები და მომხმარებლის მხარდაჭერა.</p><h3>ლიცენზია</h3><p>ყოველთვის შეამოწმეთ აქვს თუ არა პლატფორმას ლეგიტიმური ლიცენზია. ეს არის უსაფრთხოების პირველი გარანტია.</p>",
      },
    ],
    metaTitle: "საუკეთესო ონლაინ პლატფორმის არჩევა",
    metaDescription:
      "როგორ ავირჩიოთ საიმედო და უსაფრთხო ონლაინ პლატფორმა — სრული გზამკვლევი.",
    status: "published",
    publishedAt: daysAgo(15),
  },
  {
    slug: "payment-methods-guide",
    locale: "ka",
    title: "გადახდის მეთოდების სრული გზამკვლევი",
    excerpt:
      "შეისწავლეთ ყველა ხელმისაწვდომი გადახდის მეთოდი — დეპოზიტი და გატანა მარტივად.",
    coverImage: "https://picsum.photos/seed/payments/800/450",
    blocks: [
      {
        type: "text",
        content:
          "<h2>გადახდის მეთოდები</h2><p>Crocobet-ზე ხელმისაწვდომია მრავალი გადახდის მეთოდი: საბანკო ბარათები, ელექტრონული საფულეები, ბანკის გადარიცხვა და სხვა.</p><h3>მინიმალური თანხები</h3><p>მინიმალური დეპოზიტის თანხა არის 1 ლარი. გატანის მინიმალური თანხა კი 10 ლარი. გადარიცხვის დრო დამოკიდებულია არჩეულ მეთოდზე.</p>",
      },
    ],
    metaTitle: "გადახდის მეთოდები",
    metaDescription:
      "ყველა გადახდის მეთოდი Crocobet-ზე — დეტალური ინფორმაცია.",
    status: "published",
    publishedAt: daysAgo(18),
  },
];

const kaPromotions = [
  {
    slug: "500-freespins",
    locale: "ka",
    title: "მოიგე 500 ფრისპინი რეგისტრაციისას",
    excerpt:
      "დარეგისტრირდი ახლავე და მიიღე 500 ფრისპინი საჩუქრად. აქცია მოქმედებს მხოლოდ ახალი მომხმარებლებისთვის.",
    coverImage: "https://picsum.photos/seed/freespins500/800/450",
    blocks: [
      {
        type: "text",
        content:
          "<h2>500 ფრისპინი ახალი მომხმარებლებისთვის</h2><p>დარეგისტრირდით Crocobet-ზე და მიიღეთ 500 ფრისპინი სრულიად უფასოდ! ფრისპინები ხელმისაწვდომია პოპულარულ სლოტ თამაშებზე და შეგიძლიათ მოიგოთ რეალური ფული.</p><h3>აქციის პირობები</h3><ul><li>მხოლოდ ახალი მომხმარებლებისთვის</li><li>რეგისტრაციის შემდეგ 7 დღის განმავლობაში</li><li>ვეჯერის მოთხოვნა: x35</li></ul>",
      },
      {
        type: "promo_cta",
        icon: "/images/icon-promo-full.svg",
        title: "დარეგისტრირდი ახლავე!",
        subtitle: "მიიღე 500 ფრისპინი საჩუქრად",
        button_text: "რეგისტრაცია",
        button_link: "#",
        variant: "highlight",
      },
    ],
    metaTitle: "500 ფრისპინი რეგისტრაციისას | Crocobet აქცია",
    metaDescription:
      "მიიღე 500 ფრისპინი საჩუქრად რეგისტრაციისას — Crocobet ექსკლუზიური აქცია.",
    status: "published",
    publishedAt: daysAgo(1),
  },
  {
    slug: "first-deposit-bonus",
    locale: "ka",
    title: "პირველი დეპოზიტის 200% ბონუსი",
    excerpt:
      "გააორმაგე შენი პირველი დეპოზიტი და მიიღე 200%-მდე ბონუსი. მაქსიმალური ბონუსი 1000 ლარი.",
    coverImage: "https://picsum.photos/seed/deposit200/800/450",
    blocks: [
      {
        type: "text",
        content:
          "<h2>200% ბონუსი პირველ დეპოზიტზე</h2><p>შეავსეთ თქვენი პირველი დეპოზიტი და მიიღეთ 200%-იანი ბონუსი! მაგალითად, თუ შეიტანთ 100 ლარს, მიიღებთ 200 ლარს ბონუსად — ჯამში 300 ლარი გექნებათ სათამაშოდ.</p><h3>პირობები</h3><ul><li>მინიმალური დეპოზიტი: 10 ლარი</li><li>მაქსიმალური ბონუსი: 1000 ლარი</li><li>ვეჯერის მოთხოვნა: x40</li><li>ბონუსის ვადა: 30 დღე</li></ul>",
      },
      {
        type: "banner",
        image: "https://picsum.photos/seed/deposit-banner/1200/400",
        alt: "დეპოზიტის ბონუსი",
        link: "#",
      },
    ],
    metaTitle: "200% ბონუსი პირველ დეპოზიტზე | Crocobet",
    metaDescription:
      "მიიღე 200%-იანი ბონუსი შენს პირველ დეპოზიტზე — მაქსიმუმ 1000 ლარი.",
    status: "published",
    publishedAt: daysAgo(3),
  },
  {
    slug: "weekly-cashback",
    locale: "ka",
    title: "ყოველკვირეული ქეშბექი 15%-მდე",
    excerpt:
      "მიიღე ყოველკვირეული ქეშბექი 15%-მდე. რაც მეტს თამაშობ, მით მეტ ქეშბექს იღებ.",
    coverImage: "https://picsum.photos/seed/cashback15/800/450",
    blocks: [
      {
        type: "text",
        content:
          "<h2>ყოველკვირეული ქეშბექი</h2><p>ყოველ ორშაბათს მიიღეთ ქეშბექი თქვენი გასული კვირის ნეტო დანაკარგებზე. ქეშბექის პროცენტი დამოკიდებულია თქვენს VIP დონეზე:</p><ul><li>ბრინჯაოს დონე: 5%</li><li>ვერცხლის დონე: 10%</li><li>ოქროს დონე: 15%</li></ul><p>ქეშბექს არ აქვს ვეჯერის მოთხოვნა!</p>",
      },
    ],
    metaTitle: "15%-მდე ქეშბექი | Crocobet",
    metaDescription:
      "მიიღე 15%-მდე ყოველკვირეული ქეშბექი ვეჯერის გარეშე.",
    status: "published",
    publishedAt: daysAgo(4),
  },
  {
    slug: "refer-a-friend",
    locale: "ka",
    title: "მოიწვიე მეგობარი — მიიღე 50 ლარი",
    excerpt:
      "მოიწვიე მეგობარი Crocobet-ზე და ორივემ მიიღეთ 50 ლარი ბონუსი.",
    coverImage: "https://picsum.photos/seed/refer-friend/800/450",
    blocks: [
      {
        type: "text",
        content:
          "<h2>მეგობრის მოწვევის პროგრამა</h2><p>გააზიარე შენი უნიკალური ლინკი მეგობრებთან. როცა მეგობარი დარეგისტრირდება და შეავსებს პირველ დეპოზიტს, ორივე მიიღებთ 50 ლარს ბონუსად!</p><h3>როგორ მუშაობს?</h3><ol><li>შედი ანგარიშის პარამეტრებში</li><li>დააკოპირე რეფერალური ლინკი</li><li>გაუზიარე მეგობრებს</li><li>მიიღე ბონუსი!</li></ol>",
      },
    ],
    metaTitle: "მეგობრის მოწვევა | Crocobet აქცია",
    metaDescription:
      "მოიწვიე მეგობარი და მიიღე 50 ლარი — Crocobet რეფერალური პროგრამა.",
    status: "published",
    publishedAt: daysAgo(7),
  },
  {
    slug: "vip-program",
    locale: "ka",
    title: "VIP პროგრამა — ექსკლუზიური პრივილეგიები",
    excerpt:
      "გაეცანით ჩვენს VIP პროგრამას და მიიღეთ ექსკლუზიური ბონუსები და პერსონალური მომსახურება.",
    coverImage: "https://picsum.photos/seed/vip-prog/800/450",
    blocks: [
      {
        type: "text",
        content:
          "<h2>VIP პროგრამა</h2><p>Crocobet-ის VIP პროგრამა გთავაზობთ ექსკლუზიურ შეთავაზებებს, პერსონალურ მენეჯერს და გაზრდილ ქეშბექს. VIP სტატუსი მოიპოვება აქტიური თამაშით.</p>",
      },
      {
        type: "promo_cta",
        icon: "/images/icon-promo-full.svg",
        title: "გახდი VIP წევრი",
        subtitle: "მიიღე ექსკლუზიური ბონუსები",
        button_text: "გაიგე მეტი",
        button_link: "#",
        variant: "default",
      },
    ],
    metaTitle: "VIP პროგრამა | Crocobet",
    metaDescription:
      "Crocobet VIP — ექსკლუზიური ბონუსები, პერსონალური მენეჯერი, გაზრდილი ქეშბექი.",
    status: "published",
    publishedAt: daysAgo(10),
  },
];

const enArticles = [
  {
    slug: "freespins-guide",
    locale: "en",
    title: "Complete Free Spins Guide",
    excerpt:
      "Everything you need to know about free spins — how to get them, how to use them, and what terms apply.",
    coverImage: "https://picsum.photos/seed/fs-guide/800/450",
    blocks: [
      {
        type: "text",
        content:
          "<h2>What Are Free Spins?</h2><p>Free spins are complimentary slot game rounds that let you play without risking your own money. They are the most popular bonus type in online casinos and a great way to explore new games.</p>",
      },
    ],
    metaTitle: "Free Spins Guide | Crocobet Blog",
    metaDescription:
      "Complete guide to free spins — for beginners and experienced players.",
    status: "published",
    publishedAt: daysAgo(2),
  },
  {
    slug: "online-security-tips",
    locale: "en",
    title: "10 Online Security Tips",
    excerpt:
      "Protect your account with these 10 simple tips. Safety always comes first.",
    coverImage: "https://picsum.photos/seed/security/800/450",
    blocks: [
      {
        type: "text",
        content:
          "<h2>Stay Safe Online</h2><p>Online security is critically important. Every year thousands of people fall victim to cybercrime. In this article, we share 10 simple yet effective tips to keep your accounts safe.</p>",
      },
    ],
    metaTitle: "10 Online Security Tips",
    metaDescription: "Best practices for online security — protect your account.",
    status: "published",
    publishedAt: daysAgo(5),
  },
  {
    slug: "mobile-app-updates",
    locale: "en",
    title: "Mobile App Updates 2026",
    excerpt:
      "Discover the latest updates and new features in our mobile application.",
    coverImage: "https://picsum.photos/seed/mobile-app/800/450",
    blocks: [
      {
        type: "text",
        content:
          "<h2>What's New in the App?</h2><p>Our mobile application is constantly evolving. The 2026 update brought a completely redesigned interface, faster navigation, and an improved notification system.</p>",
      },
    ],
    metaTitle: "Mobile App Updates 2026",
    metaDescription:
      "Crocobet mobile app 2026 updates and new features.",
    status: "published",
    publishedAt: daysAgo(8),
  },
  {
    slug: "responsible-gaming",
    locale: "en",
    title: "Responsible Gaming Principles",
    excerpt:
      "Learn about responsible gaming and the tools we provide for your protection.",
    coverImage: "https://picsum.photos/seed/responsible/800/450",
    blocks: [
      {
        type: "text",
        content:
          "<h2>Responsible Gaming</h2><p>Gaming should be fun. At Crocobet, we firmly support responsible gaming and offer tools to help you stay in control, including deposit limits, loss limits, and session time limits.</p>",
      },
    ],
    metaTitle: "Responsible Gaming",
    metaDescription:
      "Responsible gaming principles and tools at Crocobet.",
    status: "published",
    publishedAt: daysAgo(12),
  },
];

const enPromotions = [
  {
    slug: "500-freespins",
    locale: "en",
    title: "Win 500 Free Spins on Registration",
    excerpt:
      "Register now and get 500 free spins as a gift. This offer is available for new users only.",
    coverImage: "https://picsum.photos/seed/freespins500/800/450",
    blocks: [
      {
        type: "text",
        content:
          "<h2>500 Free Spins for New Users</h2><p>Register at Crocobet and receive 500 free spins completely free! Free spins are available on popular slot games and you can win real money.</p>",
      },
    ],
    metaTitle: "500 Free Spins on Registration | Crocobet",
    metaDescription:
      "Get 500 free spins as a gift when you register — exclusive Crocobet offer.",
    status: "published",
    publishedAt: daysAgo(1),
  },
  {
    slug: "first-deposit-bonus",
    locale: "en",
    title: "200% First Deposit Bonus",
    excerpt:
      "Double your first deposit and get up to 200% bonus. Maximum bonus is 1000 GEL.",
    coverImage: "https://picsum.photos/seed/deposit200/800/450",
    blocks: [
      {
        type: "text",
        content:
          "<h2>200% Bonus on First Deposit</h2><p>Make your first deposit and receive a 200% bonus! For example, deposit 100 GEL and get 200 GEL as a bonus — 300 GEL total to play with.</p>",
      },
    ],
    metaTitle: "200% First Deposit Bonus | Crocobet",
    metaDescription:
      "Get a 200% bonus on your first deposit — up to 1000 GEL.",
    status: "published",
    publishedAt: daysAgo(3),
  },
  {
    slug: "weekly-cashback",
    locale: "en",
    title: "Weekly Cashback up to 15%",
    excerpt:
      "Get weekly cashback up to 15%. The more you play, the more cashback you earn.",
    coverImage: "https://picsum.photos/seed/cashback15/800/450",
    blocks: [
      {
        type: "text",
        content:
          "<h2>Weekly Cashback</h2><p>Every Monday, receive cashback on your previous week's net losses. The cashback percentage depends on your VIP level: Bronze 5%, Silver 10%, Gold 15%. No wagering requirements!</p>",
      },
    ],
    metaTitle: "15% Weekly Cashback | Crocobet",
    metaDescription:
      "Get up to 15% weekly cashback with no wagering requirements.",
    status: "published",
    publishedAt: daysAgo(4),
  },
];

async function seed() {
  console.log("Seeding database...\n");

  console.log("Inserting Georgian articles...");
  const kaArticleRows = await db
    .insert(articles)
    .values(
      kaArticles.map((a) => ({
        slug: a.slug,
        locale: a.locale,
        title: a.title,
        excerpt: a.excerpt,
        coverImage: a.coverImage,
        blocks: a.blocks,
        metaTitle: a.metaTitle,
        metaDescription: a.metaDescription,
        status: a.status,
        publishedAt: a.publishedAt,
      })),
    )
    .returning();
  console.log(`  -> ${kaArticleRows.length} articles inserted`);

  console.log("Inserting English articles...");
  const enArticleRows = await db
    .insert(articles)
    .values(
      enArticles.map((a) => ({
        slug: a.slug,
        locale: a.locale,
        title: a.title,
        excerpt: a.excerpt,
        coverImage: a.coverImage,
        blocks: a.blocks,
        metaTitle: a.metaTitle,
        metaDescription: a.metaDescription,
        status: a.status,
        publishedAt: a.publishedAt,
      })),
    )
    .returning();
  console.log(`  -> ${enArticleRows.length} articles inserted`);

  console.log("Inserting Georgian promotions...");
  const kaPromoRows = await db
    .insert(promotions)
    .values(
      kaPromotions.map((p) => ({
        slug: p.slug,
        locale: p.locale,
        title: p.title,
        excerpt: p.excerpt,
        coverImage: p.coverImage,
        blocks: p.blocks,
        metaTitle: p.metaTitle,
        metaDescription: p.metaDescription,
        status: p.status,
        publishedAt: p.publishedAt,
      })),
    )
    .returning();
  console.log(`  -> ${kaPromoRows.length} promotions inserted`);

  console.log("Inserting English promotions...");
  const enPromoRows = await db
    .insert(promotions)
    .values(
      enPromotions.map((p) => ({
        slug: p.slug,
        locale: p.locale,
        title: p.title,
        excerpt: p.excerpt,
        coverImage: p.coverImage,
        blocks: p.blocks,
        metaTitle: p.metaTitle,
        metaDescription: p.metaDescription,
        status: p.status,
        publishedAt: p.publishedAt,
      })),
    )
    .returning();
  console.log(`  -> ${enPromoRows.length} promotions inserted`);

  const kaFeaturedPromoIds = kaPromoRows.slice(0, 3).map((r) => r.id);
  const kaFeaturedArticleIds = kaArticleRows.slice(0, 4).map((r) => r.id);
  const enFeaturedPromoIds = enPromoRows.slice(0, 3).map((r) => r.id);
  const enFeaturedArticleIds = enArticleRows.slice(0, 4).map((r) => r.id);

  console.log("Inserting homepage config for ka...");
  await db
    .insert(homepageConfig)
    .values({
      locale: "ka",
      heroSlides: [
        {
          image: "https://picsum.photos/seed/hero-ka-1/1200/500",
          badge_text: "ახალი",
          heading: "მოიგე 500 ფრისპინი",
          subtext: "რეგისტრაციისას მიიღე 500 ფრისპინი საჩუქრად",
          cta_text: "რეგისტრაცია",
          cta_link: "#",
        },
        {
          image: "https://picsum.photos/seed/hero-ka-2/1200/500",
          badge_text: "აქცია",
          heading: "200% ბონუსი",
          subtext: "პირველ დეპოზიტზე მიიღე 200%-მდე ბონუსი",
          cta_text: "გაიგე მეტი",
          cta_link: "#",
        },
        {
          image: "https://picsum.photos/seed/hero-ka-3/1200/500",
          heading: "ყოველკვირეული ქეშბექი",
          subtext: "მიიღე 15%-მდე ქეშბექი ყოველ ორშაბათს",
          cta_text: "ვრცლად",
          cta_link: "#",
        },
      ],
      ctaBanner: {
        headline: "500 ფრისპინი საჩუქრად!",
        subtext:
          "რეგისტრირდით და მიიღეთ ექსკლუზიური შეთავაზებები. არ გამოტოვოთ შანსი!",
        button_text: "მიიღე ბონუსი",
        button_link: "#",
      },
      featuredPromotions: kaFeaturedPromoIds,
      featuredArticles: kaFeaturedArticleIds,
    })
    .onConflictDoNothing();
  console.log("  -> ka homepage config inserted");

  console.log("Inserting homepage config for en...");
  await db
    .insert(homepageConfig)
    .values({
      locale: "en",
      heroSlides: [
        {
          image: "https://picsum.photos/seed/hero-en-1/1200/500",
          badge_text: "New",
          heading: "Win 500 Free Spins",
          subtext: "Register now and get 500 free spins as a gift",
          cta_text: "Register",
          cta_link: "#",
        },
        {
          image: "https://picsum.photos/seed/hero-en-2/1200/500",
          badge_text: "Promo",
          heading: "200% Deposit Bonus",
          subtext: "Get up to 200% bonus on your first deposit",
          cta_text: "Learn More",
          cta_link: "#",
        },
      ],
      ctaBanner: {
        headline: "500 Free Spins Gift!",
        subtext:
          "Register and receive exclusive offers. Don't miss out!",
        button_text: "Get Bonus",
        button_link: "#",
      },
      featuredPromotions: enFeaturedPromoIds,
      featuredArticles: enFeaturedArticleIds,
    })
    .onConflictDoNothing();
  console.log("  -> en homepage config inserted");

  console.log("\nSeeding complete!");
  console.log(`  Articles: ${kaArticleRows.length + enArticleRows.length}`);
  console.log(`  Promotions: ${kaPromoRows.length + enPromoRows.length}`);
  console.log("  Homepage configs: 2 (ka, en)");

  await client.end();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
