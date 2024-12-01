export enum TaskType {
  LAUNCH_BROWSER = "LAUNCH_BROWSER",
  PAGE_TO_HTML = "PAGE_TO_HTML",
  EXTRACT_TEXT_FROM_ELEMENT = "EXTRACT_TEXT_FROM_ELEMENT",
  FILL_INPUT = "FILL_INPUT",
  CLICK_ELEMENT = "CLICK_ELEMENT",
  AWAIT_FOR_ELEMENT = "AWAIT_FOR_ELEMENT",
}

export enum TaskPramType {
  STRING = "STRING",
  BROWSER_INSTANCE = "BROWSER_INSTANCE",
  SELECT = "SELECT",
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
