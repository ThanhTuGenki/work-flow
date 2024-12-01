import { ExecutionEnvironment } from "../../../../types/executor";
import { TaskType } from "../../../../types/task";
import { WorkflowTask } from "../../../../types/workflow";
import { AwaitForElementExecutor } from "./AwaitForElementExecutor";
import { ClickElementExecutor } from "./ClickElementExecutor";
import { DeliverViaWebHookExecutor } from "./DeliverViaWebHookExecutor";
import { ExtractTextFromElementExecutor } from "./ExtractTextFromElementExecutor";
import { FillInputExecutor } from "./FillInputExecutor";
import { LaunchBrowserExecutor } from "./LaunchBrowserExecutor";
import { PageToHtmlExecutor } from "./PageToHtmlExecutor";

type ExecutorFn<T extends WorkflowTask> = (
  environment: ExecutionEnvironment<T>
) => Promise<boolean>;

type Registry = {
  [K in TaskType]: ExecutorFn<WorkflowTask & { type: K }>;
};

export const ExecutorRegistry: Registry = {
  LAUNCH_BROWSER: LaunchBrowserExecutor,
  PAGE_TO_HTML: PageToHtmlExecutor,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementExecutor,
  FILL_INPUT: FillInputExecutor,
  CLICK_ELEMENT: ClickElementExecutor,
  AWAIT_FOR_ELEMENT: AwaitForElementExecutor,
  DELIVER_VIA_WEBHOOK: DeliverViaWebHookExecutor,
};
