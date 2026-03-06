import { PeriodSummaryCardData } from "../types";

/**
 * Date utility functions for building period-based summary cards.
 */

export const MONTH_NAMES_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_NAMES_FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const getWeeksInMonth = (month: number, year: number): PeriodSummaryCardData[] => {
  const now = new Date();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const weeks: PeriodSummaryCardData[] = [];

  let weekStart = new Date(firstDay);
  let weekNum = 1;

  while (weekStart <= lastDay) {
    // Skip future weeks that haven't started yet
    if (weekStart > now) break;

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    if (weekEnd > lastDay) {
      weekEnd.setTime(lastDay.getTime());
    }
    weekEnd.setHours(23, 59, 59, 999);

    const isCurrent = now >= weekStart && now <= weekEnd;

    weeks.push({
      label: `Week ${weekNum}`,
      sublabel: `${MONTH_NAMES_SHORT[weekStart.getMonth()]} ${weekStart.getDate()} - ${MONTH_NAMES_SHORT[weekEnd.getMonth()]} ${weekEnd.getDate()}`,
      isCurrent,
      income: 0,
      expense: 0,
      startDate: new Date(weekStart).toISOString(),
      endDate: new Date(weekEnd).toISOString(),
    });

    weekStart = new Date(weekEnd);
    weekStart.setDate(weekStart.getDate() + 1);
    weekStart.setHours(0, 0, 0, 0);
    weekNum++;
  }

  return weeks;
};

export const getMonthsInYear = (year: number): PeriodSummaryCardData[] => {
  const now = new Date();
  return MONTH_NAMES_FULL.map((name, index) => {
    const start = new Date(year, index, 1);
    const end = new Date(year, index + 1, 0, 23, 59, 59, 999);
    const isCurrent = now.getMonth() === index && now.getFullYear() === year;

    return {
      label: `${name} ${year}`,
      sublabel: `${MONTH_NAMES_SHORT[index]} 1 - ${MONTH_NAMES_SHORT[index]} ${end.getDate()}`,
      isCurrent,
      income: 0,
      expense: 0,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    };
  }).filter((card) => new Date(card.startDate) <= now);
};

export const getYearsRange = (selectedYear: number): PeriodSummaryCardData[] => {
  const now = new Date();
  const years: PeriodSummaryCardData[] = [];

  for (let y = selectedYear - 2; y <= selectedYear + 2; y++) {
    // Skip future years
    if (y > now.getFullYear()) break;

    const start = new Date(y, 0, 1);
    const end = new Date(y, 11, 31, 23, 59, 59, 999);
    years.push({
      label: `${y}`,
      sublabel: `Jan - Dec ${y}`,
      isCurrent: now.getFullYear() === y,
      income: 0,
      expense: 0,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    });
  }

  return years;
};
