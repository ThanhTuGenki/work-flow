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

  for (const workflow of workflows) {
    triggerWorkflow(workflow.id);
  }

  return Response.json({ workflowsToRun: workflows.length }, { status: 200 });
}

function triggerWorkflow(id: string) {
  const triggerApiUrl = getAppUrl(`api/workflows/execute?workflowId=${id}`);

  fetch(triggerApiUrl, {
    headers: {
      Authorization: `Bearer ${process.env.API_SECRET}`,
    },
    cache: "no-cache",
  }).catch((error) => {
    console.error("Error trigger workflow with id", id, ":error ->", error);
  });
}
