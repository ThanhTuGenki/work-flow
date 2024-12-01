import prisma from "@/lib/prisma";
import { timingSafeEqual } from "crypto";
import { WorkflowExecutionPlan } from "../../../../../types/workflow";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionStatus,
  WorkflowExecutionTrigger,
} from "@prisma/client";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { ExecuteWorkflow } from "@/lib/workflow/executeWorkflow";
import parser from "cron-parser";

function isValidSecret(secret: string) {
  const API_SECRET = process.env.API_SECRET;
  if (!API_SECRET) return false;

  try {
    return timingSafeEqual(Buffer.from(API_SECRET), Buffer.from(secret));
  } catch (error) {
    return false;
  }
}

export async function GET(req: Request) {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const secret = authHeader.split(" ")[1];
  if (!isValidSecret(secret)) {
    console.log("có vao day không2");

    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const workflowId = searchParams.get("workflowId");
  if (!workflowId) {
    return Response.json({ error: "bad request" }, { status: 400 });
  }

  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId },
  });
  if (!workflow) {
    return Response.json({ error: "Workflow not found" }, { status: 404 });
  }

  const executionPlan = JSON.parse(
    workflow.executionPlan!
  ) as WorkflowExecutionPlan;
  if (!executionPlan) {
    return Response.json({ error: "bad request" }, { status: 400 });
  }

  try {
    const cron = parser.parseExpression(workflow.cron!);
    const nextRun = cron.next().toDate();

    const execution = await prisma.workflowExecution.create({
      data: {
        workflowId: workflowId,
        userId: workflow.userId,
        definition: workflow.definition,
        status: WorkflowExecutionStatus.PENDING,
        createdAt: new Date(),
        trigger: WorkflowExecutionTrigger.CRON,
        phases: {
          create: executionPlan.flatMap((item) => {
            return item.nodes.map((node) => {
              return {
                userId: workflow.userId,
                status: ExecutionPhaseStatus.CREATED,
                number: item.phase,
                node: JSON.stringify(node),
                name: TaskRegistry[node.data.type].label,
              };
            });
          }),
        },
      },
    });

    await ExecuteWorkflow(execution.id, nextRun);
  } catch (error) {
    return Response.json({ error: "internal server error" }, { status: 500 });
  }

  return new Response(null, { status: 200 });
}
