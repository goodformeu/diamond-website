/**
 * Real Diamond Coiffures content, sourced verbatim from the official site
 * (diamond-coiffures-barbershop.nl) via the content inventory. Nothing here
 * is invented — update this file, not the scene components, when real
 * content changes. A price that Diamond does not publish is shown as
 * "Prijs niet vermeld" — never guessed. A missing photo uses the bracketed
 * "[REAL DIAMOND PHOTOS]" placeholder instead (see ui/PhotoPlaceholder).
 */

export type PriceListItem = {
  name: string;
  price: string;
};

/** Complete official price list ("Prijslijst" / "Dames en Heren"), in source order. */
export const PRICE_LIST: PriceListItem[] = [
  { name: "Kinderen t/m 10 jaar", price: "€ 20,00" },
  { name: "Knippen", price: "€ 30,00" },
  { name: "Knippen ponny", price: "€ 15,00" },
  { name: "Knippen wassen drogen", price: "€ 30,00" },
  { name: "Knippen wassen föhnen kort haar", price: "€ 34,00" },
  { name: "Knippen wassen föhnen lang haar", price: "€ 42,00" },
  { name: "Wassen föhnen kort haar", price: "€ 30,00" },
  { name: "Wassen föhnen lang haar", price: "€ 32,00" },
  { name: "Wassen krul föhnen", price: "€ 39,00" },
  { name: "Wassen steampod", price: "€ 32,00" },
  { name: "Haar masker", price: "€ 20,00" },
  { name: "Permanent v.a.", price: "€ 72,00" },
  { name: "Kleuren", price: "€ 60,00" },
  { name: "Eigen verf inzetten", price: "€ 30,00" },
  { name: "Uitgroei verven v.a.", price: "€ 50,00" },
  { name: "Complete kleur kort haar", price: "€ 60,00" },
  { name: "Complete kleur middellang haar", price: "€ 65,00" },
  { name: "Complete kleur lang haar", price: "€ 80,00" },
  { name: "Dialight/Richesse kort haar", price: "€ 28,00" },
  { name: "Dialight/Richesse middellang haar", price: "€ 42,00" },
  { name: "Dialight/Richesse lang haar", price: "€ 52,00" },
  { name: "Oplichten/blonderen compleet kort", price: "€ 42,00" },
  { name: "Oplichten/blonderen compleet middellang haar", price: "Prijs niet vermeld" },
  { name: "Oplichten/blonderen compleet lang haar", price: "€ 80,00" },
  { name: "Highlights/coupe soleil kort haar", price: "€ 60,00" },
  { name: "Highlights/coupe soleil", price: "€ 59,00" },
  { name: "Highlights/coupe soleil lang haar", price: "€ 120,00" },
  { name: "Lowlights kort haar", price: "€ 47,00" },
  { name: "Lowlights middellang haar", price: "€ 90,00" },
  { name: "Muts coupe soleil kort haar", price: "€ 42,00" },
  { name: "Muts coupe soleil middellang haar", price: "€ 49,00" },
  { name: "Balayage middellang haar", price: "€ 70,00" },
  { name: "Balayage lang haar", price: "€ 120,00" },
];

/**
 * Curated subset of PRICE_LIST for Scene 4's cinematic highlight reel — not
 * exhaustive by design (the brief asks for a big typographic moment, not a
 * price table). The full PRICE_LIST still renders beneath it so nothing is
 * hidden. "Keratine behandeling" is a real named service (official
 * /services page) that Diamond does not list a price for anywhere on the
 * site — shown as "Prijs niet vermeld" rather than an invented number.
 */
export const CRAFT_HIGHLIGHTS: PriceListItem[] = [
  { name: "Knippen", price: "€ 30,00" },
  { name: "Keratine behandeling", price: "Prijs niet vermeld" },
  { name: "Kleuren", price: "€ 60,00" },
  { name: "Balayage lang haar", price: "€ 120,00" },
  { name: "Knippen wassen föhnen lang haar", price: "€ 42,00" },
];

/**
 * Official "over ons" text, split into short beats for Scene 6's pacing.
 * Each fragment is lifted directly from the source sentence — nothing paraphrased
 * beyond trimming. Source: "Diamond coiffures Barbershop is een trendy kapsalon
 * waar zowel dames als heren terecht kunnen voor professionele kappers- en
 * barbiersdiensten. Ons team van deskundige stylisten staat garant voor kwaliteit
 * en streeft ernaar om elke klant met een tevreden gevoel de deur uit te laten gaan."
 */
export const ABOUT_BEATS = [
  "Een trendy kapsalon",
  "Dames & heren",
  "Professionele kappers- en barbiersdiensten",
  "Deskundige stylisten",
  "Garant voor kwaliteit",
] as const;

export const ABOUT_CLOSING = "Elke klant tevreden de deur uit.";

export const ADDRESS = "Plansoenstraat 15, 1441CW Purmerend";

/** Digits are exactly as listed on the official site; spaced here only for readability. */
export const PHONE_DISPLAY = "06 87 15 24 15";
export const PHONE_RAW = "0687152415";

export type OpeningHoursRow = { day: string; hours: string };

export const OPENING_HOURS: OpeningHoursRow[] = [
  { day: "Maandag", hours: "09:00 – 18:00" },
  { day: "Dinsdag", hours: "09:00 – 18:00" },
  { day: "Woensdag", hours: "09:00 – 18:00" },
  { day: "Donderdag", hours: "09:00 – 18:00" },
  { day: "Vrijdag", hours: "09:00 – 20:00" },
  { day: "Zaterdag", hours: "09:00 – 18:00" },
  { day: "Zondag", hours: "12:00 – 18:00" },
];

/** Real Salonized booking widget URL from the official site (verbatim, including its domain typo). */
export const BOOKING_URL = "https://diamon-coiffuresbarbershop.salonized.com/widget_bookings/new";

export const WHATSAPP_URL = "https://api.whatsapp.com/send?phone=687152415";
export const INSTAGRAM_URL = "https://instagram.com/Diamond.coiffures.barbershop";
export const FACEBOOK_URL = "https://facebook.com/profile.php?id=100047720241355";

/**
 * TikTok is intentionally omitted: the value scraped from the official site
 * ("https://tiktok.com/@Diamond coiffures Barbershop") contains raw spaces and
 * is not a usable URL. Rather than guess a corrected handle, it's left out
 * until the real TikTok URL can be confirmed.
 */
