import { ExecutionEnvironment } from "../../../../types/executor";
import { DeliverViaWebHookTask } from "../task/DeliverViaWebhook";

export async function DeliverViaWebHookExecutor(
  environment: ExecutionEnvironment<typeof DeliverViaWebHookTask>
): Promise<boolean> {
  try {
    const targetUrl = environment.getInput("Target Url");
    if (!targetUrl) {
      environment.log.error("input->targetUrl not defined");
      return false;
    }

    const body = environment.getInput("Body");
    if (!body) {
      environment.log.error("input->body not defined");
      return false;
    }

    const result = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const statusCode = result.status;
    if (statusCode !== 200) {
      environment.log.error(
        `Failed to deliver via webhook. Status code: ${statusCode}`
      );
      return false;
    }
    const responseBody = await result.json();
    environment.log.info(
      `Delivered via webhook. Response: ${JSON.stringify(
        responseBody,
        null,
        4
      )}`
    );
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
