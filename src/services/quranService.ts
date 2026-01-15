
interface Verse {
    id: number;
    verse_key: string;
    text_uthmani: string;
    chapter_id: number;
}

export interface QuranPageData {
    pageNumber: number;
    verses: Verse[];
    surahNames: string[]; // Names of surahs on this page
}

// Minimal mapping of Chapter ID to Arabic Name (First 20 for brevity/demo unless I add all 114, I'll add a helper or fetch)
// actually, for a robust app, fetching the chapter list once is better, or using a local constant.
// For this step, I'll use a fast lookup for all 114 surahs to ensure correctness.

const SURAH_NAMES = [
    "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس",
    "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه",
    "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم",
    "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر",
    "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق",
    "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة",
    "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج",
    "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس",
    "التكوير", "الانفطار", "المطففين", "الانشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد",
    "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات", "القارعة",
    "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر", "المسد",
    "الإخلاص", "الفلق", "الناس"
];

const toArabicNumerals = (n: number | string): string => {
    return n.toString().replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d)]);
};

export const getQuranPage = async (pageNumber: number): Promise<QuranPageData> => {
    try {
        // Explicitly request chapter_id to ensure we can map surah names
        const response = await fetch(`https://api.quran.com/api/v4/verses/by_page/${pageNumber}?language=ar&words=false&fields=text_uthmani,chapter_id`);

        if (!response.ok) {
            throw new Error(`Failed to fetch page ${pageNumber}`);
        }

        const data = await response.json();
        const verses: Verse[] = data.verses;

        // Extract unique chapter IDs on this page
        const chapterIds = Array.from(new Set(verses.map(v => v.chapter_id)));
        const surahNames = chapterIds.map(id => SURAH_NAMES[id - 1] || `سورة ${id}`);

        // Pre-process verses to formatting if needed, but we do it in UI
        return {
            pageNumber,
            verses,
            surahNames
        };
    } catch (error) {
        console.error("Quran API Error:", error);
        throw error;
    }
};

export { toArabicNumerals };
