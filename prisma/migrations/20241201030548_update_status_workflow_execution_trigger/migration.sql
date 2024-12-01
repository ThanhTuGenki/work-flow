/*
  Warnings:

  - The values [SCHEDULED] on the enum `WorkflowExecution_trigger` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `WorkflowExecution` MODIFY `trigger` ENUM('MANUAL', 'CRON') NOT NULL;
