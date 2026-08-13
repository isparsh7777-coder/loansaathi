const TIERS_SECONDS = [60, 120, 300, 3600, 12 * 3600, 36 * 3600];

interface LockState {
  failCount: number;
  lockedUntil: number; // epoch ms, 0 if not locked
}

const state = new Map<string, LockState>();

function keyFor(mobile: string) {
  return `otplock_${mobile}`;
}

/** Check before sending or verifying an OTP. */
export function checkLock(mobile: string): { locked: boolean; retryAfterSeconds?: number } {
  const s = state.get(keyFor(mobile));
  if (!s || s.lockedUntil === 0) return { locked: false };
  const now = Date.now();
  if (now < s.lockedUntil) {
    return { locked: true, retryAfterSeconds: Math.ceil((s.lockedUntil - now) / 1000) };
  }
  return { locked: false };
}

/** Call after a WRONG OTP. Returns the lockout duration just applied, in seconds. */
export function recordFailure(mobile: string): number {
  const k = keyFor(mobile);
  const s = state.get(k) ?? { failCount: 0, lockedUntil: 0 };
  s.failCount += 1;

  const tierIndex = Math.min(s.failCount - 1, TIERS_SECONDS.length - 1);
  const lockoutSeconds = TIERS_SECONDS[tierIndex];
  s.lockedUntil = Date.now() + lockoutSeconds * 1000;

  state.set(k, s);
  return lockoutSeconds;
}

/** Call after a CORRECT OTP — clears the failure count. */
export function resetFailures(mobile: string) {
  state.delete(keyFor(mobile));
}
