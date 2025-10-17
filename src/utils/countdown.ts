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
 * Get target launch date: October 17, 2025 at 14:55 Madrid time
 */
export const getTargetDate = (): DateTime => {
  // Target: October 17, 2025 at 14:55 Madrid time
  return DateTime.fromObject(
    {
      year: 2025,
      month: 10,
      day: 17,
      hour: 14,
      minute: 55,
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

  const diff = target.diff(now, ['days', 'hours', 'minutes', 'seconds']).toObject();

  // Check if target is in the past
  if (target < now) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
    };
  }

  return {
    days: Math.floor(diff.days || 0),
    hours: Math.floor(diff.hours || 0),
    minutes: Math.floor(diff.minutes || 0),
    seconds: Math.floor(diff.seconds || 0),
    isExpired: false,
  };
};

/**
 * Format countdown value with leading zero
 */
export const formatCountdownValue = (value: number): string => {
  return value.toString().padStart(2, '0');
};
