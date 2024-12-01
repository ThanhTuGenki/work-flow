'use client';

import { Workflow } from '@prisma/client';
import React, { useState } from 'react'
import { WorkflowStatus } from '../../../../../types/workflow';
import { CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CoinsIcon, CornerDownRightIcon, FileTextIcon, MoreVerticalIcon, MoveRightIcon, PlayIcon, ShuffleIcon, TrashIcon } from 'lucide-react';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import TooltipWrapper from '@/components/TooltipWrapper';
import DeleteWorkflowDialog from './DeleteWorkflowDialog';
import RunBtn from './RunBtn';
import SchedulerDialog from './SchedulerDialog';
import { Badge } from '@/components/ui/badge';

const statusColors = {
    [WorkflowStatus.DRAFT]: 'bg-yellow-600 text-yellow-400',
    [WorkflowStatus.PUBLISHED]: 'bg-primary'
}

function WorkflowCard({ workflow }: { workflow: Workflow }) {
    const isDraft = workflow.status === WorkflowStatus.DRAFT;

    return (
        <div className='border border-separate shadow-sm rounded-lg overflow-hidden hover:shadow-md dark:shadow-primary/30'>
            <CardContent className='flex items-center justify-between p-4 h-[100px]'>
                <div className='flex items-center justify-end space-x-3'>
                    <div className={cn('w-10 h-10 flex items-center justify-center rounded-full', statusColors[workflow.status as WorkflowStatus])}>
                        {isDraft ? <FileTextIcon className='w-5 h-5' /> : <PlayIcon className='w-5 h-5 text-white' />}
                    </div>
                    <div>
                        <h3 className="text-base text-muted-foreground font-bold flex items-center">
                            <Link href={`/workflow/edit/${workflow.id}`} className='flex items-center hover:underline'>
                                {workflow.name}
                            </Link>
                            {isDraft && (
                                <span className="ml-2 px-2 py-0.5 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                    Draft
                                </span>
                            )}
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
        </div>
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

export default WorkflowCard;