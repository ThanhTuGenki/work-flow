'use client';

import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { CheckIcon } from 'lucide-react';
import React from 'react'
import { UpdateWorkflow } from '../../../../../actions/workflows/updateWorkflow';
import { toast } from 'sonner';
import { useReactFlow } from '@xyflow/react';

function SaveBtn({ workflowId }: { workflowId: string }) {
  const { toObject } = useReactFlow();
  const saveWorkflowMutation = useMutation({
    mutationFn: UpdateWorkflow,
    onSuccess: () => {
      toast.success("Flow save successfully", { id: 'save-workflow' })
    },
    onError: () => {
      toast.error("failed to save Flow", { id: 'save-workflow' })
    }
  })

  return (
    <Button
      variant={'outline'}
      className='flex items-center gap-2'
      onClick={() => {
        const workflowDefinition = JSON.stringify(toObject())
        toast.loading("Save flow...", { id: 'save-workflow' })
        saveWorkflowMutation.mutate({
          id: workflowId,
          definition: workflowDefinition,
        })
      }}
      disabled={saveWorkflowMutation.isPending}
    >
      <CheckIcon size={16} className='stroke-green-400' />
      Save
    </Button>
  )
}

export default SaveBtn