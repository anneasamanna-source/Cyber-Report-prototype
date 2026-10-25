import React, { useState, useEffect, useRef } from "react";

/* ---------- Types ---------- */
type Lang = "en" | "hi" | "bn" | "mr" | "te" | "ta" | "gu" | "ur" | "kn" | "ml";
type Route = "home" | "report" | "track" | "help";
interface Category { id: string; icon: IconName; title: string; hint: string }

/* ---------- Icons (inline, Lucide-style 24px stroke set) ---------- */
const PATHS = {
  phone: "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4",
  wallet: "M20 7H5a2 2 0 0 1 0-4h13v4z M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1 M16 14h.01",
  users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M22 21v-2a4 4 0 0 0-3-3.9 M16 3.1a4 4 0 0 1 0 7.8",
  lock: "M5 11h14v10H5z M8 11V7a4 4 0 0 1 8 0v4",
  heart: "M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z",
  mail: "M3 5h18v14H3z M3 7l9 6 9-6",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.3-4.3",
  help: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3 M12 17h.01",
  chev: "M6 9l6 6 6-6",
  menu: "M4 6h16 M4 12h16 M4 18h16",
  x: "M18 6L6 18 M6 6l12 12",
  arrow: "M5 12h14 M13 6l6 6-6 6",
  file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M9 13h6 M9 17h6",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2",
  eye: "M2 12s4-8 10-8 10 8 10 8-4 8-10 8S2 12 2 12z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  globe: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M2 12h20 M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20",
  contrast: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 2v20 M12 2a10 10 0 0 1 0 20z",
  check: "M20 6L9 17l-5-5",
  volume: "M11 5L6 9H2v6h4l5 4z M15.5 8.5a5 5 0 0 1 0 7 M19 5a10 10 0 0 1 0 14",
} as const;
type IconName = keyof typeof PATHS;

function Icon({ name, size = 20, className = "" }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d={PATHS[name]} />
    </svg>
  );
}

/* ---------- Content (demo copy, English + Hindi for key strings) ---------- */
const T0 = {
  en: {
    skip: "Skip to main content", listen: "Listen", demo: "Independent design prototype. Not an official government service. Demo data only; nothing you enter is sent anywhere.",
    nav: { home: "Home", report: "Report a crime", track: "Track a complaint", help: "Help & FAQs" },
    title: "Reporting a cybercrime, one calm step at a time",
    lead: "Tell us what happened in your own words. We will ask only what is needed, save your progress, and show you exactly what happens next.",
    cta: "Report a cybercrime", cta2: "Track a complaint",
    urgentH: "Lost money in the last few hours?", urgentP: "Call the national helpline 1930 right away. Speed matters, because early reporting gives the best chance of stopping a transfer.",
    call: "Call 1930", urgentNote: "Keep your bank name, transaction ID, amount and time ready. If you can’t talk, you can still start a report here.",
    catH: "What happened?", catP: "Pick the closest match. You can change it later, and you don’t need to know the legal name of the crime.",
    howH: "What to expect", faqH: "Common questions", prepH: "Have these ready if you can",
  },
  hi: {
    skip: "मुख्य सामग्री पर जाएँ", listen: "सुनें", demo: "यह एक स्वतंत्र डिज़ाइन प्रोटोटाइप है, आधिकारिक सरकारी सेवा नहीं। केवल डेमो डेटा; आपकी जानकारी कहीं नहीं भेजी जाती।",
    nav: { home: "मुखपृष्ठ", report: "अपराध की रिपोर्ट करें", track: "शिकायत की स्थिति", help: "सहायता और प्रश्न" },
    title: "साइबर अपराध की रिपोर्ट, एक-एक आसान कदम में",
    lead: "जो हुआ, अपने शब्दों में बताइए। हम केवल ज़रूरी बातें पूछेंगे, आपकी प्रगति सहेजेंगे और आगे क्या होगा यह साफ़ दिखाएँगे।",
    cta: "साइबर अपराध की रिपोर्ट करें", cta2: "शिकायत की स्थिति देखें",
    urgentH: "क्या अभी कुछ घंटों में पैसे कटे हैं?", urgentP: "तुरंत राष्ट्रीय हेल्पलाइन 1930 पर कॉल करें। जल्दी रिपोर्ट करने से लेन-देन रोकने की संभावना बढ़ती है।",
    call: "1930 पर कॉल करें", urgentNote: "बैंक का नाम, ट्रांज़ैक्शन आईडी, राशि और समय तैयार रखें। बात न कर सकें तो यहाँ रिपोर्ट शुरू कर सकते हैं।",
    catH: "क्या हुआ?", catP: "सबसे मिलता-जुलता विकल्प चुनें। बाद में बदल सकते हैं; अपराध का कानूनी नाम जानना ज़रूरी नहीं।",
    howH: "आगे क्या होगा", faqH: "आम प्रश्न", prepH: "हो सके तो ये तैयार रखें",
  },
  bn: {
    nav: { home: "হোম", report: "অপরাধ জানান", track: "অভিযোগের অবস্থা", help: "সহায়তা ও প্রশ্ন" },
    title: "সাইবার অপরাধের অভিযোগ, ধাপে ধাপে সহজে", lead: "কী ঘটেছে নিজের ভাষায় বলুন। আমরা শুধু প্রয়োজনীয় তথ্য চাইব।",
    cta: "সাইবার অপরাধ জানান", cta2: "অভিযোগের অবস্থা দেখুন", urgentH: "কিছুক্ষণ আগে কি টাকা চলে গেছে?",
    urgentP: "এখনই জাতীয় হেল্পলাইন 1930 নম্বরে ফোন করুন। দ্রুত জানালে লেনদেন আটকানোর সম্ভাবনা বাড়ে।", call: "1930 নম্বরে ফোন করুন", catH: "কী ঘটেছে?", listen: "শুনুন",
  },
  mr: {
    nav: { home: "मुख्यपृष्ठ", report: "गुन्हा नोंदवा", track: "तक्रारीची स्थिती", help: "मदत व प्रश्न" },
    title: "सायबर गुन्ह्याची तक्रार, सोप्या पायऱ्यांमध्ये", lead: "काय घडले ते तुमच्या शब्दांत सांगा. आम्ही फक्त आवश्यक तेवढेच विचारू.",
    cta: "सायबर गुन्हा नोंदवा", cta2: "तक्रारीची स्थिती पाहा", urgentH: "काही तासांत पैसे गेले आहेत का?",
    urgentP: "लगेच राष्ट्रीय हेल्पलाइन 1930 वर कॉल करा. लवकर कळवल्यास व्यवहार थांबवण्याची शक्यता वाढते.", call: "1930 वर कॉल करा", catH: "काय घडले?", listen: "ऐका",
  },
  te: {
    nav: { home: "హోమ్", report: "నేరాన్ని నివేదించండి", track: "ఫిర్యాదు స్థితి", help: "సహాయం & ప్రశ్నలు" },
    title: "సైబర్ నేర ఫిర్యాదు, సులభమైన దశల్లో", lead: "ఏం జరిగిందో మీ మాటల్లో చెప్పండి. అవసరమైనవి మాత్రమే అడుగుతాం.",
    cta: "సైబర్ నేరాన్ని నివేదించండి", cta2: "ఫిర్యాదు స్థితి చూడండి", urgentH: "కొన్ని గంటల క్రితం డబ్బు పోయిందా?",
    urgentP: "వెంటనే జాతీయ హెల్ప్‌లైన్ 1930కి కాల్ చేయండి. త్వరగా తెలిపితే లావాదేవీని ఆపే అవకాశం పెరుగుతుంది.", call: "1930కి కాల్ చేయండి", catH: "ఏం జరిగింది?", listen: "వినండి",
  },
  ta: {
    nav: { home: "முகப்பு", report: "குற்றத்தைப் புகாரளி", track: "புகார் நிலை", help: "உதவி & கேள்விகள்" },
    title: "சைபர் குற்றப் புகார், எளிய படிகளில்", lead: "என்ன நடந்தது என்பதை உங்கள் வார்த்தைகளில் சொல்லுங்கள். தேவையானவற்றை மட்டுமே கேட்போம்.",
    cta: "சைபர் குற்றத்தைப் புகாரளி", cta2: "புகார் நிலையைப் பார்", urgentH: "சில மணி நேரத்துக்குள் பணம் போனதா?",
    urgentP: "உடனே தேசிய உதவி எண் 1930-ஐ அழையுங்கள். விரைவாகத் தெரிவித்தால் பரிவர்த்தனையை நிறுத்த வாய்ப்பு அதிகம்.", call: "1930-ஐ அழைக்கவும்", catH: "என்ன நடந்தது?", listen: "கேளுங்கள்",
  },
  gu: {
    nav: { home: "હોમ", report: "ગુનો નોંધાવો", track: "ફરિયાદની સ્થિતિ", help: "મદદ અને પ્રશ્નો" },
    title: "સાયબર ગુનાની ફરિયાદ, સરળ પગલાંમાં", lead: "શું થયું તે તમારા શબ્દોમાં જણાવો. અમે ફક્ત જરૂરી માહિતી પૂછીશું.",
    cta: "સાયબર ગુનો નોંધાવો", cta2: "ફરિયાદની સ્થિતિ જુઓ", urgentH: "થોડા કલાકોમાં પૈસા ગયા છે?",
    urgentP: "તરત જ રાષ્ટ્રીય હેલ્પલાઇન 1930 પર કૉલ કરો. વહેલી જાણ કરવાથી વ્યવહાર અટકાવવાની શક્યતા વધે છે.", call: "1930 પર કૉલ કરો", catH: "શું થયું?", listen: "સાંભળો",
  },
  ur: {
    nav: { home: "ہوم", report: "جرم کی رپورٹ کریں", track: "شکایت کی صورتحال", help: "مدد اور سوالات" },
    title: "سائبر جرم کی رپورٹ، آسان مراحل میں", lead: "جو ہوا اپنے الفاظ میں بتائیں۔ ہم صرف ضروری باتیں پوچھیں گے۔",
    cta: "سائبر جرم کی رپورٹ کریں", cta2: "شکایت کی صورتحال دیکھیں", urgentH: "کیا چند گھنٹوں میں پیسے نکلے ہیں؟",
    urgentP: "فوراً قومی ہیلپ لائن 1930 پر کال کریں۔ جلد اطلاع دینے سے لین دین روکنے کا امکان بڑھ جاتا ہے۔", call: "1930 پر کال کریں", catH: "کیا ہوا؟", listen: "سنیں",
  },
  kn: {
    nav: { home: "ಮುಖಪುಟ", report: "ಅಪರಾಧ ವರದಿ ಮಾಡಿ", track: "ದೂರಿನ ಸ್ಥಿತಿ", help: "ಸಹಾಯ ಮತ್ತು ಪ್ರಶ್ನೆಗಳು" },
    title: "ಸೈಬರ್ ಅಪರಾಧ ದೂರು, ಸುಲಭ ಹಂತಗಳಲ್ಲಿ", lead: "ಏನಾಯಿತು ಎಂಬುದನ್ನು ನಿಮ್ಮ ಮಾತಿನಲ್ಲಿ ಹೇಳಿ. ಅಗತ್ಯವಿರುವುದನ್ನು ಮಾತ್ರ ಕೇಳುತ್ತೇವೆ.",
    cta: "ಸೈಬರ್ ಅಪರಾಧ ವರದಿ ಮಾಡಿ", cta2: "ದೂರಿನ ಸ್ಥಿತಿ ನೋಡಿ", urgentH: "ಕೆಲವು ಗಂಟೆಗಳೊಳಗೆ ಹಣ ಹೋಗಿದೆಯೇ?",
    urgentP: "ತಕ್ಷಣ ರಾಷ್ಟ್ರೀಯ ಸಹಾಯವಾಣಿ 1930ಕ್ಕೆ ಕರೆ ಮಾಡಿ. ಬೇಗ ತಿಳಿಸಿದರೆ ವಹಿವಾಟು ತಡೆಯುವ ಸಾಧ್ಯತೆ ಹೆಚ್ಚು.", call: "1930ಕ್ಕೆ ಕರೆ ಮಾಡಿ", catH: "ಏನಾಯಿತು?", listen: "ಆಲಿಸಿ",
  },
  ml: {
    nav: { home: "ഹോം", report: "കുറ്റം റിപ്പോർട്ട് ചെയ്യുക", track: "പരാതിയുടെ നില", help: "സഹായവും ചോദ്യങ്ങളും" },
    title: "സൈബർ കുറ്റകൃത്യ പരാതി, എളുപ്പമുള്ള ഘട്ടങ്ങളിൽ", lead: "എന്താണ് സംഭവിച്ചതെന്ന് നിങ്ങളുടെ വാക്കുകളിൽ പറയൂ. ആവശ്യമുള്ളത് മാത്രം ചോദിക്കും.",
    cta: "സൈബർ കുറ്റം റിപ്പോർട്ട് ചെയ്യുക", cta2: "പരാതിയുടെ നില കാണുക", urgentH: "ഏതാനും മണിക്കൂറുകൾക്കുള്ളിൽ പണം നഷ്ടമായോ?",
    urgentP: "ഉടൻ ദേശീയ ഹെൽപ്പ്‌ലൈൻ 1930-ൽ വിളിക്കൂ. വേഗം അറിയിച്ചാൽ ഇടപാട് തടയാൻ സാധ്യത കൂടും.", call: "1930-ൽ വിളിക്കുക", catH: "എന്താണ് സംഭവിച്ചത്?", listen: "കേൾക്കുക",
  },
} as const;

