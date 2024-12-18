import { TaskType } from "../../../../types/task";
import { WorkflowTask } from "../../../../types/workflow";
import { AwaitForElementTask } from "./AwaitForElement";
import { ClickElementTask } from "./ClickElement";
import { DeliverViaWebHookTask } from "./DeliverViaWebhook";
import { ExtractTextFromElementTask } from "./ExtractTextFromElement";
import { FillInputTask } from "./FillInput";
import { LaunchBrowserTask } from "./LaunchBrowser";
import { PageToHtmlTask } from "./PageToHtml";

type Registry = {
    [K in TaskType]: WorkflowTask & {type: K}
}

export const TaskRegistry: Registry = {
    LAUNCH_BROWSER: LaunchBrowserTask,
    PAGE_TO_HTML: PageToHtmlTask,
    EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask,
    FILL_INPUT: FillInputTask,
    CLICK_ELEMENT: ClickElementTask,
    AWAIT_FOR_ELEMENT: AwaitForElementTask,
    DELIVER_VIA_WEBHOOK: DeliverViaWebHookTask,
}