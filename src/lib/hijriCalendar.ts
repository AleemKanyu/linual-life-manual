// Hijri & Dual Gregorian Calendar Utility

export interface HijriDateInfo {
  day: number;
  monthName: string;
  monthNumber: number; // 1 to 12
  year: number;
  formattedHijri: string;
  formattedGregorian: string;
  fullDualString: string;
}

export interface FastingRecommendation {
  isFastingDay: boolean;
  type: "mandatory" | "sunnah" | "recommended" | null;
  title: string | null;
  description: string | null;
  badgeColor: string;
}

export interface IslamicEventInfo {
  name: string;
  description: string;
  category: "holy_day" | "fasting" | "month";
  isToday: boolean;
}

const HIJRI_MONTH_NAMES = [
  "Muharram",
  "Safar",
  "Rabi' al-Awwal",
  "Rabi' al-Thani",
  "Jumada al-Ula",
  "Jumada al-Akhirah",
  "Rajab",
  "Sha'ban",
  "Ramadan",
  "Shawwal",
  "Dhu al-Qi'dah",
  "Dhu al-Hijjah",
];

/**
 * Converts a Gregorian Date to Hijri date structure using browser Intl or Kuwaiti algorithmic fallback.
 */
export function getHijriDate(date: Date = new Date(), dayAdjustment: number = 0): HijriDateInfo {
  const adjustedDate = new Date(date);
  if (dayAdjustment !== 0) {
    adjustedDate.setDate(adjustedDate.getDate() + dayAdjustment);
  }

  let day = 1;
  let monthNumber = 1;
  let monthName = HIJRI_MONTH_NAMES[0];
  let year = 1448;

  try {
    // Attempt standard Intl conversion (Umm al-Qura)
    const formatter = new Intl.DateTimeFormat("en-TN-u-ca-islamic-umalqura-nu-latn", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });

    const parts = formatter.formatToParts(adjustedDate);
    for (const part of parts) {
      if (part.type === "day") day = parseInt(part.value, 10);
      else if (part.type === "month") {
        monthNumber = parseInt(part.value, 10);
        if (monthNumber >= 1 && monthNumber <= 12) {
          monthName = HIJRI_MONTH_NAMES[monthNumber - 1];
        }
      } else if (part.type === "year") year = parseInt(part.value, 10);
    }
  } catch (err) {
    // Fallback algorithmic calculation if Intl.DateTimeFormat fails
    const gDay = adjustedDate.getDate();
    const gMonth = adjustedDate.getMonth();
    const gYear = adjustedDate.getFullYear();

    let m = gMonth + 1;
    let y = gYear;

    if (m < 3) {
      y -= 1;
      m += 12;
    }

    const a = Math.floor(y / 100);
    const b = 2 - a + Math.floor(a / 4);
    const jd =
      Math.floor(365.25 * (y + 4716)) +
      Math.floor(30.6001 * (m + 1)) +
      gDay +
      b -
      1524.5;

    const z = jd - 1948440 + 10632;
    const n = Math.floor((z - 1) / 10631);
    const z1 = z - 10631 * n + 354;
    const j =
      Math.floor((10982 - z1) / 5585) * Math.floor((z1 * 9) / 2729) +
      Math.floor(z1 / 2451) * Math.floor((2729 - z1 * 9) / 2729);
    const z2 =
      z1 -
      Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
      Math.floor(j / 16) * Math.floor((275 * j) / 9) +
      2430;

    monthNumber = Math.floor((z2 * 9) / 272);
    day = Math.floor(z2 - Math.floor((monthNumber * 272) / 9));
    year = 30 * n + j - 30;

    if (monthNumber >= 1 && monthNumber <= 12) {
      monthName = HIJRI_MONTH_NAMES[monthNumber - 1];
    }
  }

  const formattedHijri = `${day} ${monthName} ${year} AH`;

  const formattedGregorian = adjustedDate.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const fullDualString = `${formattedHijri} | ${formattedGregorian}`;

  return {
    day,
    monthName,
    monthNumber,
    year,
    formattedHijri,
    formattedGregorian,
    fullDualString,
  };
}

/**
 * Evaluates Sunnah and Mandatory Fasting recommendations for a given day.
 */
