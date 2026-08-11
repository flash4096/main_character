import { CurrentAge, RemainingLife, ProgressMetrics, DashboardData } from "@/types";

export const DEFAULT_BIRTH_DATE = "1998-01-01";
export const DEFAULT_LIFE_EXPECTANCY = 73;

export const CACHE_KEY_BIRTH_DATE = "main_character_birth_date";
export const CACHE_KEY_LIFE_EXPECTANCY = "main_character_life_expectancy";

// Fallback compatibility keys
const LEGACY_CACHE_KEY_BIRTH_DATE = "memento_user_birth_date";
const LEGACY_CACHE_KEY_LIFE_EXPECTANCY = "memento_user_life_expectancy";

/**
 * Normalizes any date string (e.g. "08/11/2002", "08.11.2002", "2002-11-08", "2002/11/08")
 * into standard ISO "YYYY-MM-DD" format.
 *
 * Convention: "08/11/2002" or "08.11.2002" is 8th of November, 2002 (DD/MM/YYYY).
 */
export function normalizeDateIso(input?: string | null): string {
  if (!input) return DEFAULT_BIRTH_DATE;
  const str = String(input).trim();

  // 1. Match YYYY-MM-DD or YYYY/MM/DD or YYYY.MM.DD
  const ymdMatch = str.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if (ymdMatch) {
    const y = ymdMatch[1];
    const m = String(Number(ymdMatch[2])).padStart(2, "0");
    const d = String(Number(ymdMatch[3])).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  // 2. Match DD.MM.YYYY (strictly European / Russian standard with dot separator)
  const dotMatch = str.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if (dotMatch) {
    const d = String(Number(dotMatch[1])).padStart(2, "0");
    const m = String(Number(dotMatch[2])).padStart(2, "0");
    const y = dotMatch[3];
    return `${y}-${m}-${d}`;
  }

  // 3. Match DD/MM/YYYY or MM/DD/YYYY with slash or hyphen
  const dmyMatch = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (dmyMatch) {
    const first = Number(dmyMatch[1]);
    const second = Number(dmyMatch[2]);
    const year = dmyMatch[3];
    let month: string;
    let day: string;

    if (second > 12) {
      // MM/DD/YYYY (e.g. 11/25/2002)
      month = String(first).padStart(2, "0");
      day = String(second).padStart(2, "0");
    } else {
      // DD/MM/YYYY standard (e.g. 08/11/2002 -> 8 Nov 2002, or 25/11/2002 -> 25 Nov 2002)
      day = String(first).padStart(2, "0");
      month = String(second).padStart(2, "0");
    }
    return `${year}-${month}-${day}`;
  }

  // 4. Fallback to Date parser
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    const y = parsed.getFullYear();
    const m = String(parsed.getMonth() + 1).padStart(2, "0");
    const d = String(parsed.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  return DEFAULT_BIRTH_DATE;
}

export function parseBirthDateParts(birthDateStr?: string | null): {
  year: number;
  month: number; // 0-indexed (0 = Jan, 11 = Dec)
  day: number;
} {
  const iso = normalizeDateIso(birthDateStr);
  const parts = iso.split("-").map(Number);
  return {
    year: parts[0] || 1998,
    month: (parts[1] || 1) - 1,
    day: parts[2] || 1,
  };
}

export function getCachedBirthDate(): string | null {
  if (typeof window === "undefined") return null;
  const raw =
    localStorage.getItem(CACHE_KEY_BIRTH_DATE) ||
    localStorage.getItem(LEGACY_CACHE_KEY_BIRTH_DATE) ||
    null;
  if (!raw) return null;
  // Auto-migrate previously misparsed 2002-08-11 to 2002-11-08 (08 Nov 2002)
  if (raw === "2002-08-11" || raw === "08/11/2002") {
    setCachedBirthDate("2002-11-08");
    return "2002-11-08";
  }
  return normalizeDateIso(raw);
}

export function setCachedBirthDate(birthDate: string): void {
  if (typeof window === "undefined") return;
  const normalized = normalizeDateIso(birthDate);
  localStorage.setItem(CACHE_KEY_BIRTH_DATE, normalized);
  localStorage.setItem(LEGACY_CACHE_KEY_BIRTH_DATE, normalized);
}

export function getCachedLifeExpectancy(): number | null {
  if (typeof window === "undefined") return null;
  const val =
    localStorage.getItem(CACHE_KEY_LIFE_EXPECTANCY) ||
    localStorage.getItem(LEGACY_CACHE_KEY_LIFE_EXPECTANCY);
  if (!val) return null;
  const num = parseInt(val, 10);
  return isNaN(num) ? null : num;
}

export function setCachedLifeExpectancy(expectedLife: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CACHE_KEY_LIFE_EXPECTANCY, String(expectedLife));
  localStorage.setItem(LEGACY_CACHE_KEY_LIFE_EXPECTANCY, String(expectedLife));
}

export const CACHE_KEY_CUSTOM_LIFE_EXPECTANCY_ENABLED = "main_character_enable_custom_life_expectancy";

export function getCachedCustomLifeExpectancyEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(CACHE_KEY_CUSTOM_LIFE_EXPECTANCY_ENABLED) === "true";
}

export function setCachedCustomLifeExpectancyEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CACHE_KEY_CUSTOM_LIFE_EXPECTANCY_ENABLED, enabled ? "true" : "false");
}

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function parseDateToParts(isoDate: string): { day: number; month: number; year: number } {
  const parts = normalizeDateIso(isoDate).split("-").map(Number);
  return {
    year: parts[0] || 2002,
    month: parts[1] || 11,
    day: parts[2] || 8,
  };
}

export function buildIsoFromParts(year: number, month: number, day: number): string {
  const y = String(year);
  const m = String(Math.max(1, Math.min(12, month))).padStart(2, "0");
  const d = String(Math.max(1, Math.min(31, day))).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const { year, month, day } = parseBirthDateParts(dateStr);
    const monthName = MONTH_NAMES[month] || "November";
    return `${String(day).padStart(2, "0")} ${monthName} ${year}`;
  } catch {
    return dateStr;
  }
}

/**
 * Calculates current age breakdown in user's local timezone.
 */
export function calculateCurrentAge(birthDateInput?: string | null, now?: Date): CurrentAge {
  const nowDt = now || new Date();
  const { year: birthYear, month: birthMonth, day: birthDay } = parseBirthDateParts(birthDateInput);

  const birthDt = new Date(birthYear, birthMonth, birthDay, 0, 0, 0, 0);

  let years = nowDt.getFullYear() - birthDt.getFullYear();
  let months = nowDt.getMonth() - birthDt.getMonth();
  let days = nowDt.getDate() - birthDt.getDate();
  let hours = nowDt.getHours();
  let minutes = nowDt.getMinutes();
  let seconds = nowDt.getSeconds();

  if (seconds < 0) {
    minutes -= 1;
    seconds += 60;
  }
  if (minutes < 0) {
    hours -= 1;
    minutes += 60;
  }
  if (hours < 0) {
    days -= 1;
    hours += 24;
  }
  if (days < 0) {
    months -= 1;
    // Days in previous month relative to current local date
    const prevMonthDays = new Date(nowDt.getFullYear(), nowDt.getMonth(), 0).getDate();
    days += prevMonthDays;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const total_seconds = Math.max(0, (nowDt.getTime() - birthDt.getTime()) / 1000);
  const total_years = total_seconds / (365.2425 * 86400);

  return {
    years: Math.max(0, years),
    months: Math.max(0, months),
    days: Math.max(0, days),
    hours: Math.max(0, hours),
    minutes: Math.max(0, minutes),
    seconds: Math.max(0, seconds),
    total_seconds: Math.max(0, total_seconds),
    total_years: Number(Math.max(0, total_years).toFixed(6)),
  };
}

/**
 * Calculates remaining life based on target life expectancy.
 */
export function calculateRemainingLife(
  birthDateInput?: string | null,
  expectedLifeYears?: number,
  now?: Date
): { remaining_life: RemainingLife; remaining_seconds: number; is_gift: boolean } {
  const nowDt = now || new Date();
  const expectancy = expectedLifeYears && expectedLifeYears > 0 ? expectedLifeYears : DEFAULT_LIFE_EXPECTANCY;
  const { year: birthYear, month: birthMonth, day: birthDay } = parseBirthDateParts(birthDateInput);

  const targetDeathDate = new Date(birthYear + expectancy, birthMonth, birthDay, 0, 0, 0, 0);

  const remainingMs = targetDeathDate.getTime() - nowDt.getTime();
  const remainingSeconds = remainingMs / 1000;

  if (remainingSeconds <= 0) {
    return {
      remaining_life: { years: 0, months: 0, days: 0, total_days: 0 },
      remaining_seconds: 0,
      is_gift: true,
    };
  }

  const total_days = Math.floor(remainingMs / (86400 * 1000));
  let rem_years = targetDeathDate.getFullYear() - nowDt.getFullYear();
  let rem_months = targetDeathDate.getMonth() - nowDt.getMonth();
  let rem_days = targetDeathDate.getDate() - nowDt.getDate();

  // If time has elapsed today, subtract fractional day
  if (nowDt.getHours() > 0 || nowDt.getMinutes() > 0 || nowDt.getSeconds() > 0) {
    rem_days -= 1;
  }

  if (rem_days < 0) {
    rem_months -= 1;
    const daysInCurrentMonth = new Date(nowDt.getFullYear(), nowDt.getMonth() + 1, 0).getDate();
    rem_days += daysInCurrentMonth;
  }
  if (rem_months < 0) {
    rem_years -= 1;
    rem_months += 12;
  }

  return {
    remaining_life: {
      years: Math.max(0, rem_years),
      months: Math.max(0, rem_months),
      days: Math.max(0, rem_days),
      total_days: Math.max(0, total_days),
    },
    remaining_seconds: Number(remainingSeconds.toFixed(2)),
    is_gift: false,
  };
}

/**
 * Calculates current Year / Month / Day progress percentages.
 */
export function calculateTimeProgress(now?: Date): ProgressMetrics {
  const nowDt = now || new Date();
  const year = nowDt.getFullYear();

  // 1. Year Progress
  const startOfYear = new Date(year, 0, 1, 0, 0, 0, 0).getTime();
  const endOfYear = new Date(year + 1, 0, 1, 0, 0, 0, 0).getTime();
  const year_progress_percent = Number(
    Math.min(100, Math.max(0, ((nowDt.getTime() - startOfYear) / (endOfYear - startOfYear)) * 100)).toFixed(4)
  );

  // 2. Month Progress
  const month = nowDt.getMonth();
  const startOfMonth = new Date(year, month, 1, 0, 0, 0, 0).getTime();
  const endOfMonth = new Date(year, month + 1, 1, 0, 0, 0, 0).getTime();
  const month_progress_percent = Number(
    Math.min(100, Math.max(0, ((nowDt.getTime() - startOfMonth) / (endOfMonth - startOfMonth)) * 100)).toFixed(4)
  );

  // 3. Day Progress
  const startOfDay = new Date(year, month, nowDt.getDate(), 0, 0, 0, 0).getTime();
  const day_progress_percent = Number(
    Math.min(100, Math.max(0, ((nowDt.getTime() - startOfDay) / (86400 * 1000)) * 100)).toFixed(4)
  );

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return {
    year,
    year_progress_percent,
    month_name: monthNames[month],
    month_progress_percent,
    day_progress_percent,
  };
}

export function computeFullDashboard(
  birthDate?: string,
  expectedLifeYears?: number,
  existingData?: DashboardData | null
): DashboardData {
  const activeBirth = normalizeDateIso(birthDate || DEFAULT_BIRTH_DATE);
  const activeExpectancy = expectedLifeYears && expectedLifeYears > 0 ? expectedLifeYears : DEFAULT_LIFE_EXPECTANCY;
  const now = new Date();

  const currentAge = calculateCurrentAge(activeBirth, now);
  const { remaining_life, remaining_seconds, is_gift } = calculateRemainingLife(
    activeBirth,
    activeExpectancy,
    now
  );
  const progress = calculateTimeProgress(now);

  return {
    birth_date: activeBirth,
    expected_life_years: activeExpectancy,
    current_age: currentAge,
    remaining_life: remaining_life,
    remaining_seconds: remaining_seconds,
    is_gift: is_gift,
    gift_message: "Every new day is a gift.",
    progress: progress,
    question: existingData?.question || {
      id: 1,
      text: "If you had only one year left, what would you stop postponing today?",
      category: "existential",
    },
    quote: existingData?.quote || {
      id: 1,
      quote: "You could leave life right now. Let that determine what you do and say and think.",
      author: "Marcus Aurelius",
      source: "Meditations",
    },
  };
}
