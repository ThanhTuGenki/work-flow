'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
    TableHead,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { DatesToDurationString } from '@/lib/helper/dates';
import { GetPhaseTotalConst } from '@/lib/helper/phases';
import { executionLog } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { CalendarIcon, CircleDashedIcon, ClockIcon, CoinsIcon, Loader2Icon, LucideIcon, WorkflowIcon } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { GetWorkflowExecutionWithPhases } from '../../../../../../../actions/workflows/getWorkflowExecutionWithPhases';
import { GetWorkflowPhaseDetails } from '../../../../../../../actions/workflows/getWorkflowPhaseDetails';
import { WorkflowExecutionStatus } from '../../../../../../../types/workflow';
import { cn } from '@/lib/utils';
import { LogLevel } from '../../../../../../../types/log';
import PhaseStatusBadge from './PhaseStatusBadge';
import ReactCountUpWrapper from '@/components/ReactCountUpWrapper';

type ExecutionData = Awaited<ReturnType<typeof GetWorkflowExecutionWithPhases>>

interface Props {
    initialData: ExecutionData;
}

function ExecutionViewer({ initialData }: Props) {
    const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);
    const query = useQuery({
        queryKey: ['execution', initialData?.id],
        initialData,
        queryFn: () => GetWorkflowExecutionWithPhases(initialData!.id),
        refetchInterval: (q) => q.state.data?.status === WorkflowExecutionStatus.RUNNING ? 1000 : false
    });
    const phaseDetails = useQuery({
        queryKey: ['phaseDetails', selectedPhaseId],
        enabled: selectedPhaseId !== null,
        queryFn: () => GetWorkflowPhaseDetails(selectedPhaseId!),
    });
    const duration = DatesToDurationString(query.data?.completedAt, query.data?.startedAt);
    const creditsConsumed = GetPhaseTotalConst(query.data?.phases || []);
    const isRunning = query.data?.status === WorkflowExecutionStatus.RUNNING;

    useEffect(() => {
        // White running we auto-select the current running phase in the sidebar
        const phase = query.data?.phases || [];
        if (isRunning) {
            // Select last execution phase
            const phaseToSelect = phase.toSorted((a, b) => a.startedAt! > b.startedAt! ? -1 : 1)[0];
            setSelectedPhaseId(phaseToSelect.id);
            return;
        }

        const phaseToSelect = phase.toSorted((a, b) => a.completedAt! > b.completedAt! ? -1 : 1)[0];
        setSelectedPhaseId(phaseToSelect.id);
    }, [query.data?.phases, isRunning, setSelectedPhaseId]);


    return (
        <div className='flex w-full h-full'>
            <aside className="w-[440px] min-w-[440px] max-w-[440px] border-r-2 border-separate flex flex-grow flex-col overflow-hidden">
                <div className="py-4 px-2">
                    <ExecutionLabel
                        icon={CircleDashedIcon}
                        label='Status'
                        value={
                            <div className='flex items-center gap-2 font-semibold capitalize'>
                                <PhaseStatusBadge status={query.data?.status!} />
                                <span>{query.data?.status}</span>
                            </div>
                        }
                    />
                    <ExecutionLabel
                        icon={CalendarIcon}
                        label='Started at'
                        value={
                            <span className='lowercase'>
                                {query.data?.startedAt ? formatDistanceToNow(query.data.startedAt) : ''}
                            </span>
                        }
                    />
                    <ExecutionLabel
                        icon={ClockIcon}
                        label='Duration'
                        value={duration ? duration : (<Loader2Icon size={20} className='animate-spin' />)}
                    />
                    <ExecutionLabel
                        icon={CoinsIcon}
                        label='Credits consumed'
                        value={<ReactCountUpWrapper value={creditsConsumed} />}
                    />
                </div>
                <Separator />
                <div className="flex items-center justify-center py-2 px4">
                    <div className="text-muted-foreground flex items-center gap-2">
                        <WorkflowIcon size={20} className='stroke-muted-foreground/80' />
                        <span className='font-semibold'>Phases</span>
                    </div>
                </div>
                <Separator />
                <div className="overflow-auto h-full px-2 py-4">
                    {query.data?.phases.map((phase, index) => (
                        <Button
                            key={phase.id}
                            className='w-full justify-between'
                            variant={phase.id === selectedPhaseId ? 'secondary' : 'ghost'}
                            onClick={() => {
                                if (isRunning) return;
                                setSelectedPhaseId(phase.id);
                            }}
                        >
                            <div className="flex items-center gap-2">
                                <Badge variant={'outline'}>{index + 1}</Badge>
                                <p className="font-semibold">{phase.name}</p>
                            </div>
                            <PhaseStatusBadge status={phase.status} />
                        </Button>
                    ))}
                </div>
            </aside>
            <div className="flex w-full h-full">
                {isRunning && (
                    <div className="flex flex-col w-full h-full items-center justify-center gap-2">
                        <p className="font-bold">Run is progress, please wait</p>
                    </div>
                )}
                {!isRunning && !selectedPhaseId && (
                    <div className="flex flex-col w-full h-full items-center justify-center gap-2">
                        <div className="flex flex-col gap-1 text-center">
                            <p className="font-bold">No phase selected</p>
                            <p className="text-muted-foreground text-sm">
                                Select a phase to view its details
                            </p>
                        </div>
                    </div>
                )}
                {!isRunning && selectedPhaseId && phaseDetails.data && (
                    <div className="flex flex-col py-4 container gap-4 overflow-auto">
                        <div className="flex gap-2 items-center">
                            <Badge variant={'outline'} className='space-x-4'>
                                <div className="flex gap-1 items-center">
                                    <CoinsIcon size={18} className='stroke-muted-foreground' />
                                    <span>Credits</span>
                                </div>
                                <span>{phaseDetails.data.creditsConsumed}</span>
                            </Badge>
                            <Badge variant={'outline'} className='space-x-4'>
                                <div className="flex gap-1 items-center">
                                    <ClockIcon size={18} className='stroke-muted-foreground' />
                                    <span>Duration</span>
                                </div>
                                <span>{DatesToDurationString(phaseDetails.data?.completedAt, phaseDetails.data?.startedAt) ?? '-'}</span>
                            </Badge>
                        </div>

                        <ParameterViewer
                            title='Inputs'
                            subTitle='Inputs used for this phase'
                            paramsJson={phaseDetails.data.inputs}
                        />

                        <ParameterViewer
                            title='Outputs'
                            subTitle='Outputs used for this phase'
                            paramsJson={phaseDetails.data.outputs}
                        />

                        <LogViewer logs={phaseDetails.data.logs} />
                    </div>
                )}
            </div>
        </div>
    )
}

