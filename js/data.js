/**
 * DealHub - Core Data & Initial Seed Store
 */

// ===================================================================
// YOUR AMAZON ASSOCIATE IDS & CURATOR PROFILES
// ===================================================================
const AMAZON_STORE_ID = 'yahyaamir786-20';
const AMAZON_TRACKING_ID = 'yahyaamir786-20'; // Default tracking ID
const AMAZON_TRACKING_IDS = [
  { id: 'yahyaamir786-20', label: 'Yahya Amir Anwer (@yahyaamir)' },
  { id: 'fatimasstudios-20', label: "Fatima's Studios (@fatimasstudios)" }
];

// ===================================================================
// INTERNATIONAL AMAZON MARKETPLACES & ONE-LINK TARGETS
// Tier 1 (US, CA, UK, EU, AU) & Tier 2 (IN, PK, ME)
// ===================================================================
const AMAZON_MARKETPLACES = {
  'US': { name: 'United States', flag: '🇺🇸', domain: 'amazon.com', currency: '$', rate: 1.0, tag: 'yahyaamir786-20' },
  'UK': { name: 'United Kingdom', flag: '🇬🇧', domain: 'amazon.co.uk', currency: '£', rate: 0.79, tag: 'yahyaamir786-20' },
  'CA': { name: 'Canada', flag: '🇨🇦', domain: 'amazon.ca', currency: 'C$', rate: 1.37, tag: 'yahyaamir786-20' },
  'AU': { name: 'Australia', flag: '🇦🇺', domain: 'amazon.com.au', currency: 'A$', rate: 1.52, tag: 'yahyaamir786-20' },
  'DE': { name: 'Germany (EU)', flag: '🇩🇪', domain: 'amazon.de', currency: '€', rate: 0.92, tag: 'yahyaamir786-20' },
  'FR': { name: 'France (EU)', flag: '🇫🇷', domain: 'amazon.fr', currency: '€', rate: 0.92, tag: 'yahyaamir786-20' },
  'IT': { name: 'Italy (EU)', flag: '🇮🇹', domain: 'amazon.it', currency: '€', rate: 0.92, tag: 'yahyaamir786-20' },
  'ES': { name: 'Spain (EU)', flag: '🇪🇸', domain: 'amazon.es', currency: '€', rate: 0.92, tag: 'yahyaamir786-20' },
  'NL': { name: 'Netherlands (EU)', flag: '🇳🇱', domain: 'amazon.nl', currency: '€', rate: 0.92, tag: 'yahyaamir786-20' },
  'PL': { name: 'Poland (EU)', flag: '🇵🇱', domain: 'amazon.pl', currency: 'zł', rate: 4.02, tag: 'yahyaamir786-20' },
  'SE': { name: 'Sweden (EU)', flag: '🇸🇪', domain: 'amazon.se', currency: 'kr', rate: 10.55, tag: 'yahyaamir786-20' },
  'IN': { name: 'India', flag: '🇮🇳', domain: 'amazon.in', currency: '₹', rate: 84.50, tag: 'yahyaamir786-20' },
  'PK': { name: 'Pakistan (Global)', flag: '🇵🇰', domain: 'amazon.com', currency: '$', rate: 1.0, tag: 'yahyaamir786-20' },
  'AE': { name: 'United Arab Emirates', flag: '🇦🇪', domain: 'amazon.ae', currency: 'AED', rate: 3.67, tag: 'yahyaamir786-20' }
};

