/**
 * API Client for Redeem Endpoint
 */

export interface RedeemRequest {
  tg_id: string;
  lang: string;
  clicked_at: string;
}

export interface RedeemResponseOK {
  granted: string[];
}

export interface RedeemResponseNotOK {
  reason: string;
}

export type RedeemResponse = RedeemResponseOK | RedeemResponseNotOK;

export interface RedeemResult {
  status: 'OK' | 'NOT_OK' | 'ERROR';
  granted?: string[];
  reason?: string;
}

/**
 * Call /redeem endpoint
 */
export const callRedeemAPI = async (
  tg_id: string,
  lang: string
): Promise<RedeemResult> => {
  const clicked_at = new Date().toISOString();

  try {
    const response = await fetch('/redeem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tg_id, lang, clicked_at } as RedeemRequest),
      signal: AbortSignal.timeout(10000), // 10s timeout
    });

    if (!response.ok) {
      console.error('Redeem API returned non-200:', response.status);
      return { status: 'ERROR' };
    }

    const data: RedeemResponse = await response.json();

    // Check if response has 'granted' property (OK case)
    if ('granted' in data) {
      return {
        status: 'OK',
        granted: data.granted,
      };
    }

    // Otherwise it's NOT_OK with reason
    if ('reason' in data) {
      return {
        status: 'NOT_OK',
        reason: data.reason,
      };
    }

    // Unexpected response format
    console.error('Unexpected redeem response format:', data);
    return { status: 'ERROR' };
  } catch (error) {
    console.error('Redeem API error:', error);
    return { status: 'ERROR' };
  }
};

/**
 * Store redeem result in sessionStorage
 */
export const storeRedeemResult = (result: RedeemResult): void => {
  sessionStorage.setItem('redeemResult', JSON.stringify(result));
};

/**
 * Get and clear redeem result from sessionStorage
 */
export const getAndClearRedeemResult = (): RedeemResult | null => {
  const stored = sessionStorage.getItem('redeemResult');
  if (!stored) return null;

  try {
    const result: RedeemResult = JSON.parse(stored);
    sessionStorage.removeItem('redeemResult');
    return result;
  } catch (error) {
    console.error('Failed to parse redeem result:', error);
    sessionStorage.removeItem('redeemResult');
    return null;
  }
};