const CATEGORIES: Category[] = [
  { id: "fraud", icon: "wallet", title: "Money taken or UPI / card fraud", hint: "Fake calls, payment links, loan or investment scams" },
  { id: "social", icon: "users", title: "Fake profile or account takeover", hint: "Someone is pretending to be you or has your account" },
  { id: "harass", icon: "mail", title: "Threats, blackmail or harassment", hint: "Messages, photos or videos used to pressure you" },
  { id: "women", icon: "heart", title: "Offence against a woman or child", hint: "Online abuse, stalking or harmful content" },
  { id: "hack", icon: "lock", title: "Hacking or data theft", hint: "Device locked, files encrypted, data leaked" },
  { id: "other", icon: "help", title: "I’m not sure", hint: "We’ll guide you with a few simple questions" },
];

const STEPS = [
  { t: "Choose what happened", d: "Pick the closest situation. No legal terms needed." },
  { t: "Describe it and add evidence", d: "Screenshots, receipts and chats help. They are optional at first." },
  { t: "Review and submit", d: "Check everything on one page before you send." },
  { t: "Get an acknowledgement number", d: "Use it to track progress. Demo numbers here are clearly fake." },
];

const PREP = ["Date and time of the incident", "Phone number, account or website involved", "Payment details, if money was lost", "Screenshots or chat messages"];

const FAQS = [
  { q: "Is this the official reporting portal?", a: "No. This is an independent design prototype made to explore a clearer experience. It does not connect to any police or government system, and no complaint can be filed here." },
  { q: "What should I do first if money was taken?", a: "Call 1930 as soon as possible, and contact your bank. Fast action gives the best chance of stopping a transfer. This prototype only points you to the helpline." },
  { q: "Do I need evidence before I start?", a: "In this prototype, no. You can begin with a short description and add files later. Rules on the real service may differ, so check it directly." },
  { q: "Will my information be stored?", a: "Nothing you type here leaves your browser, and the prototype uses made-up sample data only. Please don’t enter real personal details." },
];

/* Missing strings in a language fall back to English */
const T = new Proxy({} as Record<Lang, typeof T0.en>, {
  get: (_t, l: string) => {
    const o: any = (T0 as any)[l] || {};
    return { ...T0.en, ...o, nav: { ...T0.en.nav, ...(o.nav || {}) } };
  },
});

const LANGS: { code: Lang; native: string; en: string; dir?: "rtl" }[] = [
  { code: "en", native: "English", en: "English" }, { code: "hi", native: "हिन्दी", en: "Hindi" },
  { code: "bn", native: "বাংলা", en: "Bengali" }, { code: "mr", native: "मराठी", en: "Marathi" },
  { code: "te", native: "తెలుగు", en: "Telugu" }, { code: "ta", native: "தமிழ்", en: "Tamil" },
  { code: "gu", native: "ગુજરાતી", en: "Gujarati" }, { code: "ur", native: "اردو", en: "Urdu", dir: "rtl" },
  { code: "kn", native: "ಕನ್ನಡ", en: "Kannada" }, { code: "ml", native: "മലയാളം", en: "Malayalam" },
];
const TTS: Record<Lang, string> = { en: "en-IN", hi: "hi-IN", bn: "bn-IN", mr: "mr-IN", te: "te-IN", ta: "ta-IN", gu: "gu-IN", ur: "ur-IN", kn: "kn-IN", ml: "ml-IN" };

