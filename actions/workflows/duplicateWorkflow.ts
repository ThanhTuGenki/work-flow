"use server";

import { auth } from "@clerk/nextjs/server";
import {
  duplicateWorkflowSchemaType,
  duplicateWorkflowSchema,
} from "./../../schema/workflow";
import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function duplicateWorkflow(form: duplicateWorkflowSchemaType) {
  const { success, data } = duplicateWorkflowSchema.safeParse(form);
  if (!success) {
    throw new Error("invalid form data");
  }

  const { userId } = auth();
  if (!userId) {
    throw new Error("unauthenticated");
  }

  const sourceWorkflow = await prisma.workflow.findUnique({
    where: {
      id: data.workflowId,
      userId,
    },
  });
  if (!sourceWorkflow) {
    throw new Error("workflow not found");
  }

  const result = await prisma.workflow.create({
    data: {
      userId,
      name: data.name,
      description: data.description,
      status: WorkflowStatus.DRAFT,
      definition: sourceWorkflow.definition,
    },
  });
  if (!result) {
    throw new Error("failed to create workflow");
  }

  revalidatePath("/workflows");
}
