'use client';

import ExecutionStatusIndicator, { ExecutionStatusLabel } from '@/app/workflow/runs/[workflowId]/_components/ExecutionStatusIndicator';
import TooltipWrapper from '@/components/TooltipWrapper';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Workflow, WorkflowExecutionStatus } from '@prisma/client';
import { format, formatDistanceToNow } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { ChevronRightIcon, ClockIcon, CoinsIcon, CornerDownRightIcon, FileTextIcon, MoreVerticalIcon, MoveRightIcon, PlayIcon, ShuffleIcon, TrashIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { WorkflowStatus } from '../../../../../types/workflow';
import DeleteWorkflowDialog from './DeleteWorkflowDialog';
import DuplicateWorkflowDialog from './DuplicateWorkflowDialog';
import RunBtn from './RunBtn';
import SchedulerDialog from './SchedulerDialog';

const statusColors = {
    [WorkflowStatus.DRAFT]: 'bg-yellow-600 text-yellow-400',
    [WorkflowStatus.PUBLISHED]: 'bg-primary'
}

function WorkflowCard({ workflow }: { workflow: Workflow }) {
    const isDraft = workflow.status === WorkflowStatus.DRAFT;

    return (
        <Card className='border border-separate shadow-sm rounded-lg overflow-hidden hover:shadow-md dark:shadow-primary/30 group/card'>
            <CardContent className='flex items-center justify-between p-4 h-[100px]'>
                <div className='flex items-center justify-end space-x-3'>
                    <div className={cn('w-10 h-10 flex items-center justify-center rounded-full', statusColors[workflow.status as WorkflowStatus])}>
                        {isDraft ? <FileTextIcon className='w-5 h-5' /> : <PlayIcon className='w-5 h-5 text-white' />}
                    </div>
                    <div>
                        <h3 className="text-base text-muted-foreground font-bold flex items-center">
                            <TooltipWrapper content={workflow.description}>
                                <Link
                                    href={`/workflow/edit/${workflow.id}`}
                                    className='flex items-center hover:underline'>
                                    {workflow.name}
                                </Link>
                            </TooltipWrapper>
                            {isDraft && (
                                <span className="ml-2 px-2 py-0.5 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                    Draft
                                </span>
                            )}
                            <DuplicateWorkflowDialog workflowId={workflow.id} />
                        </h3>
                        <SchedulerSection
                            isDraft={isDraft}
                            creditsCost={workflow.creditsCost}
                            workflowId={workflow.id}
                            cron={workflow.cron}
                        />
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {!isDraft && (
                        <RunBtn workflowId={workflow.id} />
                    )}
                    <Link href={`/workflow/editor/${workflow.id}`} className={cn(
                        buttonVariants({
                            variant: 'outline',
                            size: 'sm'
                        }),
                        'flex items-center gap-2'
                    )}>
                        <ShuffleIcon size={16} />
                        Edit
                    </Link>
                    <WorkflowActions workflowName={workflow.name} workflowId={workflow.id} />
                </div>
            </CardContent>
            <LastRunDetail workflow={workflow} />
        </Card>
    )
}

function WorkflowActions({ workflowName, workflowId }: { workflowName: string; workflowId: string }) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    return <>
        <DeleteWorkflowDialog
            open={showDeleteDialog}
            setOpen={setShowDeleteDialog}
            workflowName={workflowName}
            workflowId={workflowId}
        />
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={'outline'} size={'sm'}>
                    <TooltipWrapper content={'More actions'}>
                        <div className="flex items-center justify-center w-full h-full">
                            <MoreVerticalIcon size={18} />
                        </div>
                    </TooltipWrapper>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='flex items-center text-destructive gap-2' onSelect={() => {
                    setShowDeleteDialog((prev) => !prev)
                }}>
                    <TrashIcon size={16} />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </>
}

interface SchedulerSectionProps {
    isDraft: boolean;
    creditsCost: number;
    workflowId: string;
    cron: string | null;
}

function SchedulerSection({
    isDraft,
    creditsCost,
    workflowId,
    cron
}: SchedulerSectionProps) {
    if (isDraft) return null;

    return <div className="flex items-center gap-2">
        <CornerDownRightIcon className='w-4 h-4 text-muted-foreground' />
        <SchedulerDialog
            workflowId={workflowId}
            cron={cron}
            key={`${cron}-${workflowId}`}
        />
        <MoveRightIcon className='w-4 h-4 text-muted-foreground' />
        <TooltipWrapper content='Credit consumption for full run'>
            <div className="flex items-center gap-3">
                <Badge
                    variant={'outline'}
                    className='space-x-2 text-muted-foreground rounded-sm'
                >
                    <CoinsIcon className='w-4 h-4' />
                    <span className="text-sm">{creditsCost}</span>
                </Badge>
            </div>
        </TooltipWrapper>
    </div>
}

function LastRunDetail({ workflow }: { workflow: Workflow }) {
    const { lastRunAt, lastRunStatus, lastRunId, nextRunAt } = workflow;
    const isDraft = workflow.status === WorkflowStatus.DRAFT;
    if (isDraft) return null;

    const formattedStartedAt = lastRunAt && formatDistanceToNow(lastRunAt, { addSuffix: true });
    const nextSchedule = nextRunAt && format(nextRunAt, "yyyy-MM-dd HH:mm");
    const nextScheduleUTC = nextRunAt && formatInTimeZone(nextRunAt, 'UTC', "HH:mm");

    return <div className="flex items-center justify-between px-4 py-1 bg-primary/5 text-muted-foreground">
        <div className="flex items-center justify-between w-full gap-2 text-sm">
            {lastRunAt && (
                <Link
                    href={`/workflow/runs/${workflow.id}/${lastRunId}`}
                    className='flex items-center gap-2 text-sm group'
                >
                    <span>Last run:</span>
                    <ExecutionStatusIndicator status={lastRunStatus as WorkflowExecutionStatus} />
                    <ExecutionStatusLabel status={lastRunStatus as WorkflowExecutionStatus} />
                    <span>{formattedStartedAt}</span>
                    <ChevronRightIcon
                        size={14}
                        className='group-hover:translate-x-0 transition -translate-x-[2px]'
                    />
                </Link>
            )}
            {!lastRunAt && (
                <p>No runs yet</p>
            )}
            {nextRunAt && (
                <div className="flex items-center gap-2 text-sm">
                    <ClockIcon size={12} />
                    <span>Next run at:</span>
                    <span>{nextSchedule}</span>
                    <span className='text-xs'>({nextScheduleUTC} UTC)</span>
                </div>
            )}
        </div>
    </div>
}

export default WorkflowCard;