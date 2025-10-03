/**
 * lkTracker Integration
 * Wrapper for marketing tracking events with readiness queue and idempotency
 */

declare global {
  interface Window {
    lkTracker?: {
      trackEvent: (eventName: string) => void;
    };
  }
}

type TrackerEvent = 
  | 'lp_page_view'
  | 'lp_click_button'
  | 'accept_cookies'
  | 'show_cookies'
  | 'typ_page_view'
  | 'typ_go_service'
  | 'typ_cancel';

// Queue for events fired before tracker is ready
const eventQueue: Array<{ event: TrackerEvent; properties?: Record<string, unknown> }> = [];
let isTrackerReady = false;
let firedEvents = new Set<string>();

/**
 * Check if lkTracker is loaded
 */
const checkTrackerReady = (): boolean => {
  return typeof window.lkTracker !== 'undefined' && typeof window.lkTracker.trackEvent === 'function';
};

/**
 * Initialize tracker readiness check
 */
export const initTracker = (): void => {
  // Check immediately
  if (checkTrackerReady()) {
    isTrackerReady = true;
    flushQueue();
    return;
  }

  // Poll for tracker availability
  const interval = setInterval(() => {
    if (checkTrackerReady()) {
      isTrackerReady = true;
      clearInterval(interval);
      flushQueue();
    }
  }, 100);

  // Stop polling after 10 seconds
  setTimeout(() => {
    clearInterval(interval);
    if (!isTrackerReady) {
      console.warn('lkTracker not loaded after 10 seconds');
    }
  }, 10000);
};

/**
 * Flush queued events
 */
const flushQueue = (): void => {
  while (eventQueue.length > 0) {
    const item = eventQueue.shift();
    if (item) {
      trackEventInternal(item.event, item.properties);
    }
  }
};

/**
 * Internal track function - calls lkTracker.trackEvent
 */
const trackEventInternal = (eventName: TrackerEvent, properties?: Record<string, unknown>): void => {
  if (!window.lkTracker) {
    console.warn(`lkTracker not available for event: ${eventName}`);
    return;
  }

  try {
    // lkTracker.trackEvent only accepts event name (no properties parameter)
    window.lkTracker.trackEvent(eventName);
    console.log(`[lkTracker] Event fired: ${eventName}`, properties || '');
  } catch (error) {
    console.error(`[lkTracker] Error firing event: ${eventName}`, error);
  }
};

/**
 * Track event with idempotency and queueing
 * @param eventName - The event to track
 * @param properties - Optional event properties
 * @param allowDuplicates - Allow the same event to be fired multiple times (default: false)
 */
export const trackEvent = (
  eventName: TrackerEvent,
  properties?: Record<string, unknown>,
  allowDuplicates = false
): void => {
  // Idempotency check (unless duplicates allowed)
  if (!allowDuplicates) {
    const eventKey = `${eventName}:${JSON.stringify(properties || {})}`;
    if (firedEvents.has(eventKey)) {
      console.log(`[Tracker] Event already fired, skipping: ${eventName}`);
      return;
    }
    firedEvents.add(eventKey);
  }

  if (isTrackerReady) {
    trackEventInternal(eventName, properties);
  } else {
    // Queue event for later
    eventQueue.push({ event: eventName, properties });
    console.log(`[Tracker] Event queued: ${eventName}`);
  }
};

/**
 * Reset fired events (useful for testing)
 */
export const resetFiredEvents = (): void => {
  firedEvents = new Set<string>();
};
