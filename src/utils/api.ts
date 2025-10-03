/**
 * API Client for Redeem Endpoint
 */
import webhooksConfig from '@/config/webhooks.json';

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
 * Parse webhook response string
 * Examples:
 * - "OK {granted:[77,73]}"
 * - "OK {granted:[77]}"
 * - "NOT_OK {reason: ALREADY_OWN_77}"
 */
const parseWebhookResponse = (responseText: string): RedeemResult => {
  try {
    // Check if it's OK or NOT_OK
    if (responseText.startsWith('OK')) {
      // Extract granted array from "OK {granted:[77,73]}"
      const grantedMatch = responseText.match(/granted:\[([^\]]+)\]/);
      if (grantedMatch) {
        const grantedIds = grantedMatch[1].split(',').map(id => id.trim());
        return {
          status: 'OK',
          granted: grantedIds,
        };
      }
      // If no granted found, return OK with empty array
      return { status: 'OK', granted: [] };
    } else if (responseText.startsWith('NOT_OK')) {
      // Extract reason from "NOT_OK {reason: ALREADY_OWN_77}"
      const reasonMatch = responseText.match(/reason:\s*([^}]+)/);
      if (reasonMatch) {
        return {
          status: 'NOT_OK',
          reason: reasonMatch[1].trim(),
        };
      }
      return { status: 'NOT_OK', reason: 'UNKNOWN' };
    }
    
    // Unexpected format
    console.error('Unexpected webhook response format:', responseText);
    return { status: 'ERROR' };
  } catch (error) {
    console.error('Error parsing webhook response:', error);
    return { status: 'ERROR' };
  }
};

/**
 * Call claim reward webhook
 */
export const callRedeemAPI = async (
  tg_id: string,
  lang: string
): Promise<RedeemResult> => {
  const clicked_at = new Date().toISOString();
  const requestData = { tg_id, lang, clicked_at };

  try {
    const response = await fetch(webhooksConfig.claim_reward_webhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
      signal: AbortSignal.timeout(10000), // 10s timeout
    });

    const responseText = await response.text();
    
    // Try to parse as JSON first, fallback to text
    let responseData;
    try {
      responseData = JSON.parse(responseText);
      // If it's JSON with a "result" field, use that
      if (responseData && typeof responseData === 'object' && 'result' in responseData) {
        responseData = responseData.result;
      }
    } catch {
      // If not JSON, use the text directly
      responseData = responseText;
    }

    // Store webhook call for debug panel
    const webhookCall = {
      timestamp: new Date().toLocaleString(),
      endpoint: webhooksConfig.claim_reward_webhook,
      request: requestData,
      response: responseData,
      status: response.status,
    };
    
    const existingCalls = JSON.parse(sessionStorage.getItem('debug_webhook_calls') || '[]');
    existingCalls.unshift(webhookCall);
    sessionStorage.setItem('debug_webhook_calls', JSON.stringify(existingCalls.slice(0, 50)));

    if (!response.ok) {
      console.error('Webhook returned non-200:', response.status);
      return { status: 'ERROR' };
    }

    // Parse the response (which is a string like "OK {granted:[77,73]}")
    const result = parseWebhookResponse(typeof responseData === 'string' ? responseData : JSON.stringify(responseData));
    return result;
  } catch (error) {
    console.error('Webhook error:', error);
    
    // Store error in debug panel
    const webhookCall = {
      timestamp: new Date().toLocaleString(),
      endpoint: webhooksConfig.claim_reward_webhook,
      request: requestData,
      response: null,
      status: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    
    const existingCalls = JSON.parse(sessionStorage.getItem('debug_webhook_calls') || '[]');
    existingCalls.unshift(webhookCall);
    sessionStorage.setItem('debug_webhook_calls', JSON.stringify(existingCalls.slice(0, 50)));
    
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