// ===================================================================
// INTERNATIONAL TECHNICAL SEO & NICHE CONFIGURATION
// ===================================================================
const INTERNATIONAL_SEO_CONFIG = {
  'all': {
    title: 'DealHub [2026] | Curated Amazon Deals, Tested Reviews & Price Drops',
    description: 'Discover verified Amazon deals across tech, home, fashion & wellness. Tested recommendations for USA, Canada, UK, Europe & Worldwide on DealHub.',
    primaryKeyword: 'best Amazon deals today',
    badge: '🔥 Handpicked Global Deals'
  },
  'home-kitchen': {
    title: '7 Best Air Fryers of [2026]: Tested for Every Kitchen | DealHub',
    description: 'Looking for the best air fryer? We tested top-rated models for capacity, speed, and easy cleanup. Find the best kitchen deals on DealHub.',
    primaryKeyword: 'best air fryers for small kitchens',
    longTailKeywords: ['compact air fryer with multi cooking functions', 'dishwasher safe air fryer basket review', 'energy efficient air fryer for meal prep'],
    lsiKeywords: ['buy air fryer online', 'air fryer prime day deals', 'air fryer price comparison'],
    regionalAdapters: {
      us_ca: 'Capacity in Quarts (4-Qt to 6-Qt) · 110-120V Countertop · Fahrenheit (°F)',
      uk_eu: 'Capacity in Litres (3.8L to 5.7L) · 220-240V CE Certified · Celsius (°C) · Low Energy EU Eco Ratings',
      tier2: 'Budget Value Under $50 / ₹4,000 / 200 AED · Dual Voltage Compatible · Amazon Global Shipping'
    },
    euKeywords: {
      de: 'Heißluftfritteuse Test und Vergleich',
      fr: 'Meilleure friteuse sans huile avis et comparatif',
      it: 'Migliore friggitrice ad aria opinioni e offerte',
      es: 'Mejor freidora de aire comparativa y ofertas',
      nl: 'Beste heteluchtfriteuse test en ervaringen',
      pl: 'Najlepsza frytkownica beztłuszczowa opinie i ranking',
      se: 'Bästa varmluftsfritös test och recension'
    }
  },
  'womens-fashion': {
    title: "10 Best Women's Winter Coats [2026]: Warm & Stylish | DealHub",
    description: "Upgrade your wardrobe with the best women's winter coats. Tested for warmth, fit, and durability with live Amazon deals on DealHub.",
    primaryKeyword: "best winter coats for women",
    longTailKeywords: ["lightweight packable down jacket women", "stylish waterproof trench coat with hood", "affordable warm winter parkas for women"],
    lsiKeywords: ["women's fashion deals Amazon", "buy women's winter coat", "designer style coat discount"],
    regionalAdapters: {
      us_ca: 'US Sizing (4 - 14) · Sweaters, Pants & Handbags · Machine Wash Warm',
      uk_eu: 'UK Sizing (8 - 18) · EU Sizing (36 - 44) · Jumpers & Trousers · Oeko-Tex Standard 100 Certified',
      tier2: 'Budget Dupes & High-Street Style · Modest Cuts & Festive Colors · Amazon Worldwide Delivery'
    },
    euKeywords: {
      de: 'Damen Wintermantel Test und Erfahrungen',
      fr: 'Manteau hiver femme tendance et chaud avis',
      it: 'Cappotto invernale donna elegante offerta',
      es: 'Abrigo de invierno mujer elegante y económico',
      nl: 'Beste winterjas dames ervaringen en review',
      pl: 'Najlepsza kurtka zimowa damska ranking',
      se: 'Bästa winterjacka dam test'
    }
  },
  'mens-fashion': {
    title: "Best Men's Casual Jackets [2026]: Stylish Outerwear Deals | DealHub",
    description: "Find the best men's casual jackets for work and weekend style. Compare top-rated bombers, commuters, and field jackets on DealHub.",
    primaryKeyword: "best men's casual jackets",
    longTailKeywords: ["lightweight bomber jacket men slim fit", "waterproof commuter jacket for men", "versatile men's winter coat for daily wear"],
    lsiKeywords: ["men's outerwear discount", "buy men's jacket Amazon", "men's wardrobe essentials sale"],
    regionalAdapters: {
      us_ca: 'US Standard Fit (S - XXL) · Heavyweight Cotton · Sneakers & Vests',
      uk_eu: 'UK/EU Tailored Fit (EU 48 - 56) · Hydrostatic Head Waterproofing mm · Trainers & Gilets',
      tier2: 'Best Value Essentials Under $40 / ₹3,000 / 150 AED · Cross-Border Authentic Brands'
    },
    euKeywords: {
      de: 'Herren Übergangsjacke Test und Kaufberatung',
      fr: 'Veste homme casual comparatif et avis',
      it: 'Giacca uomo casual migliore offerta',
      es: 'Chaqueta casual hombre mejor precio',
      nl: 'Beste heren jas vergelijking en review',
      pl: 'Męska kurtka przejściowa ranking',
      se: 'Bästa herrmodetest jacka'
    }
  },
  'girls-fashion': {
    title: "10 Best Dresses for Girls [2026]: Cute & Comfortable | DealHub",
    description: "Discover top-rated dresses and clothing sets for girls. Soft fabrics, durable designs, and great Amazon fashion deals on DealHub.",
    primaryKeyword: "best party dresses for girls",
    longTailKeywords: ["comfortable cotton casual dresses for young girls", "girls winter coat with fleece lining", "durable school outfits for girls"],
    lsiKeywords: ["girls clothing set deals", "buy girls dresses Amazon", "kids fashion sale"],
    regionalAdapters: {
      us_ca: 'Toddler & Youth Sizes (2T - 14) · Pants & Overalls · Hypoallergenic Cotton',
      uk_eu: 'EU Height-Based Sizing (104 cm - 152 cm) · Dungarees & Frocks · Non-toxic OEKO-TEX Standard',
      tier2: 'Value 3-Piece Multipacks · Festive Holiday Wear (Eid, Diwali, Party) · Amazon Global'
    },
    euKeywords: {
      de: 'Mädchen Kleider Test und Empfehlungen',
      fr: 'Robe fille tendance comparatif et avis',
      it: 'Vestiti bambina eleganti migliori offerte',
      es: 'Vestidos para niña calidad y buen precio',
      nl: 'Beste meisjeskleding review en tips',
      pl: 'Sukienki dziewczęce ranking i opinie',
      se: 'Bästa klänningar för flickor test'
    }
  },
  'boys-fashion': {
    title: "Best Jackets for Boys [2026]: Durable & Weatherproof | DealHub",
    description: "Shop top-rated boys' jackets built to last. Weatherproof, comfortable, and play-proof coats tested with live Amazon deals on DealHub.",
    primaryKeyword: "best durable jackets for boys",
    longTailKeywords: ["waterproof hooded rain jacket for boys", "boys activewear sets breathable fabric", "warm fleece lined winter coat boys"],
    lsiKeywords: ["boys clothes discount", "buy boys coats online", "kids outerwear deals Amazon"],
    regionalAdapters: {
      us_ca: 'US Youth Sizing (XS - XL) · Reinforced Knees/Elbows · Sweatpants & Hoodies',
      uk_eu: 'EU Height Sizing (98 cm - 164 cm) · European Weather Sealing · Joggers & Trainers',
      tier2: 'Durable Daily Essentials Under $25 / ₹1,800 / 100 AED · Stain-Resistant Active Fabrics'
    },
    euKeywords: {
      de: 'Jungen Winterjacke Test und Empfehlungen',
      fr: 'Manteau garçon résistant et chaud avis',
      it: 'Giacca bambino resistente migliore offerta',
      es: 'Chaqueta niño resistente y económica',
      nl: 'Beste jongensjas test en ervaringen',
      pl: 'Kurtka chłopięca zimowa ranking',
      se: 'Bästa jacka för pojkar test'
    }
  },
  'electronic': {
    title: "8 Best Noise Cancelling Earbuds [2026]: Tested & Compared | DealHub",
    description: "Looking for the best wireless earbuds? We lab-tested top models for sound quality, ANC, and battery life. Check live Amazon deals on DealHub.",
    primaryKeyword: "best noise cancelling wireless earbuds",
    longTailKeywords: ["budget active noise cancelling earbuds under 100", "long battery life Bluetooth earbuds for gym", "wireless earbuds with multipoint Bluetooth"],
    lsiKeywords: ["buy wireless earbuds Amazon", "earbuds tech deals", "Bluetooth headphones price tracker"],
    regionalAdapters: {
      us_ca: 'FCC Approved · Bluetooth 5.3 Multipoint · 110V USB-C Fast Chargers · US Warranty',
      uk_eu: 'CE & RoHS Certified · EU Standardized USB-C · 230V UK/EU Plug Safety · UK/EU Warranty',
      tier2: 'Best TWS Audio Under $30 / ₹2,500 / 120 AED · Amazon Global Direct Dispatch'
    },
    euKeywords: {
      de: 'In-Ear Kopfhörer Bluetooth Test und Vergleich',
      fr: 'Écouteurs sans fil réduction de bruit avis',
      it: 'Auricolari Bluetooth senza fili migliore offerta',
      es: 'Auriculares inalámbricos cancelación de ruido comparativa',
      nl: 'Beste draadloze oordopjes test en ervaringen',
      pl: 'Słuchawki bezprzewodowe ranking i opinie',
      se: 'Bästa trådlösa hörlurar test'
    }
  },
  'health-care': {
    title: "5 Best Blood Pressure Monitors [2026]: Tested for Accuracy | DealHub",
    description: "Monitor your health at home with top-rated, clinically tested blood pressure monitors. Compare features, accuracy, and Amazon deals on DealHub.",
    primaryKeyword: "best upper arm blood pressure monitors",
    longTailKeywords: ["accurate Bluetooth blood pressure monitor for home", "FDA cleared digital blood pressure cuff", "easy to read blood pressure monitor for seniors"],
    lsiKeywords: ["buy blood pressure monitor Amazon", "home health devices deal", "medical monitoring gear discount"],
    medicalDisclaimer: "For informational purposes only; consult a physician.",
    regionalAdapters: {
      us_ca: 'FDA 510(k) Cleared · FSA/HSA Eligible Account Purchase · Fahrenheit & Standard Cuffs',
      uk_eu: 'EU Medical Device Regulation (MDR 2017/745) Certified · CE 0123 Medical Mark · NHS Guideline Compliant',
      tier2: 'Clinically Accurate Budget Picks Under $35 / ₹3,000 / 130 AED · Global Medical Dispatch'
    },
    euKeywords: {
      de: 'Blutdruckmessgerät Oberarm Test und Vergleich',
      fr: 'Tensiomètre bras médical avis et comparatif',
      it: 'Misuratore di pressione da braccio migliore offerta',
      es: 'Tensiónmetro de brazo homologado mejor precio',
      nl: 'Beste bloeddrukmeter test en ervaringen',
      pl: 'Cisznieniomierz naramienny ranking i opinie',
      se: 'Bästa blodtrycksmätare test'
    }
  }
};