export function getFastingRecommendation(
  date: Date = new Date(),
  hijriInfo?: HijriDateInfo
): FastingRecommendation {
  const h = hijriInfo || getHijriDate(date);
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, 4 = Thursday

  // 1. Mandatory Fasting: Ramadan
  if (h.monthNumber === 9) {
    return {
      isFastingDay: true,
      type: "mandatory",
      title: "Ramadan Fasting",
      description: `Day ${h.day} of Ramadan. Obligatory fasting month.`,
      badgeColor: "bg-[#5A6A5A] text-white border-[#5A6A5A]",
    };
  }

  // 2. Arafah Fasting (9 Dhul Hijjah)
  if (h.monthNumber === 12 && h.day === 9) {
    return {
      isFastingDay: true,
      type: "recommended",
      title: "Day of Arafah Fast",
      description: "Expiates the sins of the previous year and coming year.",
      badgeColor: "bg-[#B07D62] text-white border-[#B07D62]",
    };
  }

  // 3. Ashura Fasting (9th & 10th Muharram)
  if (h.monthNumber === 1 && (h.day === 9 || h.day === 10)) {
    return {
      isFastingDay: true,
      type: "recommended",
      title: h.day === 10 ? "Day of Ashura Fast" : "Tasu'a Fast (9th Muharram)",
      description: "Sunnah fast expiating sins of the preceding year.",
      badgeColor: "bg-amber-700 text-white border-amber-800",
    };
  }

  // 4. White Days (Ayyam al-Beed: 13th, 14th, 15th of Hijri Month)
  if (h.day >= 13 && h.day <= 15) {
    return {
      isFastingDay: true,
      type: "sunnah",
      title: `White Day Fast (${h.day}th ${h.monthName})`,
      description: "Ayyam al-Beed Sunnah fast (13th, 14th, 15th of the lunar month).",
      badgeColor: "bg-[#B07D62]/15 text-[#B07D62] border-[#B07D62]/30",
    };
  }

  // 5. Monday or Thursday Weekly Sunnah Fast
  if (dayOfWeek === 1 || dayOfWeek === 4) {
    const dayName = dayOfWeek === 1 ? "Monday" : "Thursday";
    return {
      isFastingDay: true,
      type: "sunnah",
      title: `Weekly Sunnah Fast (${dayName})`,
      description: `Sunnah fast on ${dayName}s, the day deeds are presented to Allah.`,
      badgeColor: "bg-[#5A6A5A]/15 text-[#5A6A5A] border-[#5A6A5A]/30",
    };
  }

  // 6. Six Days of Shawwal
  if (h.monthNumber === 10 && h.day >= 2 && h.day <= 7) {
    return {
      isFastingDay: true,
      type: "sunnah",
      title: "Six Days of Shawwal",
      description: "Fasting 6 days in Shawwal yields reward equivalent to fasting the entire year.",
      badgeColor: "bg-[#5A6A5A]/15 text-[#5A6A5A] border-[#5A6A5A]/30",
    };
  }

  return {
    isFastingDay: false,
    type: null,
    title: null,
    description: null,
    badgeColor: "bg-gray-100 text-gray-600 border-gray-200",
  };
}

/**
 * Returns significant Islamic events or occasions for today's Hijri date.
 */
export function getIslamicEvent(
  hijriInfo?: HijriDateInfo
): IslamicEventInfo | null {
  const h = hijriInfo || getHijriDate();
  const { day, monthNumber, monthName } = h;

  // Key Calendar Milestones
  if (monthNumber === 1 && day === 1) {
    return {
      name: "Islamic New Year (1 Muharram)",
      description: "First day of the Hijri year. A time for reflection and renewal.",
      category: "holy_day",
      isToday: true,
    };
  }

  if (monthNumber === 1 && day === 10) {
    return {
      name: "Day of Ashura (10 Muharram)",
      description: "Blessed day commemorating Prophet Musa (AS) and the liberation from Pharaoh.",
      category: "fasting",
      isToday: true,
    };
  }

  if (monthNumber === 3 && day === 12) {
    return {
      name: "Mawlid an-Nabi (12 Rabi' al-Awwal)",
      description: "Commemoration of the birth of Prophet Muhammad (ﷺ).",
      category: "holy_day",
      isToday: true,
    };
  }

  if (monthNumber === 7 && day === 27) {
    return {
      name: "Isra' and Mi'raj (27 Rajab)",
      description: "Commemoration of the miraculous night journey and ascension of Prophet Muhammad (ﷺ).",
      category: "holy_day",
      isToday: true,
    };
  }

  if (monthNumber === 8 && day === 15) {
    return {
      name: "Mid-Sha'ban / Shab-e-Barat (15 Sha'ban)",
      description: "Night of forgiveness and preparation for the holy month of Ramadan.",
      category: "holy_day",
      isToday: true,
    };
  }

  if (monthNumber === 9) {
    if (day >= 21 && day % 2 !== 0) {
      return {
        name: `Laylat al-Qadr Seek (${day} Ramadan)`,
        description: "Odd night in the last 10 nights of Ramadan — Night of Decree better than 1,000 months.",
        category: "holy_day",
        isToday: true,
      };
    }
    return {
      name: "Holy Month of Ramadan",
      description: "Blessed month of Quran revelation, fasting, and intense spiritual growth.",
      category: "month",
      isToday: true,
    };
  }

  if (monthNumber === 10 && day === 1) {
    return {
      name: "Eid al-Fitr (1 Shawwal)",
      description: "Blessed celebration marking the end of Ramadan fasts. Eid Mubarak!",
      category: "holy_day",
      isToday: true,
    };
  }

  if (monthNumber === 12 && day >= 1 && day <= 10) {
    if (day === 9) {
      return {
        name: "Day of Arafah (9 Dhul Hijjah)",
        description: "Pinnacle day of Hajj. Best day of the year for du'a and forgiveness.",
        category: "fasting",
        isToday: true,
      };
    }
    if (day === 10) {
      return {
        name: "Eid al-Adha (10 Dhul Hijjah)",
        description: "Feast of Sacrifice commemorating Prophet Ibrahim's (AS) devotion. Eid Mubarak!",
        category: "holy_day",
        isToday: true,
      };
    }
    return {
      name: `First 10 Days of Dhul Hijjah (Day ${day})`,
      description: "Most beloved days of righteous deeds to Allah.",
      category: "holy_day",
      isToday: true,
    };
  }

  return null;
}
