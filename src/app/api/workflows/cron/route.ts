import prisma from "@/lib/prisma";
import { WorkflowStatus } from "../../../../../types/workflow";
import { getAppUrl } from "@/lib/helper/appUrl";

export async function GET(req: Request) {
  const now = new Date();

  const workflows = await prisma.workflow.findMany({
    select: { id: true },
    where: {
      status: WorkflowStatus.PUBLISHED,
      nextRunAt: { lte: now },
      cron: { not: null },
    },
  });

  console.log("@@@ workflows", workflows.length);
  for (const workflow of workflows) {
    triggerWorkflow(workflow.id);
  }

  return new Response(null, { status: 200 });
}

function triggerWorkflow(id: string) {
  const triggerApiUrl = getAppUrl(`api/workflows/execute?workflowId=${id}`);
  console.log("@@trigger cron", triggerApiUrl);
}
