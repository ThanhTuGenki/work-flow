'use client';

import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { RunWorkflow } from '../../../../../actions/workflows/runWorkflow';
import { PlayIcon } from 'lucide-react';

function RunBtn({ workflowId }: { workflowId: string }) {
    const mutation = useMutation({
        mutationFn: RunWorkflow,
        onSuccess: () => {
            toast.success("Flow executed successfully", { id: workflowId })
        },
        onError: () => {
            toast.error("failed to execute Flow", { id: workflowId })
        }
    })

    return (
        <Button
            variant={'outline'}
            size={'sm'}
            disabled={mutation.isPending}
            className='flex items-center gap-2'
            onClick={() => {
                toast.loading("Schedule run...", { id: workflowId });
                mutation.mutate({ workflowId: workflowId });
            }}
        >
            <PlayIcon size={16}/>
            Run
        </Button>
    )
}

export default RunBtn