import { intervalToDuration } from "date-fns";

export function DatesToDurationString(
  end: Date | undefined | null,
  start: Date | undefined | null
) {
  if (!start || !end) return null;

  const timeElapsed = end.getTime() - start.getTime();

  if (timeElapsed < 1000) {
    // less than 1 second
    return `${timeElapsed}ms`;
  }

  const duration = intervalToDuration({
    start: 0,
    end: timeElapsed,
  });

  return `${duration.minutes || 0}m ${duration.seconds || 0}s`;
}