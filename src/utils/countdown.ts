/**
 * Countdown Timer Logic
 * Calculates time remaining until next 17th at 00:00 Europe/Madrid time
 */

import { DateTime } from 'luxon';

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

/**
 * Get target launch date (next 17th at 00:00 Madrid time)
 * If override is set in env, use that instead
 */
export const getTargetDate = (): DateTime => {
  const override = import.meta.env.VITE_LAUNCH_OVERRIDE_ISO;
  
  if (override) {
    // Parse override ISO string as Madrid time
    return DateTime.fromISO(override, { zone: 'Europe/Madrid' });
  }

  // Get current time in Madrid timezone
  const now = DateTime.now().setZone('Europe/Madrid');
  
  // Target: 17th at 00:00 of current month
  let target = DateTime.fromObject(
    {
      year: now.year,
      month: now.month,
      day: 17,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    },
    { zone: 'Europe/Madrid' }
  );

  // If we're past this month's 17th at 00:00, target next month
  if (now >= target) {
    target = target.plus({ months: 1 });
  }

  return target;
};

/**
 * Calculate countdown from now to target
 */
export const calculateCountdown = (): CountdownTime => {
  const now = DateTime.now().setZone('Europe/Madrid');
  const target = getTargetDate();

  const diff = target.diff(now, ['days', 'hours', 'minutes', 'seconds']);

  if (diff.milliseconds <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
    };
  }

  return {
    days: Math.floor(diff.days),
    hours: Math.floor(diff.hours),
    minutes: Math.floor(diff.minutes),
    seconds: Math.floor(diff.seconds),
    isExpired: false,
  };
};

/**
 * Format countdown value with leading zero
 */
export const formatCountdownValue = (value: number): string => {
  return value.toString().padStart(2, '0');
};
