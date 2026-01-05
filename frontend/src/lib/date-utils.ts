import { BlacklistedDate, RecurringBlacklist } from "@/lib/api/orders";

/**
 * Check if a date matches a recurring blacklist pattern
 */
export function matchesRecurringPattern(date: Date, pattern: RecurringBlacklist): boolean {
  const dayOfWeek = date.getDay();
  const dayOfMonth = date.getDate();

  switch (pattern.type) {
    case "dayOfWeek":
      // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      return dayOfWeek === pattern.value;

    case "dayOfMonth":
      // 1-31
      return dayOfMonth === pattern.value;

    case "weekOfMonth":
      // Calculate which occurrence of this weekday in the month
      const targetDayOfWeek = pattern.dayOfWeek ?? 0;

      if (dayOfWeek !== targetDayOfWeek) {
        return false;
      }

      if (pattern.week === -1) {
        // Last occurrence of this weekday in the month
        const nextWeekSameDay = new Date(date);
        nextWeekSameDay.setDate(date.getDate() + 7);
        return nextWeekSameDay.getMonth() !== date.getMonth();
      }

      // Which occurrence of this weekday in the month (1st, 2nd, 3rd, etc.)
      const weekNumber = Math.ceil(dayOfMonth / 7);
      return weekNumber === pattern.week;

    default:
      return false;
  }
}

/**
 * Check if a specific date is blacklisted
 */
export function isDateBlacklisted(
  date: Date,
  blacklistedDates: BlacklistedDate[] = [],
  recurringBlacklists: RecurringBlacklist[] = []
): { blacklisted: boolean; reason?: string } {
  const dateString = date.toISOString().split("T")[0];

  // Check specific blacklisted dates
  const specificMatch = blacklistedDates.find((bd) => bd.date === dateString);
  if (specificMatch) {
    return { blacklisted: true, reason: specificMatch.reason };
  }

  // Check recurring patterns
  for (const pattern of recurringBlacklists) {
    if (matchesRecurringPattern(date, pattern)) {
      return { blacklisted: true, reason: pattern.reason };
    }
  }

  return { blacklisted: false };
}

/**
 * Check if a date is available for ordering
 */
export function isDateAvailable(
  date: Date,
  orderCutoffTime?: string,
  advanceOrderDays: number = 1,
  blacklistedDates: BlacklistedDate[] = [],
  recurringBlacklists: RecurringBlacklist[] = []
): { available: boolean; reason?: string } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  // Check if date is in the past
  if (targetDate < today) {
    return { available: false, reason: "Past date" };
  }

  // Check advance order days requirement
  const minDeliveryDate = new Date(today);
  minDeliveryDate.setDate(minDeliveryDate.getDate() + advanceOrderDays);

  if (targetDate < minDeliveryDate) {
    return {
      available: false,
      reason: `Orders must be placed at least ${advanceOrderDays} day(s) in advance`,
    };
  }

  // Check cutoff time for the minimum advance date
  if (orderCutoffTime && targetDate.getTime() === minDeliveryDate.getTime()) {
    const [hours, minutes] = orderCutoffTime.split(":").map(Number);
    const cutoffToday = new Date(today);
    cutoffToday.setHours(hours, minutes, 0, 0);

    if (now > cutoffToday) {
      return {
        available: false,
        reason: `Order cutoff time (${orderCutoffTime}) has passed`,
      };
    }
  }

  // Check if date is blacklisted
  const blacklistCheck = isDateBlacklisted(date, blacklistedDates, recurringBlacklists);
  if (blacklistCheck.blacklisted) {
    return {
      available: false,
      reason: blacklistCheck.reason || "Not available",
    };
  }

  return { available: true };
}

/**
 * Get disabled dates for a calendar within a date range
 */
export function getDisabledDates(
  startDate: Date,
  endDate: Date,
  orderCutoffTime?: string,
  advanceOrderDays: number = 1,
  blacklistedDates: BlacklistedDate[] = [],
  recurringBlacklists: RecurringBlacklist[] = []
): Date[] {
  const disabledDates: Date[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const { available } = isDateAvailable(
      currentDate,
      orderCutoffTime,
      advanceOrderDays,
      blacklistedDates,
      recurringBlacklists
    );

    if (!available) {
      disabledDates.push(new Date(currentDate));
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return disabledDates;
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format date as ISO string (YYYY-MM-DD)
 */
export function toISODateString(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Get the pattern description for display
 */
export function getPatternDescription(pattern: RecurringBlacklist): string {
  const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const ordinals = ["", "First", "Second", "Third", "Fourth", "Fifth"];

  switch (pattern.type) {
    case "dayOfWeek":
      return `Every ${weekDays[pattern.value ?? 0]}`;
    case "dayOfMonth":
      return `Day ${pattern.value} of every month`;
    case "weekOfMonth":
      const week = pattern.week === -1 ? "Last" : ordinals[pattern.week ?? 1];
      const day = weekDays[pattern.dayOfWeek ?? 0];
      return `${week} ${day} of every month`;
    default:
      return "Custom pattern";
  }
}
