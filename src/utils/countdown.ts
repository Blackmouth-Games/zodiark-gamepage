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
 * Get target launch date: October 17, 2025 at 11:59 AM Madrid time
 */
export const getTargetDate = (): DateTime => {
  // Target: October 17, 2025 at 11:59 AM Madrid time
  return DateTime.fromObject(
    {
      year: 2025,
      month: 10,
      day: 17,
      hour: 11,
      minute: 59,
      second: 0,
      millisecond: 0,
    },
    { zone: 'Europe/Madrid' }
  );
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