// Profile Avatars & Info
const YAHYA_AVATAR = '/Image.jpg';
const FATIMA_AVATAR = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80';

const YAHYA_AUTHOR = {
  name: 'Yahya Amir Anwer',
  handle: '@yahyaamir',
  avatar: YAHYA_AVATAR,
  verified: true
};

const FATIMA_AUTHOR = {
  name: "Fatima's Studios",
  handle: '@fatimasstudios',
  avatar: FATIMA_AVATAR,
  verified: true
};

if (typeof window !== 'undefined') {
  window.AMAZON_STORE_ID = AMAZON_STORE_ID;
  window.AMAZON_TRACKING_ID = AMAZON_TRACKING_ID;
  window.AMAZON_TRACKING_IDS = AMAZON_TRACKING_IDS;
  window.AMAZON_MARKETPLACES = AMAZON_MARKETPLACES;
  window.INTERNATIONAL_SEO_CONFIG = INTERNATIONAL_SEO_CONFIG;
  window.YAHYA_AUTHOR = YAHYA_AUTHOR;
  window.FATIMA_AUTHOR = FATIMA_AUTHOR;
}

const CATEGORIES = [
  { id: 'all', name: 'All Deals', icon: 'sparkles' },
  { id: 'electronic', name: 'Electronic', icon: 'laptop' },
  { id: 'home-kitchen', name: 'Home and Kitchen', icon: 'utensils' },
  { id: 'health-care', name: 'Health Care', icon: 'heart-pulse' },
  { id: 'womens-fashion', name: "Women's Fashion", icon: 'shirt' },
  { id: 'mens-fashion', name: "Men's Fashion", icon: 'watch' },
  { id: 'girls-fashion', name: "Girl's Fashion", icon: 'sparkle' },
  { id: 'boys-fashion', name: "Boy's Fashion", icon: 'compass' }
];

