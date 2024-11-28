export const LogLevels = ["info", "error", "warning"] as const;
export type LogLevel = (typeof LogLevels)[number];
export type Log = {
  message: string;
  level: LogLevel;
  timestamp: Date;
};
export type LogFunction = (message: string) => void;

export type LogCollector = {
  getAll: () => Log[];
} & {
  [key in LogLevel]: LogFunction;
};
