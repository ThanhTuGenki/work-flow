'use client';

import CustomDialogHeader from '@/components/CustomDialogHeader';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { CalendarIcon, ClockIcon, TriangleAlertIcon } from 'lucide-react';
import { UpdateWorkflowCron } from '../../../../../actions/workflows/updateWorkflowCron';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import cronstrue from 'cronstrue';
import parser from 'cron-parser';
import { RemoveWorkflowSchedule } from '../../../../../actions/workflows/removeWorkflowSchedule';
import { Separator } from '@/components/ui/separator';

interface Props {
    workflowId: string;
    cron: string | null;
}

function SchedulerDialog(props: Props) {
    const [cron, setCron] = useState<string>(props.cron ?? '');
    const [validCron, setValidCron] = useState<boolean>(false);
    const [readableCron, setReadableCron] = useState('');

    const mutation = useMutation({
        mutationFn: UpdateWorkflowCron,
        onSuccess: () => {
            toast.success("Schedule updated successfully", { id: "cron" })
        },
        onError: () => {
            toast.error("Something went wrong", { id: "cron" })
        }
    })

    const removerScheduleMutation = useMutation({
        mutationFn: RemoveWorkflowSchedule,
        onSuccess: () => {
            toast.success("Schedule removed successfully", { id: "cron" })
        },
        onError: () => {
            toast.error("Something went wrong", { id: "cron" })
        }
    })

    useEffect(() => {
        try {
            parser.parseExpression(cron);
            const humanCronString = cronstrue.toString(cron);
            setReadableCron(humanCronString);
            setValidCron(true);
        } catch (error) {
            setValidCron(false);
        }
    }, [cron])

    const workflowHasValidCron = props.cron && props.cron.length > 0;
    const readableSaveCron = workflowHasValidCron && cronstrue.toString(props.cron!);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant={'link'}
                    size={'sm'}
                    className={cn(
                        'text-sm p-0 h-auto text-orange-500',
                        workflowHasValidCron && 'text-primary',
                    )}
                >
                    {workflowHasValidCron && (
                        <div className="flex items-center gap-2">
                            <ClockIcon />
                            {readableSaveCron}
                        </div>
                    )}
                    {!workflowHasValidCron && (
                        <div className="flex items-center gap-1">
                            <TriangleAlertIcon className='w-3 h-3' /> Set schedule
                        </div>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className='px-0'>
                <CustomDialogHeader
                    title='Schedule Workflow execution'
                    icon={CalendarIcon}
                />
                <div className="p-6 space-y-4">
                    <p className="text-muted-foreground text-sm">
                        Specify a cron expression to schedule the workflow execution. All time in UTC
                    </p>
                    <Input placeholder='E.g. * * * * *' value={cron} onChange={(e) => setCron(e.target.value)} />
                    <div className={cn(
                        'bg-accent rounded-md p-4 text-sm border border-destructive text-destructive',
                        validCron && 'border-primary text-primary',
                    )}>
                        {validCron ? readableCron : "Invalid cron expression"}
                    </div>
                    {workflowHasValidCron && (
                        <DialogClose asChild>
                            <div>
                                <Button
                                    variant={'outline'}
                                    className='w-full border border-destructive text-destructive hover:text-destructive'
                                    disabled={removerScheduleMutation.isPending || mutation.isPending}
                                    onClick={()=>{
                                        toast.loading("Removing schedule...", { id: "cron" })
                                        removerScheduleMutation.mutate(props.workflowId)
                                    }}
                                >
                                    Remove current schedule
                                </Button>
                            <Separator className='my-4' />
                            </div>
                        </DialogClose>
                    )}
                </div>
                <DialogFooter className='px-6 gap-2'>
                    <DialogClose asChild>
                        <Button className='w-full' variant={'secondary'}>Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button
                            className='w-full'
                            disabled={mutation.isPending || !validCron}
                            onClick={() => {
                                toast.loading("Schedule updating...", { id: "cron" })
                                mutation.mutate({ id: props.workflowId, cron })
                            }}
                        >
                            Save
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default SchedulerDialog