/* First-visit language chooser: big native-script buttons, no reading of English needed */
function LangDialog({ lang, onPick, onClose }: { lang: Lang; onPick: (l: Lang) => void; onClose: () => void }) {
  const first = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    first.current?.focus();
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);
  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/50 sm:place-items-center sm:p-6" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="lgh" onClick={(e) => e.stopPropagation()} className="max-h-[92vh] w-full max-w-xl overflow-auto rounded-t-3xl bg-bg p-6 sm:rounded-3xl">
        <div className="flex items-start justify-between gap-4">
          <h2 id="lgh" className="text-2xl font-bold text-navy">Choose your language / भाषा चुनें</h2>
          <button onClick={onClose} aria-label="Close" className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-line"><Icon name="x" /></button>
        </div>
        <ul className="mt-5 grid grid-cols-2 gap-3">
          {LANGS.map((l, i) => (
            <li key={l.code}>
              <button ref={i === 0 ? first : undefined} lang={l.code} onClick={() => onPick(l.code)} aria-pressed={l.code === lang}
                className={"flex min-h-[64px] w-full flex-col items-start justify-center rounded-2xl border-2 px-4 text-left " + (l.code === lang ? "border-navy bg-soft" : "border-line hover:border-navy")}>
                <span className="text-xl font-semibold">{l.native}</span>
                <span className="text-sm text-muted">{l.en}</span>
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm text-muted">You can change language any time from the bar at the top. Translations are drafts for this prototype and need review by native speakers.</p>
      </div>
    </div>
  );
}

/* ---------- Routing (hash based) ---------- */
function useRoute(): [Route, (r: Route) => void] {
  const parse = (): Route => {
    const h = (window.location.hash || "").replace("#", "");
    return (["home", "report", "track", "help"] as string[]).includes(h) ? (h as Route) : "home";
  };
  const [route, setRoute] = useState<Route>(parse());
  useEffect(() => {
    const f = () => setRoute(parse());
    window.addEventListener("hashchange", f);
    return () => window.removeEventListener("hashchange", f);
  }, []);
  const go = (r: Route) => {
    setRoute(r);
    try { window.location.hash = r; } catch (e) {}
    window.scrollTo(0, 0);
    setTimeout(() => document.getElementById("main")?.focus(), 0);
  };
  return [route, go];
}

/* ---------- Reusable UI ---------- */
function Button({ children, onClick, variant = "primary", className = "", href }:
  { children: React.ReactNode; onClick?: () => void; variant?: "primary" | "secondary" | "saffron"; className?: string; href?: string }) {
  const base = "inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-xl font-semibold text-base transition-colors ";
  const v = {
    primary: "bg-navy text-onnavy hover:opacity-90",
    secondary: "bg-bg text-ink border-2 border-line hover:border-navy",
    saffron: "bg-saffron text-[#1A1100] hover:brightness-95",
  }[variant];
  if (href) return <a href={href} className={base + v + " " + className}>{children}</a>;
  return <button type="button" onClick={onClick} className={base + v + " " + className}>{children}</button>;
}

function Wrap({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={"mx-auto w-full max-w-6xl px-5 sm:px-8 " + className}>{children}</div>;
}

function Tricolour() {
  return <div className="flex h-1" aria-hidden="true"><i className="flex-1 bg-saffron" /><i className="flex-1 bg-line" /><i className="flex-1 bg-green" /></div>;
}

/* ---------- Accessibility toolbar ---------- */
function A11yBar({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const [size, setSize] = useState(100);
  const [hc, setHc] = useState(false);
  const [dark, setDark] = useState(false);
  useEffect(() => { document.documentElement.style.setProperty("--fs", size + "%"); }, [size]);
  useEffect(() => { document.documentElement.setAttribute("data-contrast", hc ? "high" : "normal"); }, [hc]);
  useEffect(() => { document.documentElement.setAttribute("data-theme", dark ? "dark" : "light"); }, [dark]);
  const b = "min-h-[36px] min-w-[36px] px-2 rounded-md border border-line text-sm font-semibold hover:border-navy ";
  return (
    <div role="region" aria-label="Accessibility and language" className="bg-soft border-b border-line">
      <Wrap className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted">Text size</span>
          <button className={b} aria-label="Decrease text size" disabled={size <= 90} onClick={() => setSize(size - 10)}>A−</button>
          <button className={b} aria-label="Reset text size" onClick={() => setSize(100)}>A</button>
          <button className={b} aria-label="Increase text size" disabled={size >= 130} onClick={() => setSize(size + 10)}>A+</button>
          <button className={b + (hc ? "bg-navy text-onnavy" : "")} aria-pressed={hc} onClick={() => setHc(!hc)}>
            <span className="inline-flex items-center gap-1"><Icon name="contrast" size={16} />Contrast</span>
          </button>
          <button className={b + (dark ? "bg-navy text-onnavy" : "")} aria-pressed={dark} onClick={() => setDark(!dark)}>Dark</button>
        </div>
        <label className="flex items-center gap-2">
          <Icon name="globe" size={16} />
          <span className="sr-only">Language</span>
          <select value={lang} onChange={(e) => setLang(e.target.value as Lang)}
            className="min-h-[36px] rounded-md border border-line bg-bg px-2 text-sm font-semibold">
            {LANGS.map((l) => <option key={l.code} value={l.code}>{l.native}</option>)}
            
          </select>
        </label>
      </Wrap>
    </div>
  );
}

/* ---------- Header ---------- */
function Header({ route, go, lang }: { route: Route; go: (r: Route) => void; lang: Lang }) {
  const [open, setOpen] = useState(false);
  const t = T[lang];
  const items: Route[] = ["home", "report", "track", "help"];
  return (
    <header className="sticky top-0 z-30 bg-bg/95 backdrop-blur border-b border-line" style={{ paddingTop: "env(safe-area-inset-top,0px)" }}>
      <Wrap className="flex items-center justify-between py-3">
        <button onClick={() => go("home")} className="flex items-center gap-3 text-left" aria-label="Cyber Report prototype, go to home">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy text-onnavy"><Icon name="shield" /></span>
          <span className="leading-tight">
            <span className="block font-bold text-lg" style={{ fontFamily: "'Source Serif 4',serif" }}>Cyber Report</span>
            <span className="block text-xs text-muted">Redesign prototype</span>
          </span>
        </button>
        <nav aria-label="Main" className="hidden md:flex items-center gap-1">
          {items.map((r) => (
            <button key={r} onClick={() => go(r)} aria-current={route === r ? "page" : undefined}
              className={"min-h-[44px] px-4 rounded-lg font-semibold " + (route === r ? "text-navy border-b-4 border-saffron rounded-b-none" : "text-muted hover:text-ink")}>
              {t.nav[r]}
            </button>
          ))}
        </nav>
        <a href="tel:1930" className="hidden md:inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-saffron px-4 font-semibold text-[#1A1100]"><Icon name="phone" size={18} />Call 1930</a>
        <button className="md:hidden grid h-11 w-11 place-items-center rounded-lg border border-line" aria-expanded={open} aria-controls="mnav"
          aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>
          <Icon name={open ? "x" : "menu"} />
        </button>
      </Wrap>
      {open && (
        <nav id="mnav" aria-label="Main mobile" className="md:hidden border-t border-line bg-bg">
          <Wrap className="py-2 flex flex-col">
            {items.map((r) => (
              <button key={r} aria-current={route === r ? "page" : undefined} onClick={() => { go(r); setOpen(false); }}
                className={"min-h-[52px] text-left font-semibold border-l-4 pl-4 " + (route === r ? "border-saffron text-navy" : "border-transparent text-muted")}>
                {t.nav[r]}
              </button>
            ))}
          </Wrap>
        </nav>
      )}
    </header>
  );
}

/* ---------- Home sections ---------- */
function Hero({ go, lang }: { go: (r: Route) => void; lang: Lang }) {
  const t = T[lang];
  const [note, setNote] = useState("");
  const listen = () => {
    if (!("speechSynthesis" in window)) { setNote("Listening isn’t supported in this browser."); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t.title + ". " + t.lead + " " + t.urgentH + " " + t.urgentP);
    u.lang = TTS[lang];
    window.speechSynthesis.speak(u);
    setNote(window.speechSynthesis.getVoices().some((v) => v.lang.toLowerCase().startsWith(lang)) ? "" : "Your device may not have a voice for this language.");
  };
  return (
    <section aria-labelledby="h1">
      <Wrap className="grid gap-10 py-12 md:py-20 lg:grid-cols-[1.15fr_1fr] lg:items-center">
        <div>
          <h1 id="h1" className="text-4xl sm:text-5xl font-bold text-navy tracking-tight">{t.title}</h1>
          <p className="mt-5 max-w-[34rem] text-lg text-muted">{t.lead}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button variant="primary" onClick={() => go("report")} className="text-lg min-h-[56px]">{t.cta}<Icon name="arrow" /></Button>
            <Button variant="secondary" onClick={() => go("track")} className="min-h-[56px]">{t.cta2}</Button>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button type="button" onClick={listen} className="inline-flex min-h-[44px] items-center gap-2 rounded-lg px-3 font-semibold text-navy underline"><Icon name="volume" size={20} />{t.listen}</button>
            <span role="status" className="text-sm text-muted">{note}</span>
          </div>
          <p className="mt-4 text-sm text-muted flex items-center gap-2"><Icon name="clock" size={16} />About 10 minutes. Progress is saved as you go (simulated).</p>
        </div>
        <Urgent lang={lang} />
      </Wrap>
    </section>
  );
}

function Urgent({ lang }: { lang: Lang }) {
  const t = T[lang];
  return (
    <aside id="emergency" aria-labelledby="urgent" className="rounded-3xl bg-alert p-7 sm:p-8 border-l-8 border-saffron">
      <h2 id="urgent" className="text-2xl font-bold text-alertink">{t.urgentH}</h2>
      <p className="mt-3 text-alertink">{t.urgentP}</p>
      <a href="tel:1930" className="pulse mt-6 flex items-center justify-between gap-3 rounded-2xl bg-navy px-6 py-4 text-onnavy">
        <span className="flex items-center gap-3 text-lg font-semibold"><Icon name="phone" size={24} />{t.call}</span>
        <span className="text-4xl font-bold" style={{ fontFamily: "'Source Serif 4',serif" }}>1930</span>
      </a>
      <p className="mt-4 text-sm text-alertink">{t.urgentNote}</p>
    </aside>
  );
}

function Categories({ go, lang, pick }: { go: (r: Route) => void; lang: Lang; pick: (id: string) => void }) {
  const t = T[lang];
  return (
    <section aria-labelledby="cat" className="bg-soft">
      <Wrap className="py-14">
        <h2 id="cat" className="text-3xl font-bold text-navy">{t.catH}</h2>
        <p className="mt-2 max-w-xl text-muted">{t.catP}</p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => (
            <li key={c.id}>
              <button onClick={() => { pick(c.id); go("report"); }} className="group flex h-full w-full items-start gap-4 rounded-2xl bg-bg p-5 text-left shadow-sm hover:shadow-md transition-shadow">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-greensoft text-green"><Icon name={c.icon} size={24} /></span>
                <span>
                  <span className="block font-semibold text-lg text-ink">{c.title}</span>
                  <span className="mt-1 block text-sm text-muted">{c.hint}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Wrap>
    </section>
  );
}

function How({ lang }: { lang: Lang }) {
  const t = T[lang];
  return (
    <section aria-labelledby="how">
      <Wrap className="grid gap-10 py-14 lg:grid-cols-[1fr_1fr]">
        <div>
          <h2 id="how" className="text-3xl font-bold text-navy">{t.howH}</h2>
          <ol className="mt-8 space-y-6">
            {STEPS.map((s, i) => (
              <li key={s.t} className="flex gap-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy text-onnavy font-bold">{i + 1}</span>
                <div><p className="font-semibold text-lg">{s.t}</p><p className="text-muted">{s.d}</p></div>
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-3xl bg-soft p-7 self-start">
          <h3 className="text-xl font-bold text-navy">{t.prepH}</h3>
          <ul className="mt-5 space-y-3">
            {PREP.map((p) => (
              <li key={p} className="flex gap-3"><span className="mt-1 text-green"><Icon name="check" size={18} /></span>{p}</li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-muted">Don’t have everything? You can still start.</p>
        </div>
      </Wrap>
    </section>
  );
}

function Faqs({ lang, compact = false }: { lang: Lang; compact?: boolean }) {
  const t = T[lang];
  return (
    <section aria-labelledby="faq" className={compact ? "" : "bg-soft"}>
      <Wrap className="py-14 max-w-3xl">
        <h2 id="faq" className="text-3xl font-bold text-navy">{t.faqH}</h2>
        <div className="mt-6 divide-y divide-line rounded-2xl bg-bg">
          {FAQS.map((f) => (
            <details key={f.q} className="group px-5">
              <summary className="flex min-h-[56px] items-center justify-between gap-4 py-3 font-semibold">
                {f.q}<span className="chev transition-transform text-muted"><Icon name="chev" /></span>
              </summary>
              <p className="pb-5 text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </Wrap>
    </section>
  );
}

function Home({ go, lang, pick, jump, setTrackId }: { go: (r: Route) => void; lang: Lang; pick: (id: string) => void; jump: (id: string) => void; setTrackId: (s: string) => void }) {
  return (<><Hero go={go} lang={lang} /><ServiceCards go={go} jump={jump} /><TrackStrip go={go} setTrackId={setTrackId} /><Categories go={go} lang={lang} pick={pick} /><How lang={lang} /><Safety go={go} /><Faqs lang={lang} compact /></>);
}

/* ---------- Placeholder pages (real navigation, honest empty states) ---------- */
function Placeholder({ icon, title, body, go }: { icon: IconName; title: string; body: string; go: (r: Route) => void }) {
  return (
    <Wrap className="py-16 max-w-2xl">
      <div className="rounded-3xl bg-soft p-8 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-greensoft text-green"><Icon name={icon} size={28} /></span>
        <h1 className="mt-5 text-3xl font-bold text-navy">{title}</h1>
        <p className="mt-3 text-muted">{body}</p>
        <div className="mt-6 flex justify-center"><Button variant="secondary" onClick={() => go("home")}>Back to home</Button></div>
      </div>
    </Wrap>
  );
}

function jump(id: string) {
  const el = document.getElementById(id) as HTMLElement | null;
  if (!el) return;
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  el.style.scrollMarginTop = "96px";
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "start" });
  el.focus({ preventScroll: true });
}

/* ---------- Four service cards ---------- */
function ServiceCards({ go, jump }: { go: (r: Route) => void; jump: (id: string) => void }) {
  const cards: { icon: IconName; title: string; body: string; action: string; run: () => void; accent?: boolean }[] = [
    { icon: "file", title: "Report a cybercrime", body: "Answer simple questions, one step at a time. No legal terms needed.", action: "Start a report", run: () => go("report"), accent: true },
    { icon: "search", title: "Track a complaint", body: "Already reported? Use your acknowledgement number to see the status.", action: "Check status", run: () => go("track") },
    { icon: "wallet", title: "Lost money to fraud", body: "What to do in the first hours, and how to reach the 1930 helpline.", action: "See what to do now", run: () => jump("emergency") },
    { icon: "shield", title: "Stay safe online", body: "Short, practical tips on scams, accounts and children’s safety.", action: "Read safety tips", run: () => jump("safety") },
  ];
  return (
    <section aria-labelledby="svc">
      <Wrap className="pb-14">
        <h2 id="svc" className="sr-only">Services</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <li key={c.title}>
              <button onClick={c.run} className={"flex h-full w-full flex-col items-start gap-3 rounded-2xl p-6 text-left transition-colors " + (c.accent ? "bg-navy text-onnavy" : "bg-soft hover:bg-greensoft")}>
                <Icon name={c.icon} size={28} className={c.accent ? "" : "text-green"} />
                <span className="text-xl font-bold" style={{ fontFamily: "'Source Serif 4',serif" }}>{c.title}</span>
                <span className={c.accent ? "opacity-90" : "text-muted"}>{c.body}</span>
                <span className="mt-auto inline-flex items-center gap-2 pt-2 font-semibold">{c.action}<Icon name="arrow" size={16} /></span>
              </button>
            </li>
          ))}
        </ul>
      </Wrap>
    </section>
  );
}

/* ---------- Track strip on home ---------- */
function TrackStrip({ go, setTrackId }: { go: (r: Route) => void; setTrackId: (s: string) => void }) {
  const [v, setV] = useState("");
  return (
    <section aria-labelledby="trk" className="bg-navy text-onnavy">
      <Wrap className="grid gap-6 py-10 md:grid-cols-2 md:items-center">
        <div>
          <h2 id="trk" className="text-2xl font-bold">Already reported? Check your complaint</h2>
          <p className="mt-2 opacity-90">Enter your acknowledgement number to see where things stand. No number yet? Try the sample.</p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); setTrackId(v.trim()); go("track"); }}>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex-1">
              <span className="sr-only">Acknowledgement number</span>
              <input value={v} onChange={(e) => setV(e.target.value)} placeholder="DEMO-2026-004821" autoComplete="off" className="min-h-[52px] w-full rounded-xl bg-bg px-4 text-ink" />
            </label>
            <button type="submit" className="min-h-[52px] rounded-xl bg-saffron px-6 font-semibold text-[#1A1100]">Check status</button>
          </div>
          <button type="button" onClick={() => setV("DEMO-2026-004821")} className="mt-3 min-h-[44px] text-sm underline">Use the sample number</button>
        </form>
      </Wrap>
    </section>
  );
}

/* ---------- Safety resources ---------- */
const SAFETY: { icon: IconName; title: string; tips: string[] }[] = [
  { icon: "phone", title: "Suspicious calls and messages", tips: ["A bank will not ask for your OTP, PIN or CVV. Never share them.", "Don’t install screen-sharing apps because a caller asks you to.", "Hang up and call the number printed on your card or passbook."] },
  { icon: "lock", title: "Secure your accounts", tips: ["Turn on two-step verification for email, banking and social media.", "Use a different password for each important account.", "Review which devices are logged in, and sign out of unknown ones."] },
  { icon: "wallet", title: "Before you pay", tips: ["Check the name shown before confirming a UPI payment.", "You never need your PIN to receive money.", "Be wary of guaranteed returns, urgent deadlines and prize claims."] },
  { icon: "heart", title: "Keep children safe online", tips: ["Talk regularly about what they see and who contacts them.", "Set accounts to private and review friend lists together.", "Make it clear they can tell you about anything without being in trouble."] },
];
function Safety({ go }: { go: (r: Route) => void }) {
  return (
    <section id="safety" aria-labelledby="saf" className="bg-soft">
      <Wrap className="py-14">
        <h2 id="saf" className="text-3xl font-bold text-navy">Safety resources</h2>
        <p className="mt-2 max-w-xl text-muted">General good practice, in plain language. Open a topic to read the tips.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {SAFETY.map((s, i) => (
            <details key={s.title} open={i === 0} className="rounded-2xl bg-bg p-5">
              <summary className="flex min-h-[44px] items-center gap-3 font-semibold text-lg">
                <span className="text-green"><Icon name={s.icon} size={22} /></span>
                <span className="flex-1">{s.title}</span>
                <span className="chev text-muted transition-transform"><Icon name="chev" /></span>
              </summary>
              <ul className="mt-3 space-y-2 text-muted">
                {s.tips.map((t) => <li key={t} className="flex gap-3"><span className="mt-1 text-green"><Icon name="check" size={16} /></span>{t}</li>)}
              </ul>
            </details>
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => go("report")}>Think you were targeted? Start a report</Button>
          <Button variant="secondary" href="tel:1930"><Icon name="phone" size={18} />Call 1930 for fraud</Button>
        </div>
      </Wrap>
    </section>
  );
}

/* ---------- Form + tracking strings (missing keys fall back to English) ---------- */
const FT0 = {
  en: { details: "Tell us the details", evidence: "Add evidence (optional)", verify: "Verify it’s you (demo)", review: "Check and submit", step: "Step", back: "Back", cont: "Continue", submit: "Submit demo report", ackLabel: "Acknowledgement number", save: "Save and finish later", draftH: "You have a saved demo draft", resume: "Resume", discard: "Discard" },
  hi: { details: "विवरण बताइए", evidence: "सबूत जोड़ें (वैकल्पिक)", verify: "पहचान सत्यापित करें (डेमो)", review: "जाँचें और जमा करें", step: "चरण", back: "पीछे", cont: "आगे बढ़ें", submit: "डेमो रिपोर्ट जमा करें", ackLabel: "पावती संख्या", save: "सहेजें और बाद में पूरा करें", draftH: "आपका डेमो ड्राफ़्ट सहेजा हुआ है", resume: "जारी रखें", discard: "हटाएँ" },
  bn: { details: "বিস্তারিত জানান", evidence: "প্রমাণ যোগ করুন (ঐচ্ছিক)", verify: "পরিচয় যাচাই (ডেমো)", review: "দেখে জমা দিন", step: "ধাপ", back: "পিছনে", cont: "পরবর্তী", submit: "ডেমো রিপোর্ট জমা দিন", ackLabel: "প্রাপ্তি স্বীকার নম্বর", save: "সংরক্ষণ করে পরে শেষ করুন", draftH: "আপনার একটি ডেমো খসড়া সংরক্ষিত আছে", resume: "চালিয়ে যান", discard: "মুছে ফেলুন" },
  mr: { details: "तपशील सांगा", evidence: "पुरावा जोडा (ऐच्छिक)", verify: "ओळख पडताळणी (डेमो)", review: "तपासा आणि सादर करा", step: "पायरी", back: "मागे", cont: "पुढे", submit: "डेमो अहवाल सादर करा", ackLabel: "पोचपावती क्रमांक", save: "जतन करा आणि नंतर पूर्ण करा", draftH: "तुमचा डेमो मसुदा जतन केलेला आहे", resume: "सुरू ठेवा", discard: "काढून टाका" },
  te: { details: "వివరాలు చెప్పండి", evidence: "ఆధారాలు జోడించండి (ఐచ్ఛికం)", verify: "గుర్తింపు ధృవీకరణ (డెమో)", review: "సరిచూసి సమర్పించండి", step: "దశ", back: "వెనుకకు", cont: "కొనసాగించండి", submit: "డెమో నివేదికను సమర్పించండి", ackLabel: "రసీదు సంఖ్య", save: "సేవ్ చేసి తర్వాత పూర్తి చేయండి", draftH: "మీ డెమో డ్రాఫ్ట్ సేవ్ అయి ఉంది", resume: "తిరిగి ప్రారంభించండి", discard: "తొలగించండి" },
  ta: { details: "விவரங்களைச் சொல்லுங்கள்", evidence: "ஆதாரம் சேர்க்கவும் (விருப்பம்)", verify: "அடையாளச் சரிபார்ப்பு (டெமோ)", review: "சரிபார்த்து சமர்ப்பிக்கவும்", step: "படி", back: "பின்", cont: "தொடரவும்", submit: "டெமோ அறிக்கையைச் சமர்ப்பிக்கவும்", ackLabel: "ஒப்புகை எண்", save: "சேமித்து பின்னர் முடிக்கவும்", draftH: "உங்கள் டெமோ வரைவு சேமிக்கப்பட்டுள்ளது", resume: "மீண்டும் தொடங்கு", discard: "நீக்கு" },
  gu: { details: "વિગતો જણાવો", evidence: "પુરાવો ઉમેરો (વૈકલ્પિક)", verify: "ઓળખ ચકાસણી (ડેમો)", review: "તપાસો અને સબમિટ કરો", step: "પગલું", back: "પાછળ", cont: "આગળ વધો", submit: "ડેમો રિપોર્ટ સબમિટ કરો", ackLabel: "પહોંચ નંબર", save: "સાચવો અને પછી પૂરું કરો", draftH: "તમારો ડેમો ડ્રાફ્ટ સાચવેલો છે", resume: "ફરી શરૂ કરો", discard: "કાઢી નાખો" },
  ur: { details: "تفصیلات بتائیں", evidence: "ثبوت شامل کریں (اختیاری)", verify: "شناخت کی تصدیق (ڈیمو)", review: "جانچیں اور جمع کرائیں", step: "مرحلہ", back: "پیچھے", cont: "آگے بڑھیں", submit: "ڈیمو رپورٹ جمع کرائیں", ackLabel: "رسید نمبر", save: "محفوظ کریں اور بعد میں مکمل کریں", draftH: "آپ کا ڈیمو مسودہ محفوظ ہے", resume: "جاری رکھیں", discard: "حذف کریں" },
  kn: { details: "ವಿವರಗಳನ್ನು ತಿಳಿಸಿ", evidence: "ಪುರಾವೆ ಸೇರಿಸಿ (ಐಚ್ಛಿಕ)", verify: "ಗುರುತಿನ ಪರಿಶೀಲನೆ (ಡೆಮೊ)", review: "ಪರಿಶೀಲಿಸಿ ಸಲ್ಲಿಸಿ", step: "ಹಂತ", back: "ಹಿಂದೆ", cont: "ಮುಂದುವರಿಸಿ", submit: "ಡೆಮೊ ವರದಿ ಸಲ್ಲಿಸಿ", ackLabel: "ಸ್ವೀಕೃತಿ ಸಂಖ್ಯೆ", save: "ಉಳಿಸಿ ಮತ್ತು ನಂತರ ಮುಗಿಸಿ", draftH: "ನಿಮ್ಮ ಡೆಮೊ ಕರಡು ಉಳಿಸಲಾಗಿದೆ", resume: "ಪುನಃ ಪ್ರಾರಂಭಿಸಿ", discard: "ಅಳಿಸಿ" },
  ml: { details: "വിശദാംശങ്ങൾ പറയൂ", evidence: "തെളിവ് ചേർക്കുക (ഓപ്ഷണൽ)", verify: "ഐഡന്റിറ്റി പരിശോധന (ഡെമോ)", review: "പരിശോധിച്ച് സമർപ്പിക്കുക", step: "ഘട്ടം", back: "പിന്നോട്ട്", cont: "തുടരുക", submit: "ഡെമോ റിപ്പോർട്ട് സമർപ്പിക്കുക", ackLabel: "രസീത് നമ്പർ", save: "സേവ് ചെയ്ത് പിന്നീട് പൂർത്തിയാക്കുക", draftH: "നിങ്ങളുടെ ഡെമോ ഡ്രാഫ്റ്റ് സേവ് ചെയ്തിട്ടുണ്ട്", resume: "വീണ്ടും തുടരുക", discard: "ഒഴിവാക്കുക" },
};
const FT = new Proxy({} as Record<Lang, typeof FT0.en>, { get: (_t, l: string) => ({ ...FT0.en, ...((FT0 as any)[l] || {}) }) });

/* ---------- Simulated save-and-resume (browser storage only; files and identity check are never saved) ---------- */
interface Draft { ref: string; cat: string; f: FormData; step: number; at: number }
const DKEY = "cr-draft";
function readDraft(): Draft | null { try { const s = localStorage.getItem(DKEY); return s ? JSON.parse(s) : null; } catch (e) { return null; } }
function writeDraft(d: Draft | null) { try { if (d) localStorage.setItem(DKEY, JSON.stringify(d)); else localStorage.removeItem(DKEY); } catch (e) {} }

/* ---------- Demo identity check: simulated Aadhaar + mobile OTP (no real service involved) ---------- */
function AadhaarOtp({ mobile, verified, onVerified }: { mobile: string; verified: { last4: string } | null; onVerified: (v: { last4: string } | null) => void }) {
  const [phase, setPhase] = useState<"id" | "otp">("id");
  const [num, setNum] = useState("");
  const [show, setShow] = useState(false);
  const [consent, setConsent] = useState(false);
  const [code, setCode] = useState("");
  const [otp, setOtp] = useState("");
  const [tries, setTries] = useState(0);
  const [secs, setSecs] = useState(0);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const tail = mobile.slice(-4);
  const locked = tries >= 3;
  useEffect(() => {
    if (secs <= 0) return;
    const t = setTimeout(() => setSecs(secs - 1), 1000);
    return () => clearTimeout(t);
  }, [secs]);

  const issue = () => { setCode(String(Math.floor(100000 + Math.random() * 900000))); setOtp(""); setTries(0); setSecs(30); setErr(""); };
  const send = () => {
    setErr("");
    if (!/^[2-9]\d{11}$/.test(num)) return setErr("Enter 12 digits, with the first digit between 2 and 9. Use a made-up number.");
    if (!consent) return setErr("Please tick the consent box to continue.");
    setBusy(true);
    setTimeout(() => { issue(); setPhase("otp"); setBusy(false); }, 900);
  };
  const check = () => {
    if (locked) return;
    if (!/^\d{6}$/.test(otp)) return setErr("Enter the 6-digit code.");
    if (otp !== code) {
      const n = tries + 1;
      setTries(n); setOtp("");
      return setErr(n >= 3 ? "Too many wrong attempts. Start again to get a new code." : "That code doesn’t match. " + (3 - n) + (3 - n === 1 ? " try left." : " tries left."));
    }
    setBusy(true);
    const last4 = num.slice(-4);
    setTimeout(() => { onVerified({ last4 }); setNum(""); setCode(""); setOtp(""); setBusy(false); setErr(""); }, 700);
  };
  const restart = () => { setPhase("id"); setCode(""); setOtp(""); setTries(0); setErr(""); };

  if (verified) {
    return (
      <div className="mt-5 rounded-2xl bg-greensoft p-6" role="status">
        <p className="flex items-center gap-2 text-lg font-bold text-green"><Icon name="check" />Verified (demo)</p>
        <p className="mt-2 text-muted">Aadhaar ending {verified.last4}. The full number was never saved, even in this demo.</p>
        <button onClick={() => { onVerified(null); restart(); }} className="mt-3 min-h-[44px] font-semibold text-navy underline">Verify again</button>
      </div>
    );
  }
  return (
    <div className="mt-5 space-y-5">
      <div className="rounded-2xl bg-soft p-4 text-sm text-muted">
        <p className="font-semibold text-ink">Demo security layer</p>
        <p className="mt-1">This only simulates an extra check. It does not connect to UIDAI or any real service. <strong>Do not enter your real Aadhaar number.</strong> Any made-up 12-digit number works.</p>
      </div>
      {phase === "id" ? (
        <>
          <Field id="aad" label="Aadhaar number (demo)" hint="12 digits, no spaces.">
            <div className="flex gap-2">
              <input id="aad" type={show ? "text" : "password"} inputMode="numeric" autoComplete="off" maxLength={12} value={num}
                onChange={(e) => setNum(e.target.value.replace(/\D/g, ""))} aria-describedby="aad-h" className={INPUT} />
              <button type="button" onClick={() => setShow(!show)} aria-pressed={show} aria-label={show ? "Hide number" : "Show number"} className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border-2 border-line"><Icon name="eye" /></button>
            </div>
          </Field>
          <button type="button" onClick={() => setNum("234567890123")} className="min-h-[44px] text-sm font-semibold underline">Use a sample demo number</button>
          <label className="flex cursor-pointer items-start gap-3">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1.5 h-5 w-5" />
            <span>I agree that a demo OTP is “sent” to the mobile ending <strong>{tail}</strong>. No real message is sent.</span>
          </label>
          {err && <p role="alert" className="rounded-lg bg-alert px-3 py-2 text-sm font-semibold text-alertink">{err}</p>}
          <Button onClick={send} className={busy ? "pointer-events-none opacity-70" : ""}>{busy ? "Sending (simulated)…" : "Send OTP"}</Button>
        </>
      ) : (
        <>
          <p>We “sent” a 6-digit code to the mobile ending <strong>{tail}</strong>.</p>
          <div role="status" className="rounded-2xl border-2 border-dashed border-line p-4">
            <p className="text-sm text-muted">Demo SMS (nothing was really sent)</p>
            <p className="mt-1">Your demo OTP is <strong className="text-xl tracking-widest">{code}</strong></p>
            <p className="mt-2 text-sm text-muted">Tip: in real life, never share an OTP with anyone, not even someone who says they are from a bank or the police.</p>
          </div>
          <Field id="otp" label="Enter the 6-digit code">
            <input id="otp" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={otp} disabled={locked}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} className={INPUT + " text-center text-2xl tracking-[0.5em]"} />
          </Field>
          {err && <p role="alert" className="rounded-lg bg-alert px-3 py-2 text-sm font-semibold text-alertink">{err}</p>}
          <div className="flex flex-col gap-3 sm:flex-row">
            {locked ? <Button onClick={restart}>Start again</Button> : <Button onClick={check} className={busy ? "pointer-events-none opacity-70" : ""}>{busy ? "Checking…" : "Verify"}</Button>}
            <Button variant="secondary" onClick={issue} className={secs > 0 ? "pointer-events-none opacity-60" : ""}>{secs > 0 ? "Resend in " + secs + "s" : "Resend code"}</Button>
            <button type="button" onClick={restart} className="min-h-[48px] px-3 font-semibold underline">Change number</button>
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- Report flow: 5 steps + confirmation ---------- */
const STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu","Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry"];
// Suggestions only (a small sample). Any district can be typed.
const DISTRICTS: Record<string, string[]> = {
  "West Bengal": ["Kolkata", "North 24 Parganas", "South 24 Parganas", "Howrah", "Hooghly", "Darjeeling"],
  "Delhi": ["New Delhi", "South Delhi", "North Delhi", "East Delhi", "West Delhi"],
  "Maharashtra": ["Mumbai City", "Mumbai Suburban", "Pune", "Nagpur", "Thane"],
  "Karnataka": ["Bengaluru Urban", "Mysuru", "Dakshina Kannada", "Belagavi", "Dharwad"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
  "Uttar Pradesh": ["Lucknow", "Kanpur Nagar", "Varanasi", "Prayagraj", "Gautam Buddha Nagar"],
  "Telangana": ["Hyderabad", "Rangareddy", "Medchal-Malkajgiri"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
  "Kerala": ["Thiruvananthapuram", "Ernakulam", "Kozhikode", "Thrissur"],
};
const HOW = ["Phone call", "SMS or WhatsApp", "Social media", "Email", "Website or app", "Something else"];
const ACCEPT = { types: ["image/jpeg", "image/png", "application/pdf"], label: "JPG, PNG or PDF", maxMB: 5, maxFiles: 5 }; // demo limits, not official
const STEP_TITLES = ["What happened?", "Tell us the details", "Add evidence (optional)", "Verify it’s you (demo)", "Check and submit"];
const INPUT = "min-h-[48px] w-full rounded-xl border-2 border-line bg-bg px-4 text-ink";
const fmt = (b: number) => (b < 1048576 ? Math.max(1, Math.round(b / 1024)) + " KB" : (b / 1048576).toFixed(1) + " MB");

interface FormData { when: string; how: string; amount: string; desc: string; name: string; mobile: string; state: string; district: string; city: string; station: string }
const EMPTY: FormData = { when: "", how: "", amount: "", desc: "", name: "", mobile: "", state: "", district: "", city: "", station: "" };

function validate(step: number, cat: string, f: FormData): Record<string, string> {
  const e: Record<string, string> = {};
  if (step === 1 && !cat) e.cat = "Choose the option that is closest to what happened.";
  if (step === 2) {
    if (!f.when) e.when = "Tell us roughly when it happened.";
    else if (f.when > new Date().toISOString().slice(0, 10)) e.when = "The date can’t be in the future.";
    if (!f.how) e.how = "Choose how it reached you.";
    if (cat === "fraud" && f.amount && !/^\d{1,9}$/.test(f.amount)) e.amount = "Enter the amount in rupees, digits only. For example: 4500.";
    if (f.desc.trim().length < 20) e.desc = "Please write a few words about what happened (at least 20 characters). Simple words are fine.";
    if (!f.state) e.state = "Choose your state or Union Territory.";
    if (f.district.trim().length < 2) e.district = "Enter your district.";
    if (f.city.trim().length < 2) e.city = "Enter your city, town or village.";
    if (f.name.trim().length < 2) e.name = "Enter a name. Use a made-up name for this demo.";
    if (!/^[6-9]\d{9}$/.test(f.mobile)) e.mobile = "Enter 10 digits, starting with 6, 7, 8 or 9. Use a made-up number.";
  }
  return e;
}

function Field({ id, label, hint, error, children }: { id: string; label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="font-semibold">{label}</label>
      {hint && <p id={id + "-h"} className="text-sm text-muted">{hint}</p>}
      {children}
      {error && <p id={id + "-e"} className="rounded-lg bg-alert px-3 py-2 text-sm font-semibold text-alertink">{error}</p>}
    </div>
  );
}

function ReportPage({ cat, setCat, go, setTrackId, lang }: { cat: string; setCat: (s: string) => void; go: (r: Route) => void; setTrackId: (s: string) => void; lang: Lang }) {
  const t = T[lang];
  const L = FT[lang];
  const titles = [t.catH, L.details, L.evidence, L.verify, L.review];
  const [draft, setDraft] = useState<Draft | null>(readDraft);
  const [savedRef, setSavedRef] = useState("");
  const [step, setStep] = useState(1);
  const [f, setF] = useState<FormData>(EMPTY);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<File[]>([]);
  const [fileMsgs, setFileMsgs] = useState<string[]>([]);
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [ack, setAck] = useState("");
  const [copied, setCopied] = useState(false);
  const [verified, setVerified] = useState<{ last4: string } | null>(null);
  const head = useRef<HTMLHeadingElement>(null);
  const sel = CATEGORIES.find((c) => c.id === cat);
  const set = (k: keyof FormData) => (e: any) => { if (k === "mobile") setVerified(null); setF({ ...f, [k]: e.target.value }); };
  const dby = (id: string) => id + "-h" + (errs[id] ? " " + id + "-e" : "");
  const arrive = (n: number) => { setErrs({}); setStep(n); window.scrollTo(0, 0); setTimeout(() => head.current?.focus(), 0); };
  const fail = (e: Record<string, string>) => { setErrs(e); setTimeout(() => document.getElementById("errsum")?.focus(), 0); };

  const next = () => {
    if (step === 4 && !verified) return fail({ verify: "Please verify with the demo OTP before continuing." });
    const e = validate(step, cat, f);
    if (Object.keys(e).length) return fail(e);
    arrive(step + 1);
  };

  const addFiles = (list: FileList | File[]) => {
    const msgs: string[] = [];
    const ok = [...files];
    Array.from(list).forEach((file) => {
      if (!ACCEPT.types.includes(file.type)) msgs.push(file.name + ": this file type isn’t accepted in the demo. Use " + ACCEPT.label + ".");
      else if (file.size > ACCEPT.maxMB * 1048576) msgs.push(file.name + " is " + fmt(file.size) + ". The demo limit is " + ACCEPT.maxMB + " MB per file.");
      else if (ok.some((x) => x.name === file.name && x.size === file.size)) msgs.push(file.name + " is already added.");
      else if (ok.length >= ACCEPT.maxFiles) msgs.push(file.name + " was not added. You can add up to " + ACCEPT.maxFiles + " files.");
      else ok.push(file);
    });
    setFiles(ok);
    setFileMsgs(msgs);
  };

  const submit = () => {
    if (!verified) return arrive(4);
    if (!agree) return fail({ agree: "Please tick the box to confirm you understand this is a demo." });
    setBusy(true);
    setTimeout(() => {
      setAck("DEMO-2026-" + String(Math.floor(100000 + Math.random() * 899999)));
      setBusy(false);
      writeDraft(null); setDraft(null); arrive(7);
    }, 1400);
  };

  const fresh = step === 1 && !cat && !f.when && !f.desc;
  const saveDraft = () => {
    const d: Draft = { ref: draft?.ref || "DRAFT-" + Math.floor(100000 + Math.random() * 899999), cat, f, step: Math.min(step, 4), at: Date.now() };
    writeDraft(d); setDraft(d); setSavedRef(d.ref); window.scrollTo(0, 0);
  };
  const resume = () => { if (!draft) return; setCat(draft.cat); setF({ ...EMPTY, ...draft.f }); setVerified(null); arrive(draft.step); };
  const discard = () => { writeDraft(null); setDraft(null); };
  const reset = () => { setF(EMPTY); setFiles([]); setFileMsgs([]); setCat(""); setAgree(false); setAck(""); setCopied(false); setVerified(null); arrive(1); };

  /* ----- Confirmation ----- */
  if (step === 7) {
    return (
      <Wrap className="max-w-2xl py-12">
        <div className="rounded-3xl bg-greensoft p-7 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-green text-onnavy"><Icon name="check" size={28} /></span>
          <h1 ref={head} tabIndex={-1} className="mt-4 text-3xl font-bold text-navy outline-none">Demo report submitted</h1>
          <p className="mt-2 text-muted">This was a practice run. Nothing was sent to anyone.</p>
          <p className="mt-6 text-sm text-muted">{L.ackLabel}</p>
          <p className="mt-1 text-3xl font-bold tracking-wide" style={{ fontFamily: "'Source Serif 4',serif" }}>{ack}</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button onClick={() => { setTrackId(ack); go("track"); }}>{t.cta2}</Button>
            <Button variant="secondary" onClick={() => { try { navigator.clipboard.writeText(ack).then(() => setCopied(true), () => setCopied(false)); } catch (e) { setCopied(false); } }}>Copy number</Button>
          </div>
          <p role="status" className="mt-2 min-h-[1.5rem] text-sm text-muted">{copied ? "Copied." : ""}</p>
        </div>
        <div className="mt-6 rounded-2xl bg-soft p-6">
          <h2 className="text-xl font-bold text-navy">What this prototype shows next</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-muted">
            <li>Keep the acknowledgement number somewhere safe.</li>
            <li>Use “Track a complaint” to see a sample status timeline.</li>
            <li>The real process, timings and contacts are decided by the official service, not by this demo.</li>
          </ol>
          {cat === "fraud" && <p className="mt-4 font-semibold">If money was taken recently, call <a className="underline" href="tel:1930">1930</a> now.</p>}
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button variant="secondary" onClick={reset}>Start another demo report</Button>
          <Button variant="secondary" onClick={() => go("home")}>Back to home</Button>
        </div>
      </Wrap>
    );
  }

  /* ----- Draft saved ----- */
  if (savedRef) {
    return (
      <Wrap className="max-w-2xl py-12">
        <div className="rounded-3xl bg-greensoft p-7 text-center" role="status">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-green text-onnavy"><Icon name="check" size={28} /></span>
          <h1 className="mt-4 text-3xl font-bold text-navy">Draft saved (demo)</h1>
          <p className="mt-2 text-muted">Reference: <strong>{savedRef}</strong></p>
          <p className="mt-3 text-sm text-muted">Saved only in this browser on this device. Files and the identity check are not saved, so you will verify again when you return.</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button variant="secondary" onClick={() => setSavedRef("")}>Keep editing</Button>
            <Button onClick={() => { setSavedRef(""); go("home"); }}>Back to home</Button>
          </div>
        </div>
      </Wrap>
    );
  }

  /* ----- Steps 1 to 4 ----- */
  const errList = Object.values(errs);
  return (
    <Wrap className="max-w-2xl py-10">
      <p id="stp" className="text-sm font-semibold text-muted">{L.step} {step}/5: {titles[step - 1]}</p>
      <div role="progressbar" aria-labelledby="stp" aria-valuemin={1} aria-valuemax={5} aria-valuenow={step} className="mt-2 h-2 rounded-full bg-line">
        <div className="h-2 rounded-full bg-green transition-all" style={{ width: (step / 5) * 100 + "%" }} />
      </div>
      <p className="mt-4 rounded-xl bg-soft px-4 py-3 text-sm text-muted">Demo only. Please don’t enter real personal details. Nothing is saved or sent.</p>
      <h1 ref={head} tabIndex={-1} className="mt-6 text-3xl font-bold text-navy outline-none">{titles[step - 1]}</h1>

      {draft && fresh && (
        <div role="region" aria-label={L.draftH} className="mt-4 rounded-2xl border-2 border-green bg-greensoft p-4">
          <p className="font-semibold">{L.draftH}</p>
          <p className="text-sm text-muted">Reference: {draft.ref}. Saved {new Date(draft.at).toLocaleString()}. Stored only in this browser.</p>
          <div className="mt-3 flex gap-3">
            <Button onClick={resume}>{L.resume}</Button>
            <Button variant="secondary" onClick={discard}>{L.discard}</Button>
          </div>
        </div>
      )}

      {errList.length > 0 && (
        <div id="errsum" tabIndex={-1} role="alert" className="mt-4 rounded-2xl border-2 border-saffron bg-alert p-4 text-alertink">
          <p className="font-bold">Please fix {errList.length === 1 ? "this" : "these " + errList.length + " things"} to continue:</p>
          <ul className="mt-1 list-disc pl-5">{errList.map((m) => <li key={m}>{m}</li>)}</ul>
        </div>
      )}

      {step === 1 && (
        <fieldset className="mt-5 space-y-3">
          <legend className="mb-2 text-muted">Choose the closest match. You can change this later.</legend>
          {CATEGORIES.map((c) => (
            <label key={c.id} className={"flex cursor-pointer items-start gap-4 rounded-2xl border-2 p-4 " + (cat === c.id ? "border-navy bg-soft" : "border-line")}>
              <input type="radio" name="cat" checked={cat === c.id} onChange={() => { setCat(c.id); setErrs({}); }} className="mt-1.5 h-5 w-5" />
              <span><span className="block font-semibold">{c.title}</span><span className="text-sm text-muted">{c.hint}</span></span>
            </label>
          ))}
          {cat === "fraud" && <p className="rounded-xl bg-alert p-4 text-alertink">If money was taken in the last few hours, call <a className="font-bold underline" href="tel:1930">1930</a> first. You can finish this form afterwards.</p>}
        </fieldset>
      )}

      {step === 2 && (
        <div className="mt-5 space-y-6">
          <Field id="when" label="When did it happen?" hint="An approximate date is fine." error={errs.when}>
            <input id="when" type="date" max={new Date().toISOString().slice(0, 10)} value={f.when} onChange={set("when")} aria-invalid={!!errs.when} aria-describedby={dby("when")} className={INPUT} />
          </Field>
          <Field id="how" label="How did it reach you?" error={errs.how}>
            <select id="how" value={f.how} onChange={set("how")} aria-invalid={!!errs.how} aria-describedby={dby("how")} className={INPUT}>
              <option value="">Choose one</option>
              {HOW.map((h) => <option key={h}>{h}</option>)}
            </select>
          </Field>
          {cat === "fraud" && (
            <Field id="amount" label="Amount lost in rupees (if any)" hint="Digits only. Leave blank if you are not sure." error={errs.amount}>
              <input id="amount" inputMode="numeric" value={f.amount} onChange={set("amount")} aria-invalid={!!errs.amount} aria-describedby={dby("amount")} placeholder="4500" className={INPUT} />
            </Field>
          )}
          <Field id="desc" label="What happened, in your own words?" hint={f.desc.trim().length + " characters. Write what you saw, what you did, and what went wrong."} error={errs.desc}>
            <textarea id="desc" rows={5} value={f.desc} onChange={set("desc")} aria-invalid={!!errs.desc} aria-describedby={dby("desc")} className={INPUT + " py-3"} />
          </Field>
          <fieldset className="space-y-6 rounded-2xl bg-soft p-5">
            <legend className="px-1 font-bold text-navy">Where are you located?</legend>
            <p className="-mt-2 text-sm text-muted">In this demo, this decides which local unit would see your report.</p>
            <Field id="state" label="State or Union Territory" error={errs.state}>
              <select id="state" value={f.state} onChange={(e) => setF({ ...f, state: e.target.value, district: "" })} aria-invalid={!!errs.state} aria-describedby={dby("state")} className={INPUT}>
                <option value="">Choose one</option>
                {STATES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field id="district" label="District" hint={DISTRICTS[f.state] ? "Pick a suggestion or type your own." : "Type your district."} error={errs.district}>
              <input id="district" list="dist-list" autoComplete="off" value={f.district} onChange={set("district")} aria-invalid={!!errs.district} aria-describedby={dby("district")} className={INPUT} />
              <datalist id="dist-list">{(DISTRICTS[f.state] || []).map((d) => <option key={d} value={d} />)}</datalist>
            </Field>
            <Field id="city" label="City, town or village" error={errs.city}>
              <input id="city" autoComplete="off" value={f.city} onChange={set("city")} aria-invalid={!!errs.city} aria-describedby={dby("city")} className={INPUT} />
            </Field>
            <Field id="station" label="Police station (optional)" hint="Your nearest or local station, if you know it. You can leave this blank.">
              <input id="station" autoComplete="off" value={f.station} onChange={set("station")} aria-describedby="station-h" className={INPUT} />
            </Field>
            {f.state && f.district.trim().length > 1 && (
              <div role="status" className="rounded-xl border-2 border-dashed border-line bg-bg p-4 text-sm">
                <p className="font-semibold text-ink">Demo routing</p>
                <p className="text-muted">This report would be shown to: <strong>Cyber cell, {f.district.trim()} district, {f.state}</strong>.{f.station.trim() ? " Local station you named: " + f.station.trim() + "." : ""}</p>
                <p className="mt-1 text-muted">Illustrative only. It is not a real assignment, and real routing is decided by the official service.</p>
              </div>
            )}
          </fieldset>
          <fieldset className="space-y-6 rounded-2xl bg-soft p-5">
            <legend className="px-1 font-bold text-navy">Your contact details (use made-up ones)</legend>
            <Field id="name" label="Name" error={errs.name}>
              <input id="name" autoComplete="off" value={f.name} onChange={set("name")} aria-invalid={!!errs.name} aria-describedby={dby("name")} className={INPUT} />
            </Field>
            <Field id="mobile" label="Mobile number" error={errs.mobile}>
              <input id="mobile" inputMode="numeric" autoComplete="off" maxLength={10} value={f.mobile} onChange={set("mobile")} aria-invalid={!!errs.mobile} aria-describedby={dby("mobile")} className={INPUT} />
            </Field>
          </fieldset>
        </div>
      )}

      {step === 3 && (
        <div className="mt-5">
          <p className="text-muted">Screenshots of messages, payment receipts or profile pages help. You can skip this and continue.</p>
          <input id="files" type="file" multiple accept=".jpg,.jpeg,.png,.pdf" className="peer sr-only" onChange={(e) => { addFiles(e.target.files || []); e.target.value = ""; }} />
          <label htmlFor="files" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
            className="mt-4 flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-line bg-soft p-8 text-center hover:border-navy peer-focus-visible:ring-4 peer-focus-visible:ring-saffron">
            <Icon name="file" size={32} />
            <span className="font-semibold">Tap to choose files, or drop them here</span>
            <span className="text-sm text-muted">{ACCEPT.label}. Up to {ACCEPT.maxMB} MB each, {ACCEPT.maxFiles} files at most (demo limits). Files stay in your browser.</span>
          </label>
          <div role="alert" className="mt-3 space-y-2">{fileMsgs.map((m) => <p key={m} className="rounded-lg bg-alert px-3 py-2 text-sm font-semibold text-alertink">{m}</p>)}</div>
          {files.length === 0 ? (
            <p className="mt-4 rounded-2xl bg-soft p-5 text-muted">No files added yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-line rounded-2xl border border-line">
              {files.map((x) => (
                <li key={x.name + x.size} className="flex items-center gap-3 p-3">
                  <span className="text-green"><Icon name="file" /></span>
                  <span className="min-w-0 flex-1"><span className="block truncate font-semibold">{x.name}</span><span className="text-sm text-muted">{fmt(x.size)}</span></span>
                  <button onClick={() => setFiles(files.filter((y) => y !== x))} aria-label={"Remove " + x.name} className="grid h-11 w-11 place-items-center rounded-lg border border-line"><Icon name="x" size={18} /></button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {step === 4 && (
        <div>
          <p className="mt-2 text-muted">One more check keeps reports trustworthy. This is a simulation.</p>
          <AadhaarOtp mobile={f.mobile} verified={verified} onVerified={setVerified} />
        </div>
      )}

      {step === 5 && (
        <div className="mt-5">
          <p className="text-muted">Check your answers. Use Change to fix anything.</p>
          <dl className="mt-4 divide-y divide-line rounded-2xl border border-line">
            {([
              ["What happened", sel ? sel.title : "", 1],
              ["When", f.when, 2], ["How it reached you", f.how, 2],
              ...(cat === "fraud" ? [["Amount lost", f.amount ? "₹" + f.amount : "Not given", 2]] : []),
              ["Your words", f.desc, 2], ["Name", f.name, 2], ["Mobile", f.mobile, 2],
              ["Location", [f.city, f.district, f.state].join(", "), 2], ["Police station", f.station || "Not given", 2], ["Demo routing", "Cyber cell, " + f.district + " district, " + f.state, 2],
              ["Identity check", verified ? "Verified (demo), Aadhaar ending " + verified.last4 : "Not verified", 4],
              ["Evidence", files.length ? files.length + " file" + (files.length > 1 ? "s" : "") + ": " + files.map((x) => x.name).join(", ") : "None added", 3],
            ] as [string, string, number][]).map(([k, v, s]) => (
              <div key={k} className="flex items-start gap-3 p-4">
                <div className="min-w-0 flex-1"><dt className="text-sm text-muted">{k}</dt><dd className="break-words font-semibold">{v}</dd></div>
                <button onClick={() => arrive(s)} className="min-h-[44px] px-2 font-semibold text-navy underline" aria-label={"Change " + k}>Change</button>
              </div>
            ))}
          </dl>
          <label className="mt-5 flex cursor-pointer items-start gap-3">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1.5 h-5 w-5" />
            <span>I understand this is a demo, and I have not entered any real personal details.</span>
          </label>
        </div>
      )}

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        {step > 1 ? <Button variant="secondary" onClick={() => arrive(step - 1)}>{L.back}</Button> : <Button variant="secondary" onClick={() => go("home")}>Cancel</Button>}
        {step < 5 ? <Button onClick={next}>{L.cont}<Icon name="arrow" size={18} /></Button>
          : <Button onClick={submit} className={busy ? "pointer-events-none opacity-70" : ""}>{busy ? "Submitting (simulated)…" : L.submit}</Button>}
      </div>
      <button type="button" onClick={saveDraft} className="mt-4 min-h-[44px] font-semibold text-navy underline">{L.save}</button>
      <p role="status" className="sr-only">{busy ? "Submitting" : ""}</p>
    </Wrap>
  );
}

/* ---------- Track page ---------- */
const STAGES = ["Complaint received", "Assigned for review", "Evidence being checked", "Update shared with you"];
function TrackPage({ trackId, setTrackId, go, lang }: { trackId: string; setTrackId: (s: string) => void; go: (r: Route) => void; lang: Lang }) {
  const t = T[lang];
  const L = FT[lang];
  const [q, setQ] = useState(trackId);
  const [state, setState] = useState<"idle" | "loading" | "error" | "done">("idle");
  const [err, setErr] = useState("");
  const [res, setRes] = useState<{ id: string; stage: number } | null>(null);
  const run = (raw: string) => {
    const id = raw.trim().toUpperCase();
    if (!id) { setErr("Enter the acknowledgement number from your confirmation."); setState("error"); return; }
    if (!/^DEMO-\d{4}-\d{6}$/.test(id)) { setErr("That doesn’t look right. Demo numbers look like DEMO-2026-004821. Check for spaces or a missing digit."); setState("error"); return; }
    setState("loading");
    setTimeout(() => { setRes({ id, stage: id.endsWith("4821") ? 2 : 0 }); setState("done"); }, 700);
  };
  useEffect(() => { if (trackId) { setQ(trackId); run(trackId); setTrackId(""); } }, []);
  return (
    <Wrap className="max-w-2xl py-12">
      <h1 className="text-3xl font-bold text-navy">{t.nav.track}</h1>
      <p className="mt-2 text-muted">Demo only. Real complaints cannot be tracked here.</p>
      <form className="mt-6" onSubmit={(e) => { e.preventDefault(); run(q); }}>
        <label htmlFor="ack" className="font-semibold">{L.ackLabel}</label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input id="ack" value={q} onChange={(e) => setQ(e.target.value)} aria-invalid={state === "error"} aria-describedby="ackmsg" placeholder="DEMO-2026-004821" autoComplete="off" className="min-h-[52px] flex-1 rounded-xl border-2 border-line bg-bg px-4" />
          <Button onClick={() => run(q)}>{t.cta2}</Button>
        </div>
        <button type="button" className="mt-2 min-h-[44px] text-sm underline text-muted" onClick={() => { setQ("DEMO-2026-004821"); run("DEMO-2026-004821"); }}>Use the sample number</button>
      </form>
      <div id="ackmsg" role="status" aria-live="polite" className="mt-4">
        {state === "idle" && <p className="rounded-2xl bg-soft p-5 text-muted">Nothing to show yet. Enter a number above to see a sample status timeline.</p>}
        {state === "loading" && <p className="rounded-2xl bg-soft p-5">Looking up your complaint…</p>}
        {state === "error" && <p className="rounded-2xl bg-alert p-5 font-semibold text-alertink">{err}</p>}
        {state === "done" && res && (
          <div className="rounded-2xl bg-soft p-6">
            <p className="font-semibold">{res.id} <span className="text-sm font-normal text-muted">(sample data)</span></p>
            <ol className="mt-5 space-y-5">
              {STAGES.map((s, i) => (
                <li key={s} className="flex items-start gap-4" aria-current={i === res.stage ? "step" : undefined}>
                  <span className={"grid h-8 w-8 shrink-0 place-items-center rounded-full " + (i < res.stage ? "bg-green text-onnavy" : i === res.stage ? "bg-saffron text-[#1A1100]" : "bg-line text-muted")}>
                    {i < res.stage ? <Icon name="check" size={16} /> : i + 1}
                  </span>
                  <span><span className="block font-semibold">{s}</span><span className="text-sm text-muted">{i < res.stage ? "Completed" : i === res.stage ? "In progress" : "Not started"}</span></span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
      <div className="mt-6"><Button variant="secondary" onClick={() => go("home")}>Back to home</Button></div>
    </Wrap>
  );
}

/* ---------- Footer ---------- */
function SiteFooter({ go, toSection }: { go: (r: Route) => void; toSection: (id: string) => void }) {
  const L = "block min-h-[44px] text-left hover:underline";
  return (
    <footer className="border-t border-line bg-soft">
      <Wrap className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-lg font-bold text-navy" style={{ fontFamily: "'Source Serif 4',serif" }}>Cyber Report</p>
          <p className="mt-2 text-sm text-muted">An independent design prototype for research and discussion. Not affiliated with or endorsed by any government body.</p>
        </div>
        <nav aria-label="Services"><p className="font-semibold">Services</p>
          <button className={L} onClick={() => go("report")}>Report a cybercrime</button>
          <button className={L} onClick={() => go("track")}>Track a complaint</button>
          <button className={L} onClick={() => toSection("emergency")}>Financial fraud help</button></nav>
        <nav aria-label="Help"><p className="font-semibold">Help</p>
          <button className={L} onClick={() => go("help")}>Help and FAQs</button>
          <button className={L} onClick={() => toSection("safety")}>Safety resources</button>
          <button className={L} onClick={() => toSection("faq")}>Common questions</button></nav>
        <div><p className="font-semibold">Accessibility</p>
          <button className={L} onClick={() => { window.scrollTo(0, 0); (document.querySelector('[aria-label="Accessibility and language"] button') as HTMLElement | null)?.focus(); }}>Text size, contrast, language</button>
          <button className={L} onClick={() => window.scrollTo({ top: 0 })}>Back to top</button></div>
      </Wrap>
      <div className="border-t border-line"><Wrap className="py-5 text-sm text-muted">Emergency: call 112. Financial fraud: call 1930. All data in this prototype is made up.</Wrap></div>
    </footer>
  );
}

/* ---------- App ---------- */
function App() {
  const [route, go] = useRoute();
  const [lang, setLangRaw] = useState<Lang>(() => {
    try { const s = localStorage.getItem("cr-lang") as Lang; return LANGS.some((l) => l.code === s) ? s : "en"; } catch (e) { return "en"; }
  });
  const [showLang, setShowLang] = useState(() => { try { return !localStorage.getItem("cr-lang"); } catch (e) { return true; } });
  const setLang = (l: Lang) => { setLangRaw(l); try { localStorage.setItem("cr-lang", l); } catch (e) {} };
  const [cat, setCat] = useState("");
  const [trackId, setTrackId] = useState("");
  const t = T[lang];
  const toSection = (id: string) => { go("home"); setTimeout(() => jump(id), 80); };
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = LANGS.find((l) => l.code === lang)?.dir || "ltr";
  }, [lang]);
  return (
    <>
      <a href="#main" onClick={(e) => { e.preventDefault(); document.getElementById("main")?.focus(); }}
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-navy focus:px-4 focus:py-3 focus:text-onnavy">{t.skip}</a>
      <div role="note" className="bg-navy text-onnavy text-sm"><Wrap className="py-2 text-center">{t.demo}</Wrap></div>
      {showLang && <LangDialog lang={lang} onPick={(l) => { setLang(l); setShowLang(false); }} onClose={() => { setLang(lang); setShowLang(false); }} />}
      <A11yBar lang={lang} setLang={setLang} />
      <Header route={route} go={go} lang={lang} />
      <Tricolour />
      <main id="main" tabIndex={-1} className="outline-none">
        {route === "home" && <Home go={go} lang={lang} pick={setCat} jump={jump} setTrackId={setTrackId} />}
        {route === "report" && <ReportPage cat={cat} setCat={setCat} go={go} setTrackId={setTrackId} lang={lang} />}
        {route === "track" && <TrackPage trackId={trackId} setTrackId={setTrackId} go={go} lang={lang} />}
        {route === "help" && <><Wrap className="pt-12"><h1 className="text-4xl font-bold text-navy">Help & FAQs</h1><p className="mt-3 max-w-xl text-muted">Short answers in plain language. More topics will be added.</p></Wrap><Faqs lang={lang} compact /></>}
      </main>
      <SiteFooter go={go} toSection={toSection} />
      <div className="h-24 md:hidden" aria-hidden="true" />
      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-line bg-bg/95 p-3 backdrop-blur md:hidden" style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom,0px))" }}>
        <a href="tel:1930" className="flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-xl bg-saffron px-3 text-center font-semibold text-[#1A1100]"><Icon name="phone" size={20} />{t.call}</a>
        <button onClick={() => go("report")} className="flex min-h-[52px] flex-1 items-center justify-center rounded-xl bg-navy px-3 text-center font-semibold text-onnavy">{t.cta}</button>
      </div>
    </>
  );
}

export default App;
