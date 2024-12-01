'use client';

import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { DownloadIcon } from 'lucide-react';
import { toast } from 'sonner';
import { UnpublishWorkflow } from '../../../../../actions/workflows/UnpublishWorkflow';

function UnpublishBtn({ workflowId }: { workflowId: string }) {
    const mutation = useMutation({
        mutationFn: UnpublishWorkflow,
        onSuccess: () => {
            toast.success("Workflow unpublished", { id: workflowId })
        },
        onError: () => {
            toast.error("Something went wrong", { id: workflowId })
        }
    })

    return (
        <Button
            variant={'outline'}
            className='flex items-center gap-2'
            disabled={mutation.isPending}
            onClick={() => {
                toast.loading("Unpublishing workflow...", { id: workflowId })
                mutation.mutate(workflowId)
            }}
        >
            <DownloadIcon size={16} className='stroke-orange-500' />
            UnpublishBtn
        </Button>
    )
}

export default UnpublishBtn