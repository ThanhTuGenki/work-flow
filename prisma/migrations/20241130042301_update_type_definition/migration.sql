-- AlterTable
ALTER TABLE `ExecutionPhase` MODIFY `node` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `Workflow` MODIFY `definition` LONGTEXT NOT NULL,
    MODIFY `executionPlan` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `WorkflowExecution` MODIFY `definition` LONGTEXT NOT NULL;