interface ExecutionLabelProps {
    icon: LucideIcon;
    label: ReactNode;
    value: ReactNode;
}

function ExecutionLabel({ icon: Icon, label, value }: ExecutionLabelProps) {
    return (
        <div className="flex items-center justify-between py-2 px-4 text-sm">
            <div className="text-muted-foreground flex items-center gap-2">
                <Icon size={20} className='stroke-muted-foreground/80' />
                <span>{label}</span>
            </div>
            <div className="font-semibold flex items-center gap-2">
                {value}
            </div>
        </div>
    )
}

function ParameterViewer({ title, subTitle, paramsJson }: { title: string, subTitle: string, paramsJson: string | null }) {
    const params = paramsJson ? JSON.parse(paramsJson) : null;

    return <Card>
        <CardHeader className='rounded-lg rounded-b-none border-b py-4 bg-gray-50 dark:bg-background'>
            <CardTitle className='text-base'>{title}</CardTitle>
            <CardDescription className='text-sm text-muted-foreground'>{subTitle}</CardDescription>
        </CardHeader>
        <CardContent className='py-4'>
            <div className="flex flex-col gap-2">
                {(!params || Object.keys(params).length === 0) && (
                    <p className="text-sm">No parameter generated by this phase</p>
                )}
                {params &&
                    Object.entries(params).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-center">
                            <p className="flex text-sm text-muted-foreground flex-1 basis-1/3">
                                {key}
                            </p>
                            <Input readOnly value={value as string} className='flex-1 basis-2/3' />
                        </div>
                    ))
                }
            </div>
        </CardContent>
    </Card>
}

function LogViewer({ logs }: { logs: executionLog[] | undefined }) {
    if (!logs || logs.length === 0) return null;

    return <Card className='w-full'>
        <CardHeader className='rounded-lg rounded-b-none border-b py-4 bg-gray-50 dark:bg-background'>
            <CardTitle className='text-base'>Logs</CardTitle>
            <CardDescription className='text-sm text-muted-foreground'>Logs generated by this phase</CardDescription>
        </CardHeader>
        <CardContent className='p-0'>
            <Table>
                <TableHeader className='text-sm text-muted-foreground'>
                    <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Message</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {logs.map((log) => (
                        <TableRow key={log.id} className='text-muted-foreground'>
                            <TableCell width={190} className='text-xs text-muted-foreground p-[2px] pl-4'>
                                {log.timestamp.toISOString()}
                            </TableCell>
                            <TableCell
                                width={80}
                                className={
                                    cn(
                                        'uppercase text-xs font-bold p-[3px] pl-4',
                                        (log.logLevel as LogLevel) === 'error' && 'text-destructive',
                                        (log.logLevel as LogLevel) === 'info' && 'text-primary',
                                    )
                                }
                            >
                                {log.logLevel}
                            </TableCell>
                            <TableCell className='text-sm flex-1 p-[3px] pl-4'>{log.message}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
}

export default ExecutionViewer