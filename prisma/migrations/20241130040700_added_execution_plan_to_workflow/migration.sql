-- AlterTable
ALTER TABLE `Workflow` ADD COLUMN `creditsCost` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `executionPlan` VARCHAR(191) NULL;
