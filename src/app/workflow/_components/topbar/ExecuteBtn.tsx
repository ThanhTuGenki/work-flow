'use client';

import { Button } from '@/components/ui/button';
import useExecutionPlan from '@/hooks/useExecutionPlan';
import { useMutation } from '@tanstack/react-query';
import { PlayIcon } from 'lucide-react';
import React from 'react'
import { RunWorkflow } from '../../../../../actions/workflows/runWorkflow';
import { toast } from 'sonner';
import { useReactFlow } from '@xyflow/react';

function ExecuteBtn({ workflowId }: { workflowId: string }) {
    const generate = useExecutionPlan();
    const { toObject } = useReactFlow();
    const mutation = useMutation({
        mutationFn: RunWorkflow,
        onSuccess: () => {
            toast.success("Flow executed successfully", { id: 'execute-workflow' })
        },
        onError: () => {
            toast.error("failed to execute Flow", { id: 'execute-workflow' })
        }
    })

    return (
        <Button
            variant={'outline'}
            className='flex items-center gap-2'
            disabled={mutation.isPending}
            onClick={() => {
                const plan = generate();
                if (!plan) {
                    // client side validation
                    return;
                }

                mutation.mutate({ workflowId: workflowId, flowDefinition: JSON.stringify(toObject()) })
            }}
        >
            <PlayIcon size={16} className='stroke-orange-400' />
            ExecuteBtn
        </Button>
    )
}

export default ExecuteBtn