const HERO_CONFIG = {
  'all': {
    title: 'Curated Amazon Deals & Verified Steals',
    subtitle: 'Daily tested recommendations across tech, home, style & wellness — handpicked to maximize your savings.',
    badge: '🔥 Handpicked Today',
    gradient: 'from-blue-600 via-indigo-600 to-purple-600',
    stats: '50+ Verified Deals · Up to 65% OFF'
  },
  'home-kitchen': {
    title: 'Top Upgrades for Your Home & Kitchen',
    subtitle: 'From best-selling air fryers to aesthetic barware and smart kitchen gadgets reviewed by real home cooks.',
    badge: '🍳 Chef & Home Favorite',
    gradient: 'from-amber-500 via-orange-600 to-red-600',
    stats: '14 Active Deals · Avg 30% Savings'
  },
  'health-care': {
    title: 'Personal Wellness, Self-Care & Health Essentials',
    subtitle: 'Medical-grade devices, daily supplements, dental care, and recovery tools tested for real results.',
    badge: '🌿 Health & Wellness',
    gradient: 'from-emerald-500 via-teal-600 to-cyan-600',
    stats: '9 Active Deals · Dermatologist & Clinician Picks'
  },
  'womens-fashion': {
    title: "Trending Women's Wardrobe & Viral Fits",
    subtitle: 'Capsule wardrobe staples, designer-dupe knitwear, timeless bags, and comfortable luxury basics.',
    badge: '✨ Viral Style Finds',
    gradient: 'from-pink-500 via-rose-600 to-fuchsia-600',
    stats: '18 Active Deals · Prime Fast Shipping'
  },
  'mens-fashion': {
    title: "Men's Everyday Essentials & Modern Classic Fits",
    subtitle: 'Durable heavyweights, minimalist watches, premium outerwear, and footwear built for everyday wear.',
    badge: '👔 Men’s Collection',
    gradient: 'from-slate-700 via-zinc-800 to-neutral-900',
    stats: '12 Active Deals · Prime wardrobe eligible'
  },
  'girls-fashion': {
    title: "Girl's Playwear, Dresses & Seasonal Styles",
    subtitle: 'Breathable, durable, and adorable outfits engineered for playdates, school, and family festivities.',
    badge: '🎀 Cute & Durable',
    gradient: 'from-purple-500 via-pink-500 to-rose-400',
    stats: '10 Active Deals · Parent Approved'
  },
  'boys-fashion': {
    title: "Boy's Activewear, Rugged Layers & Outerwear",
    subtitle: 'Stain-resistant tech fabrics, reinforced knee joggers, and everyday sneakers that withstand play.',
    badge: '⚡ Built For Adventure',
    gradient: 'from-cyan-600 via-blue-600 to-indigo-700',
    stats: '8 Active Deals · Highly Rated'
  },
  'electronic': {
    title: 'Audio, Smart Home & Productivity Tech',
    subtitle: 'Flagship ANC headphones, ultra-compact gallium-nitride chargers, and ergonomic desk gear at all-time low prices.',
    badge: '⚡ Tech Value Drops',
    gradient: 'from-blue-600 via-cyan-600 to-teal-500',
    stats: '22 Active Deals · Lowest 30-Day Prices'
  }
};

