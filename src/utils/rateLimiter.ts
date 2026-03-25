import { Issue } from "../models/Issue/Issue";
import { LIMITS } from "./constants";
export { formatRemainingTime } from "./dateTimeUtils";

export interface RateLimitResult {
  limited: boolean;
  count: number;
  remainingMs: number; // only meaningful when limited === true
}

/** Returns whether the user has hit the hourly submission cap. */
export const checkRateLimit = async (
  userId: string,
): Promise<RateLimitResult> => {
  const windowStart = new Date(Date.now() - LIMITS.RATE_LIMIT_WINDOW_MS);

  const issuesInWindow = await Issue.find(
    { requestedById: userId, createdAt: { $gte: windowStart } },
    { createdAt: 1 },
  ).sort({ createdAt: 1 });

  const count = issuesInWindow.length;

  if (count < LIMITS.RATE_LIMIT_MAX) {
    return { limited: false, count, remainingMs: 0 };
  }

  // Time until the oldest issue exits the window, freeing up a slot.
  const oldestCreatedAt = issuesInWindow[0].createdAt as Date;
  const remainingMs = Math.max(
    0,
    oldestCreatedAt.getTime() + LIMITS.RATE_LIMIT_WINDOW_MS - Date.now(),
  );

  return { limited: true, count, remainingMs };
};
