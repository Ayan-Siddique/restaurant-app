/**
 * Format cooldown duration from retryAfterSeconds or Retry-After header
 * into user-friendly text with sensible rounding.
 *
 * Examples:
 * - 30 -> "Please try again in about 30 seconds."
 * - 90 -> "Please try again in about 2 minutes."
 * - 812 -> "Please try again in about 14 minutes."
 * - undefined / <= 0 -> "Please try again in a little while."
 */
export function formatRetryAfter(seconds?: number): string {
  if (typeof seconds !== "number" || isNaN(seconds) || seconds <= 0) {
    return "Please try again in a little while.";
  }

  if (seconds < 60) {
    const sec = Math.max(1, Math.round(seconds));
    return `Please try again in about ${sec} ${sec === 1 ? "second" : "seconds"}.`;
  }

  if (seconds < 3600) {
    const mins = Math.max(1, Math.round(seconds / 60));
    return `Please try again in about ${mins} ${mins === 1 ? "minute" : "minutes"}.`;
  }

  const hours = Math.max(1, Math.round(seconds / 3600));
  return `Please try again in about ${hours} ${hours === 1 ? "hour" : "hours"}.`;
}

export default formatRetryAfter;