const INITIAL_DEALS = [
  {
    id: 'deal-1',
    author: FATIMA_AUTHOR,
    title: 'CUBIOU Folding Sofa Bed, Convertible Sleeper Chair, Corduroy Boneless Couch',
    category: 'home-kitchen',
    price: 169.99,
    originalPrice: 169.99,
    rating: 4.3,
    reviewsCount: 1420,
    prime: true,
    tag: 'Top Pick',
    imageUrl: 'https://m.media-amazon.com/images/I/81rbumIhr-L._AC_SL1500_.jpg',
    affiliateLink: 'https://amzn.to/3W5FX9a',
    reviewText: 'Customers find the sofa bed comfortable and appreciate its appearance, describing it as a nice addition to their living room and saying their grandkids love it. The corduroy fabric feels wonderfully soft and durable.',
    timestamp: 'Just now',
    likes: 42,
    hasLiked: false,
    comments: []
  },
  {
    id: 'deal-2',
    author: FATIMA_AUTHOR,
    title: 'Ekouaer Women’s Silk Satin Pajama Set Short Sleeve Button Down Sleepwear',
    category: 'womens-fashion',
    price: 19.99,
    originalPrice: 19.99,
    rating: 4.3,
    reviewsCount: 8640,
    prime: true,
    tag: 'Top Pick',
    imageUrl: 'https://m.media-amazon.com/images/I/811YIcyM7uL._AC_SY741_.jpg',
    affiliateLink: 'https://amzn.to/4igyYl1',
    reviewText: 'Incredibly soft, lightweight, and comfortable satin pajama set — perfect for lounging or sleeping. The classic button-down top and matching shorts give a cute, chic silhouette that fits true to size.',
    timestamp: '1 hour ago',
    likes: 88,
    hasLiked: false,
    comments: []
  },
  {
    id: 'deal-3',
    author: FATIMA_AUTHOR,
    title: 'Dell 15.6" Laptop, FHD Screen, Intel Core 3 100U, 8GB RAM, Windows 11 Home',
    category: 'electronic',
    price: 484.98,
    originalPrice: 484.98,
    rating: 4.5,
    reviewsCount: 3120,
    prime: true,
    tag: 'Best Value',
    imageUrl: 'https://m.media-amazon.com/images/I/71Jz4wLU8JL._AC_SL1500_.jpg',
    affiliateLink: 'https://link.amazon/B02VUdAjZ',
    reviewText: 'Strikes the ideal balance of affordability and functionality. Features a bright, anti-glare matte display, HDMI port for multi-monitor setups, SD card slot, and responsive performance for browsing and daily multitasking.',
    timestamp: '2 hours ago',
    likes: 65,
    hasLiked: false,
    comments: []
  },
  {
    id: 'deal-4',
    author: FATIMA_AUTHOR,
    title: 'Tuffenough Solar Outdoor Lights 2500LM 210 LED Security Lights with Remote Control',
    category: 'home-kitchen',
    price: 19.99,
    originalPrice: 29.69,
    rating: 4.4,
    reviewsCount: 15400,
    prime: true,
    tag: 'Hot Deal',
    imageUrl: 'https://m.media-amazon.com/images/I/71vaZ6gUumL._AC_SL1500_.jpg',
    affiliateLink: 'https://link.amazon/B09lj5S4u',
    reviewText: 'Ultra-bright 2500LM solar security lights equipped with 210 LEDs, sensitive motion detection, and remote control. Dependable outdoor illumination that charges reliably even on overcast days.',
    timestamp: '3 hours ago',
    likes: 114,
    hasLiked: false,
    comments: []
  },
  {
    id: 'deal-5',
    author: FATIMA_AUTHOR,
    title: 'Farmhouse Leaves Throw Pillow Covers (Set of 2)',
    category: 'home-kitchen',
    price: 13.99,
    originalPrice: 13.99,
    rating: 4.7,
    reviewsCount: 4210,
    prime: true,
    tag: 'Best Value',
    imageUrl: 'https://m.media-amazon.com/images/I/91TSnWoFQEL._AC_SL1500_.jpg',
    affiliateLink: 'https://link.amazon/B0aFRbATv',
    reviewText: 'Modern botanical leaf pattern tailored from breathable, medium-weight cotton fabric. Pairs effortlessly with sofas, beds, and accent chairs while holding standard throw pillows securely.',
    timestamp: '4 hours ago',
    likes: 39,
    hasLiked: false,
    comments: []
  },
  {
    id: 'deal-6',
    author: FATIMA_AUTHOR,
    title: 'KMM Handheld Car Vacuum Cleaner and High-Power Cordless Air Duster',
    category: 'electronic',
    price: 22.42,
    originalPrice: 29.88,
    rating: 4.0,
    reviewsCount: 2890,
    prime: true,
    tag: 'Hot Deal',
    imageUrl: 'https://m.media-amazon.com/images/I/61rqqQdU2fL._AC_SL1500_.jpg',
    affiliateLink: 'https://link.amazon/B0dGzvApM',
    reviewText: 'Compact, portable 2-in-1 car vacuum and blower duster built for tight corners, air vents, and car cup holders. Impressive suction easily removes dirt, dust, and stubborn pet hair.',
    timestamp: '5 hours ago',
    likes: 53,
    hasLiked: false,
    comments: []
  },
  {
    id: 'deal-7',
    author: FATIMA_AUTHOR,
    title: "PULI Women's Pashmina Shawl Wrap, Large Bridal Evening & Winter Scarf",
    category: 'womens-fashion',
    price: 32.99,
    originalPrice: 32.99,
    rating: 4.5,
    reviewsCount: 7120,
    prime: true,
    tag: 'Trending',
    imageUrl: 'https://m.media-amazon.com/images/I/81KoHO9RGmL._AC_SX569_.jpg',
    affiliateLink: 'https://link.amazon/B09YOneKg',
    reviewText: 'Luxuriously thick, buttery soft wrap with a cashmere-like feel. Extremely versatile for evening weddings, casual cool-weather layering, or keeping warm during chilly flights.',
    timestamp: '6 hours ago',
    likes: 91,
    hasLiked: false,
    comments: []
  },
  {
    id: 'deal-8',
    author: FATIMA_AUTHOR,
    title: 'Large Gold Framed 3-Piece Abstract Wave Wall Art Set for Living Room',
    category: 'home-kitchen',
    price: 119.99,
    originalPrice: 119.99,
    rating: 4.8,
    reviewsCount: 1870,
    prime: true,
    tag: 'Top Pick',
    imageUrl: 'https://m.media-amazon.com/images/I/8137Df7wVBL._AC_SL1500_.jpg',
    affiliateLink: 'https://link.amazon/B02FgazPZ',
    reviewText: 'Stunning 3-piece framed wave triptych that creates an immediate gallery-grade focal point above living room sofas or headboards. Rich golden tones catch lighting with upscale modern elegance.',
    timestamp: '7 hours ago',
    likes: 124,
    hasLiked: false,
    comments: []
  },
  {
    id: 'deal-9',
    author: FATIMA_AUTHOR,
    title: 'Blue Gold Ocean Abstract Canvas Wall Art Decor (20" x 40" Horizontal Print)',
    category: 'home-kitchen',
    price: 59.99,
    originalPrice: 59.99,
    rating: 4.6,
    reviewsCount: 3450,
    prime: true,
    tag: 'Top Pick',
    imageUrl: 'https://m.media-amazon.com/images/I/81zpCvah+eL._AC_SL1500_.jpg',
    affiliateLink: 'https://link.amazon/B0hATrk47',
    reviewText: 'Dramatic, swirling brushstrokes of ocean deep blues and shimmering gold accents. A bold statement piece designed to bring warmth and sophistication to contemporary living rooms.',
    timestamp: '8 hours ago',
    likes: 76,
    hasLiked: false,
    comments: []
  },
  {
    id: 'deal-10',
    author: FATIMA_AUTHOR,
    title: 'Sony WH-1000XM5 Premium Noise Cancelling Wireless Headphones (Smoky Pink)',
    category: 'electronic',
    price: 199.99,
    originalPrice: 399.99,
    rating: 4.2,
    reviewsCount: 16800,
    prime: true,
    tag: 'Hot Deal',
    imageUrl: 'https://m.media-amazon.com/images/I/51A17cIdhKL._AC_SL1080_.jpg',
    affiliateLink: 'https://link.amazon/B01x6QHZ7',
    reviewText: 'Flagship active noise cancellation featuring an ultra-comfortable lightweight headband, distinctive smoky pink finish, 30-hour battery life, and crystal-clear hands-free microphone quality.',
    timestamp: '9 hours ago',
    likes: 215,
    hasLiked: false,
    comments: []
  },
  {
    id: 'deal-11',
    author: FATIMA_AUTHOR,
    title: 'Ninja AF101 Air Fryer, 4-Quart Capacity, 4-in-1 Ceramic Coated Nonstick Basket',
    category: 'home-kitchen',
    price: 119.00,
    originalPrice: 119.00,
    rating: 4.7,
    reviewsCount: 52000,
    prime: true,
    tag: 'Best Value',
    imageUrl: 'https://m.media-amazon.com/images/I/719b2ik3wOL._AC_SL1500_.jpg',
    affiliateLink: 'https://link.amazon/B0aIjDkX2',
    reviewText: 'Cuts cooking times in half while delivering crisp, golden results with up to 75% less fat than deep frying. The nonstick ceramic basket cleans effortlessly in seconds.',
    timestamp: '11 hours ago',
    likes: 184,
    hasLiked: false,
    comments: []
  },
  {
    id: 'deal-12',
    author: YAHYA_AUTHOR,
    title: 'Jersey Pashmina Shawl Wraps for Women | USA-Made Travel Blanket Scarf',
    category: 'womens-fashion',
    price: 48.00,
    originalPrice: 48.00,
    rating: 4.6,
    reviewsCount: 2980,
    prime: true,
    tag: 'Trending',
    imageUrl: 'https://m.media-amazon.com/images/I/61D07CpoLCL._AC_SX679_.jpg',
    affiliateLink: 'https://link.amazon/B024XvEdS',
    reviewText: 'Beloved by frequent travelers for its buttery softness and versatility. Rolls up compact enough for small totes, yet unfolds generously to keep you warm on chilly airplane flights.',
    timestamp: '13 hours ago',
    likes: 62,
    hasLiked: false,
    comments: []
  },
  {
    id: 'deal-13',
    author: YAHYA_AUTHOR,
    title: 'Android 16 Tablet with Detachable Keyboard, 10.1" AI Screen, 32GB RAM, 256GB',
    category: 'electronic',
    price: 129.99,
    originalPrice: 179.99,
    rating: 4.4,
    reviewsCount: 4500,
    prime: true,
    tag: 'Hot Deal',
    imageUrl: 'https://m.media-amazon.com/images/I/91y6sn0qM9L._AC_SL1500_.jpg',
    affiliateLink: 'https://link.amazon/B077iSmgH',
    reviewText: 'High-value 2-in-1 productivity package featuring an expansive 10.1-inch IPS display, responsive keyboard bundle, generous 256GB storage, and zero-lag streaming performance.',
    timestamp: '15 hours ago',
    likes: 98,
    hasLiked: false,
    comments: []
  },
  {
    id: 'deal-14',
    author: YAHYA_AUTHOR,
    title: 'Flagship 15.6" Business Laptop Computer, 16GB RAM, 512GB Fast SSD, Intel Core i5',
    category: 'electronic',
    price: 599.99,
    originalPrice: 599.99,
    rating: 4.4,
    reviewsCount: 3890,
    prime: true,
    tag: 'Best Value',
    imageUrl: 'https://m.media-amazon.com/images/I/71jpKhLiXcL._AC_SL1500_.jpg',
    affiliateLink: 'https://link.amazon/B012oMI9x',
    reviewText: 'Engineered for smooth everyday business workflows, multitasking, and browsing. Offers 16GB memory, 512GB SSD storage, an ergonomic keyboard, and anti-glare screen for long work sessions.',
    timestamp: '18 hours ago',
    likes: 82,
    hasLiked: false,
    comments: []
  },
  {
    id: 'deal-15',
    author: YAHYA_AUTHOR,
    title: 'Desktop Computer Bundle with 21.5" FHD Monitor Set, Intel Core i5-6500 3.2GHz',
    category: 'electronic',
    price: 234.00,
    originalPrice: 234.00,
    rating: 3.9,
    reviewsCount: 1650,
    prime: true,
    tag: 'Best Value',
    imageUrl: 'https://m.media-amazon.com/images/I/61y26GJgi1L._AC_SL1000_.jpg',
    affiliateLink: 'https://link.amazon/B00CyKQpG',
    reviewText: 'Complete desktop bundle including a crisp 21.5-inch 1080p monitor. Reliable computing power tailored for home office productivity, school assignments, and casual entertainment.',
    timestamp: '1 day ago',
    likes: 47,
    hasLiked: false,
    comments: []
  },
  {
    id: 'deal-16',
    author: YAHYA_AUTHOR,
    title: '24" All-in-One Desktop Computer, Intel i5 CPU up to 3.3GHz, 16GB RAM, 256GB SSD',
    category: 'electronic',
    price: 369.99,
    originalPrice: 369.99,
    rating: 3.7,
    reviewsCount: 1420,
    prime: true,
    tag: 'Best Value',
    imageUrl: 'https://m.media-amazon.com/images/I/71rF--IgxWL._AC_SL1254_.jpg',
    affiliateLink: 'https://link.amazon/B05ZiAJEp',
    reviewText: 'Space-saving all-in-one design with a slim-bezel 24-inch screen, rapid 256GB SSD boot speeds, and 16GB memory. Ready to use immediately right out of the box.',
    timestamp: '1 day ago',
    likes: 56,
    hasLiked: false,
    comments: []
  }
];


