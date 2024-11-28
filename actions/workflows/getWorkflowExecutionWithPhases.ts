"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const GetWorkflowExecutionWithPhases = async (
  workflowExecutionId: string
) => {
  const { userId } = auth();
  if (!userId) {
    throw new Error("unauthenticated");
  }
  return prisma.workflowExecution.findUnique({
    where: {
      id: workflowExecutionId,
      userId,
    },
    include: {
      phases: {
        orderBy: {
          number: "asc",
        },
      },
    },
  });
};
