export enum TaskType {
  LAUNCH_BROWSER = "LAUNCH_BROWSER",
  PAGE_TO_HTML = "PAGE_TO_HTML",
  EXTRACT_TEXT_FROM_ELEMENT = "EXTRACT_TEXT_FROM_ELEMENT",
}

export enum TaskPramType {
  STRING = "STRING",
  BROWSER_INSTANCE = "BROWSER_INSTANCE",
}

export interface TaskParam {
  name: string;
  type: TaskPramType;
  helperText?: string;
  required?: boolean;
  hideHandle?: boolean;
  value?: string;
  variant?: string;
  [key: string]: any;
}